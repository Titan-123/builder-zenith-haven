import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector, selectJobs } from "@/lib/store";
import {
  searchJobs,
  setFilters,
  fetchJobPortals,
  clearFilters,
} from "@/lib/store/slices/jobsSlice";
import { createApplication } from "@/lib/store/slices/applicationsSlice";
import { useToast } from "@/hooks/use-toast";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { jobs, isLoading, error, total, filters, portals, page, totalPages } =
    useAppSelector(selectJobs);

  const [searchForm, setSearchForm] = useState({
    search: "",
    locationSearch: "",
  });

  const [currentFilters, setCurrentFilters] = useState({
    role: "all",
    location: "all",
    experience: "all",
    salaryRange: "all",
    portal: "all",
  });

  const [sortBy, setSortBy] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchForm.search, 500);
  const debouncedLocationSearch = useDebounce(searchForm.locationSearch, 500);

  useEffect(() => {
    dispatch(searchJobs({}));
    dispatch(fetchJobPortals());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearch !== "" || debouncedLocationSearch !== "") {
      handleSearch();
    }
  }, [debouncedSearch, debouncedLocationSearch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = useCallback(() => {
    const searchFilters = {
      search: debouncedSearch,
      locationSearch: debouncedLocationSearch,
      ...currentFilters,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(searchFilters).filter(
        ([_, value]) => value !== "" && value !== "all",
      ),
    );

    const pagination = {
      page: currentPage,
      limit: 12,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    };

    dispatch(setFilters(cleanFilters));
    dispatch(searchJobs({ filters: cleanFilters, pagination }));
  }, [
    debouncedSearch,
    debouncedLocationSearch,
    currentFilters,
    currentPage,
    sortBy,
    sortOrder,
    dispatch,
  ]);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      setCurrentPage(1);

      setTimeout(() => {
        const searchFilters = {
          search: debouncedSearch,
          locationSearch: debouncedLocationSearch,
          ...newFilters,
        };

        const cleanFilters = Object.fromEntries(
          Object.entries(searchFilters).filter(
            ([_, v]) => v !== "" && v !== "all",
          ),
        );

        const pagination = {
          page: 1,
          limit: 12,
          sortBy,
          sortOrder: sortOrder as "asc" | "desc",
        };

        dispatch(setFilters(cleanFilters));
        dispatch(searchJobs({ filters: cleanFilters, pagination }));
      }, 100);

      return newFilters;
    });
  };

  const handleSearchInputChange = (key: string, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    let newSortBy = "postedDate";
    let newSortOrder = "desc";

    switch (value) {
      case "newest":
        newSortBy = "postedDate";
        newSortOrder = "desc";
        break;
      case "oldest":
        newSortBy = "postedDate";
        newSortOrder = "asc";
        break;
      case "salary-high":
        newSortBy = "salary";
        newSortOrder = "desc";
        break;
      case "salary-low":
        newSortBy = "salary";
        newSortOrder = "asc";
        break;
    }

    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);

    const searchFilters = {
      search: debouncedSearch,
      locationSearch: debouncedLocationSearch,
      ...currentFilters,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(searchFilters).filter(([_, value]) => value !== ""),
    );

    const pagination = {
      page: 1,
      limit: 12,
      sortBy: newSortBy,
      sortOrder: newSortOrder as "asc" | "desc",
    };

    dispatch(searchJobs({ filters: cleanFilters, pagination }));
  };

  const handleClearAllFilters = () => {
    setSearchForm({ search: "", locationSearch: "" });
    setCurrentFilters({
      role: "all",
      location: "all",
      experience: "all",
      salaryRange: "all",
      portal: "all",
    });
    setCurrentPage(1);
    setSortBy("postedDate");
    setSortOrder("desc");

    dispatch(clearFilters());
    dispatch(searchJobs({}));

    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await dispatch(createApplication({ jobId })).unwrap();
      toast({
        title: "Success",
        description: "Job saved to your applications!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to save job",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    const searchFilters = {
      search: debouncedSearch,
      locationSearch: debouncedLocationSearch,
      ...currentFilters,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(searchFilters).filter(
        ([_, value]) => value !== "" && value !== "all",
      ),
    );

    const pagination = {
      page: newPage,
      limit: 12,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    };

    dispatch(searchJobs({ filters: cleanFilters, pagination }));
  };

  const activeFiltersCount =
    Object.values(currentFilters).filter(
      (value) => value !== "all" && value !== "",
    ).length +
    (searchForm.search ? 1 : 0) +
    (searchForm.locationSearch ? 1 : 0);

  return {
    jobs,
    isLoading,
    total,
    portals,
    page,
    totalPages,
    searchForm,
    currentFilters,
    sortBy,
    sortOrder,
    currentPage,
    activeFiltersCount,
    handleSearchInputChange,
    handleFilterChange,
    handleSortChange,
    handleClearAllFilters,
    handleSaveJob,
    handlePageChange,
    handleSearch,
  };
};
