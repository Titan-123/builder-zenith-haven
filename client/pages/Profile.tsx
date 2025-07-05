import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Camera, Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
  joinDate: "January 2024",
  applicationsCount: 12,
  interviewsCount: 3,
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = () => {
    // Handle profile update
    setIsEditing(false);
    console.log("Profile updated:", profileData);
  };

  const handlePasswordSave = () => {
    // Handle password change
    console.log("Password changed");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="text-2xl">
                      {mockUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {mockUser.name}
                </h3>
                <p className="text-gray-600 mb-4">{mockUser.email}</p>
                <div className="text-sm text-gray-500">
                  Member since {mockUser.joinDate}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications</span>
                    <span className="font-semibold">
                      {mockUser.applicationsCount}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interviews</span>
                    <span className="font-semibold">
                      {mockUser.interviewsCount}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold">
                      {Math.round(
                        (mockUser.interviewsCount /
                          mockUser.applicationsCount) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleProfileSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Password must be at least 8 characters long and contain
                  uppercase, lowercase, numbers, and special characters.
                </div>

                <div className="flex justify-end">
                  <Button onClick={handlePasswordSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-600">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
