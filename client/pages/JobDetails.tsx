import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  DollarSign,
  Clock,
  Building,
  ExternalLink,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Mock job data - in real app this would come from API
const mockJob = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  salary: "$120,000 - $160,000",
  type: "Full-time",
  portal: "LinkedIn",
  portalUrl: "https://linkedin.com/jobs/123456",
  postedDate: "2 days ago",
  description: `
We are seeking a talented Senior Frontend Developer to join our dynamic team. You will be responsible for developing and maintaining high-quality web applications using modern technologies.

## Key Responsibilities:
• Develop responsive web applications using React, TypeScript, and modern CSS
• Collaborate with designers to implement pixel-perfect UI/UX designs
• Write clean, maintainable, and well-tested code
• Optimize applications for maximum speed and scalability
• Mentor junior developers and contribute to code reviews
• Stay up-to-date with the latest frontend technologies and best practices

## Required Qualifications:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern JavaScript
• Strong experience with CSS3, HTML5, and responsive design
• Experience with state management libraries (Redux, Zustand, etc.)
• Familiarity with testing frameworks (Jest, React Testing Library)
• Knowledge of build tools and bundlers (Webpack, Vite, etc.)
• Strong problem-solving skills and attention to detail

## Preferred Qualifications:
• Experience with Next.js or other React frameworks
• Knowledge of design systems and component libraries
• Experience with GraphQL and REST APIs
• Familiarity with CI/CD pipelines
• Bachelor's degree in Computer Science or related field

## What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible working hours and remote work options
• Professional development budget
• Modern office space in downtown San Francisco
• Free lunch and snacks
• Team building events and company retreats

Join our team and help us build the next generation of web applications that will impact millions of users worldwide!
  `,
  requirements: [
    "5+ years Frontend Development",
    "React & TypeScript Expert",
    "CSS3 & Responsive Design",
    "Testing Experience",
    "Problem Solving Skills",
  ],
  benefits: [
    "Health Insurance",
    "Flexible Hours",
    "Remote Work",
    "Professional Development",
    "Equity Package",
  ],
  companyInfo: {
    size: "500-1000 employees",
    industry: "Technology",
    founded: "2015",
  },
};

export default function JobDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="p-0 h-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary">{mockJob.portal}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {mockJob.postedDate}
                  </div>
                </div>
                <CardTitle className="text-2xl lg:text-3xl mb-2">
                  {mockJob.title}
                </CardTitle>
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <Building className="w-5 h-5 mr-2" />
                  {mockJob.company}
                </div>

                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mockJob.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {mockJob.salary}
                  </div>
                  <Badge variant="outline">{mockJob.type}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {mockJob.description}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save to My Applications
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <a
                      href={mockJob.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on {mockJob.portal}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockJob.requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {req}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockJob.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Company Size:</span>
                    <span className="font-medium">
                      {mockJob.companyInfo.size}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium">
                      {mockJob.companyInfo.industry}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Founded:</span>
                    <span className="font-medium">
                      {mockJob.companyInfo.founded}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
