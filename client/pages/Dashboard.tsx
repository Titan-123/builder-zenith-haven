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
import { MapPin, DollarSign, Bookmark, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector, selectJobs } from "@/lib/store";
import {
  searchJobs,
  setFilters,
  fetchJobPortals,
} from "@/lib/store/slices/jobsSlice";
import { createApplication } from "@/lib/store/slices/applicationsSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { jobs, isLoading, error, total, filters, portals } =
    useAppSelector(selectJobs);

  const [searchForm, setSearchForm] = useState({
    search: "",
    locationSearch: "",
  });

  const [currentFilters, setCurrentFilters] = useState({
    role: "",
    location: "",
    experience: "",
    salaryRange: "",
    portal: "",
  });

  // Load initial data
  useEffect(() => {
    dispatch(searchJobs({}));
    dispatch(fetchJobPortals());
  }, [dispatch]);

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

  const handleSearch = () => {
    const searchFilters = {
      ...searchForm,
      ...currentFilters,
    };

    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(searchFilters).filter(([_, value]) => value !== ""),
    );

    dispatch(setFilters(cleanFilters));
    dispatch(searchJobs({ filters: cleanFilters }));
  };

  const handleApplyFilters = () => {
    handleSearch();
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

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchInputChange = (key: string, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </label>
                <Select
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
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
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
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
                  onValueChange={(value) =>
                    handleFilterChange("experience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
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
                  onValueChange={(value) =>
                    handleFilterChange("salaryRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
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
                  onValueChange={(value) => handleFilterChange("portal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select portal" />
                  </SelectTrigger>
                  <SelectContent>
                    {portals.map((portal) => (
                      <SelectItem key={portal} value={portal}>
                        {portal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleApplyFilters}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Apply Filters"}
              </Button>
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
                    placeholder="Search job titles..."
                    className="pl-10 h-12"
                    value={searchForm.search}
                    onChange={(e) =>
                      handleSearchInputChange("search", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search locations..."
                    className="pl-10 h-12"
                    value={searchForm.locationSearch}
                    onChange={(e) =>
                      handleSearchInputChange("locationSearch", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="lg"
                  className="px-8"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search Jobs"}
                </Button>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {total} Jobs
              </h2>
              <Select defaultValue="newest">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="salary-high">Highest Salary</SelectItem>
                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                </SelectContent>
              </Select>
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

            {/* No Results */}
            {!isLoading && jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  No jobs found matching your criteria
                </div>
                <Button
                  onClick={() => {
                    setCurrentFilters({
                      role: "",
                      location: "",
                      experience: "",
                      salaryRange: "",
                      portal: "",
                    });
                    setSearchForm({
                      search: "",
                      locationSearch: "",
                    });
                    dispatch(searchJobs({}));
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
