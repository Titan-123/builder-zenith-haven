import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  selectApplications,
} from "@/lib/store";
import {
  fetchApplications,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
} from "@/lib/store/slices/applicationsSlice";

// Mock applications data
const mockApplications = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$80,000 - $120,000",
    appliedDate: "2024-01-15",
    status: "Interview",
    notes:
      "Had initial phone screening, technical interview scheduled for next week.",
    portal: "LinkedIn",
  },
  {
    id: 2,
    jobTitle: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$70,000 - $100,000",
    appliedDate: "2024-01-12",
    status: "Applied",
    notes: "Submitted portfolio and cover letter.",
    portal: "Indeed",
  },
  {
    id: 3,
    jobTitle: "Software Engineer",
    company: "StartupXYZ",
    location: "Austin, TX",
    salary: "$90,000 - $140,000",
    appliedDate: "2024-01-10",
    status: "Rejected",
    notes: "Received rejection email after technical assessment.",
    portal: "AngelList",
  },
  {
    id: 4,
    jobTitle: "Product Manager",
    company: "InnovateCo",
    location: "Seattle, WA",
    salary: "$100,000 - $150,000",
    appliedDate: "2024-01-08",
    status: "Offer",
    notes: "Received offer! Negotiating salary and start date.",
    portal: "Glassdoor",
  },
  {
    id: 5,
    jobTitle: "Data Scientist",
    company: "DataDriven Ltd",
    location: "Boston, MA",
    salary: "$95,000 - $130,000",
    appliedDate: "2024-01-05",
    status: "Interview",
    notes: "Completed take-home assignment, waiting for feedback.",
    portal: "LinkedIn",
  },
];

const statusColors = {
  Applied: "bg-blue-100 text-blue-800",
  Interview: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
  Offer: "bg-green-100 text-green-800",
};

export default function MyApplications() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { applications, stats, isLoading, error } =
    useAppSelector(selectApplications);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load applications on component mount
  useEffect(() => {
    dispatch(fetchApplications());
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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openNotesDialog = (app: any) => {
    setSelectedApp(app);
    setNotes(app.notes || "");
    setIsNotesDialogOpen(true);
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      await dispatch(
        updateApplicationStatus({ id: applicationId, status: newStatus }),
      ).unwrap();
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateApplicationNotes({
          id: selectedApp.id,
          notes: notes,
        }),
      ).unwrap();

      toast({
        title: "Notes Saved",
        description: "Your notes have been updated successfully",
      });
      setIsNotesDialogOpen(false);
      setSelectedApp(null);
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteApplication = async (
    applicationId: string,
    jobTitle: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete the application for "${jobTitle}"?`,
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteApplication(applicationId)).unwrap();
      toast({
        title: "Application Deleted",
        description: `Application for "${jobTitle}" has been removed`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track and manage your job applications
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {stats.applied}
              </div>
              <div className="text-sm text-gray-600">Applied</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.interview}
              </div>
              <div className="text-sm text-gray-600">Interviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.offer}
              </div>
              <div className="text-sm text-gray-600">Offers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {applications.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading applications...</div>
          </div>
        )}

        {/* Applications Table */}
        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>
                Applications ({filteredApplications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job & Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.job.title}</div>
                            <div className="text-sm text-gray-600">
                              {app.job.company}
                            </div>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {app.job.portal}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {app.job.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {app.job.salary}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={app.status}
                            onValueChange={(value) =>
                              handleStatusChange(app.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Applied">Applied</SelectItem>
                              <SelectItem value="Interview">
                                Interview
                              </SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                              <SelectItem value="Offer">Offer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openNotesDialog(app)}
                              title="Edit notes"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Link to={`/job/${app.jobId}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="View job details"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                handleDeleteApplication(app.id, app.job.title)
                              }
                              title="Delete application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Dialog */}
        <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Notes for {selectedApp?.job?.title || "Job Application"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this application..."
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsNotesDialogOpen(false);
                    setSelectedApp(null);
                    setNotes("");
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {filteredApplications.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <MessageSquare className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start applying to jobs to see them here"}
              </p>
              <Link to="/dashboard">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
