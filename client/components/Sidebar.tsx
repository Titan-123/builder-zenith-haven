import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface SidebarProps {
  currentFilters: any;
  portals: string[];
  activeFiltersCount: number;
  handleFilterChange: (key: string, value: string) => void;
  handleClearAllFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentFilters,
  portals,
  activeFiltersCount,
  handleFilterChange,
  handleClearAllFilters,
}) => {
  return (
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
          {/* Role Filter */}
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
                <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                <SelectItem value="designer">UX/UI Designer</SelectItem>
                <SelectItem value="product">Product Manager</SelectItem>
                <SelectItem value="data">Data Scientist</SelectItem>
                <SelectItem value="devops">DevOps Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Location
            </label>
            <Select
              value={currentFilters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
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

          {/* Experience Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Experience
            </label>
            <Select
              value={currentFilters.experience}
              onValueChange={(value) => handleFilterChange("experience", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range Filter */}
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

          {/* Portal Filter */}
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
