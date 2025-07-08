import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, DollarSign, Bookmark, Search, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector, selectJobs } from "@/lib/store";
import {
  searchJobs,
  setFilters,
  fetchJobPortals,
  clearFilters,
} from "@/lib/store/slices/jobsSlice";
import { createApplication } from "@/lib/store/slices/applicationsSlice";

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

export default function Dashboard() {
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

  // Debounce search inputs for better performance
  const debouncedSearch = useDebounce(searchForm.search, 500);
  const debouncedLocationSearch = useDebounce(searchForm.locationSearch, 500);

  // Load initial data
  useEffect(() => {
    dispatch(searchJobs({}));
    dispatch(fetchJobPortals());
  }, [dispatch]);

  // Auto-search when debounced values change
  useEffect(() => {
    if (debouncedSearch !== "" || debouncedLocationSearch !== "") {
      handleSearch();
    }
  }, [debouncedSearch, debouncedLocationSearch]);

  // Show error toast
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

    // Remove empty values
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
      const newFilters = {
        ...prev,
        [key]: value,
      };

      // Reset to first page when filters change
      setCurrentPage(1);

      // Auto-apply filters
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
    // Reset to first page when search changes
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

    // Apply new sorting
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
    setSearchForm({
      search: "",
      locationSearch: "",
    });
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

  // Count active filters
  const activeFiltersCount =
    Object.values(currentFilters).filter(
      (value) => value !== "all" && value !== "",
    ).length +
    (searchForm.search ? 1 : 0) +
    (searchForm.locationSearch ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAllFilters}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </label>
                <Select
                  value={currentFilters.role}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">
                      Full Stack Developer
                    </SelectItem>
                    <SelectItem value="designer">UX/UI Designer</SelectItem>
                    <SelectItem value="product">Product Manager</SelectItem>
                    <SelectItem value="data">Data Scientist</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location
                </label>
                <Select
                  value={currentFilters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="San Francisco, CA">
                      San Francisco, CA
                    </SelectItem>
                    <SelectItem value="New York, NY">New York, NY</SelectItem>
                    <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                    <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                    <SelectItem value="Boston, MA">Boston, MA</SelectItem>
                    <SelectItem value="Denver, CO">Denver, CO</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Experience
                </label>
                <Select
                  value={currentFilters.experience}
                  onValueChange={(value) =>
                    handleFilterChange("experience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="entry">
                      Entry Level (0-2 years)
                    </SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">
                      Senior Level (5+ years)
                    </SelectItem>
                    <SelectItem value="lead">
                      Lead/Principal (8+ years)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Salary Range
                </label>
                <Select
                  value={currentFilters.salaryRange}
                  onValueChange={(value) =>
                    handleFilterChange("salaryRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Salaries</SelectItem>
                    <SelectItem value="50-70">$50k - $70k</SelectItem>
                    <SelectItem value="70-90">$70k - $90k</SelectItem>
                    <SelectItem value="90-120">$90k - $120k</SelectItem>
                    <SelectItem value="120-150">$120k - $150k</SelectItem>
                    <SelectItem value="150+">$150k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Portal
                </label>
                <Select
                  value={currentFilters.portal}
                  onValueChange={(value) => handleFilterChange("portal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select portal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Portals</SelectItem>
                    {portals.map((portal) => (
                      <SelectItem key={portal} value={portal}>
                        {portal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-1">
                    {searchForm.search && (
                      <Badge variant="secondary" className="text-xs">
                        Search: {searchForm.search}
                      </Badge>
                    )}
                    {searchForm.locationSearch && (
                      <Badge variant="secondary" className="text-xs">
                        Location: {searchForm.locationSearch}
                      </Badge>
                    )}
                    {Object.entries(currentFilters).map(
                      ([key, value]) =>
                        value &&
                        value !== "all" && (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="text-xs"
                          >
                            {key}: {value}
                          </Badge>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search job titles, companies... (auto-search enabled)"
                    className="pl-10 h-12"
                    value={searchForm.search}
                    onChange={(e) =>
                      handleSearchInputChange("search", e.target.value)
                    }
                  />
                  {searchForm.search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => handleSearchInputChange("search", "")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search locations... (auto-search enabled)"
                    className="pl-10 h-12"
                    value={searchForm.locationSearch}
                    onChange={(e) =>
                      handleSearchInputChange("locationSearch", e.target.value)
                    }
                  />
                  {searchForm.locationSearch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() =>
                        handleSearchInputChange("locationSearch", "")
                      }
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="px-6"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleClearAllFilters}
                      className="px-4"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Found {total} Jobs
                </h2>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? "s" : ""} applied
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postedDate-desc">
                      Newest First
                    </SelectItem>
                    <SelectItem value="postedDate-asc">Oldest First</SelectItem>
                    <SelectItem value="salary-desc">Highest Salary</SelectItem>
                    <SelectItem value="salary-asc">Lowest Salary</SelectItem>
                  </SelectContent>
                </Select>

                {/* Pagination Info */}
                {totalPages > 1 && (
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading jobs...</div>
              </div>
            )}

            {/* Job Cards Grid */}
            {!isLoading && (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {job.portal}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => handleSaveJob(job.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.salary}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {job.description.substring(0, 100)}...
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Link to={`/job/${job.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              View Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSaveJob(job.id)}
                          >
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && jobs.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  {activeFiltersCount > 0
                    ? "No jobs found matching your criteria"
                    : "No jobs available at the moment"}
                </div>
                {activeFiltersCount > 0 && (
                  <Button onClick={handleClearAllFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
