import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Target, Bookmark, TrendingUp } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                All Jobs. <span className="text-primary">One Platform.</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Search and track your job applications seamlessly. Stay
                organized, never miss a deadline, and land your dream job
                faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <Search className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Job Search
                      </div>
                      <div className="text-sm text-gray-600">
                        Find opportunities that match your skills
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg">
                    <Bookmark className="w-6 h-6 text-cyan-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Save & Track
                      </div>
                      <div className="text-sm text-gray-600">
                        Keep track of all your applications
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Stay Organized
                      </div>
                      <div className="text-sm text-gray-600">
                        Never miss important deadlines
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Get Hired
                      </div>
                      <div className="text-sm text-gray-600">
                        Land your dream job faster
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-300/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Navigation Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Explore All Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take a tour of all the pages and features in the JobTracker app
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/dashboard">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Browse jobs with filters and search functionality
                </p>
              </div>
            </Link>

            <Link to="/job/1">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Job Details</h3>
                <p className="text-gray-600 text-sm">
                  View detailed job information and requirements
                </p>
              </div>
            </Link>

            <Link to="/my-applications">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Bookmark className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">My Applications</h3>
                <p className="text-gray-600 text-sm">
                  Track your job applications and their status
                </p>
              </div>
            </Link>

            <Link to="/profile">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Profile</h3>
                <p className="text-gray-600 text-sm">
                  Manage your account settings and preferences
                </p>
              </div>
            </Link>

            <Link to="/login">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Login Page</h3>
                <p className="text-gray-600 text-sm">
                  Complete login form with Google authentication
                </p>
              </div>
            </Link>

            <Link to="/register">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Register Page</h3>
                <p className="text-gray-600 text-sm">
                  Create account form with validation
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your job search with powerful tools designed for modern
              job seekers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Job Search</h3>
              <p className="text-gray-600">
                Find relevant opportunities across multiple job portals with
                advanced filtering
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Bookmark className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Application Tracking
              </h3>
              <p className="text-gray-600">
                Keep track of every application with status updates and notes
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
              <p className="text-gray-600">
                Get insights into your job search progress and improve your
                success rate
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
