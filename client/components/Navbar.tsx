import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  selectIsAuthenticated,
} from "@/lib/store";
import { logoutUser } from "@/lib/store/slices/authSlice";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({
  isAuthenticated: propIsAuthenticated,
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reduxIsAuthenticated = useAppSelector(selectIsAuthenticated);

  // Use prop if provided, otherwise use Redux state
  const isAuthenticated = propIsAuthenticated ?? reduxIsAuthenticated;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  if (isAuthenticated) {
    return (
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl text-gray-900">
                  JobTracker
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/my-applications"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/my-applications"
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Applications
              </Link>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/profile"
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-gray-900">
                JobTracker
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
