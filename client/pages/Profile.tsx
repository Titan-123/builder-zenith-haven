import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Profile page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
