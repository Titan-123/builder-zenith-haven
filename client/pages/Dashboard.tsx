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
import { MapPin, DollarSign, Bookmark, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$80,000 - $120,000",
    type: "Full-time",
    portal: "LinkedIn",
    description: "Build modern web applications using React and TypeScript...",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$70,000 - $100,000",
    type: "Full-time",
    portal: "Indeed",
    description: "Create user-centered designs for web and mobile apps...",
  },
  {
    id: 3,
    title: "Software Engineer",
    company: "StartupXYZ",
    location: "Austin, TX",
    salary: "$90,000 - $140,000",
    type: "Full-time",
    portal: "AngelList",
    description: "Join our team to build scalable backend systems...",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateCo",
    location: "Seattle, WA",
    salary: "$100,000 - $150,000",
    type: "Full-time",
    portal: "Glassdoor",
    description: "Lead product strategy and roadmap for our SaaS platform...",
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "DataDriven Ltd",
    location: "Boston, MA",
    salary: "$95,000 - $130,000",
    type: "Full-time",
    portal: "LinkedIn",
    description: "Analyze large datasets to drive business insights...",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudFirst",
    location: "Denver, CO",
    salary: "$85,000 - $125,000",
    type: "Full-time",
    portal: "Stack Overflow",
    description: "Manage cloud infrastructure and deployment pipelines...",
  },
];

export default function Dashboard() {
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
                <Select>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                    <SelectItem value="ny">New York, NY</SelectItem>
                    <SelectItem value="austin">Austin, TX</SelectItem>
                    <SelectItem value="seattle">Seattle, WA</SelectItem>
                    <SelectItem value="boston">Boston, MA</SelectItem>
                    <SelectItem value="denver">Denver, CO</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Experience
                </label>
                <Select>
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
                <Select>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select portal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="indeed">Indeed</SelectItem>
                    <SelectItem value="glassdoor">Glassdoor</SelectItem>
                    <SelectItem value="angellist">AngelList</SelectItem>
                    <SelectItem value="stackoverflow">
                      Stack Overflow
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full mt-6">Apply Filters</Button>
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
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search locations..."
                    className="pl-10 h-12"
                  />
                </div>
                <Button size="lg" className="px-8">
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {mockJobs.length} Jobs
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

            {/* Job Cards Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.portal}
                      </Badge>
                      <Button variant="ghost" size="sm" className="p-1">
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
                        {job.description}
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
                        <Button size="sm" className="flex-1">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
