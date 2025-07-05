import { RequestHandler } from "express";
import { Job, JobSearchResponse, ApiResponse } from "@shared/api";

// Mock jobs database
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $160,000",
    type: "Full-time",
    portal: "LinkedIn",
    portalUrl: "https://linkedin.com/jobs/123456",
    description: `We are seeking a talented Senior Frontend Developer to join our dynamic team. You will be responsible for developing and maintaining high-quality web applications using modern technologies.

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

Join our team and help us build the next generation of web applications that will impact millions of users worldwide!`,
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
    postedDate: "2024-01-15T10:00:00Z",
    companyInfo: {
      size: "500-1000 employees",
      industry: "Technology",
      founded: "2015",
    },
  },
  {
    id: "2",
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$70,000 - $100,000",
    type: "Full-time",
    portal: "Indeed",
    portalUrl: "https://indeed.com/job/789012",
    description:
      "Create user-centered designs for web and mobile applications...",
    requirements: [
      "3+ years UX Design",
      "Figma/Sketch Expert",
      "User Research",
      "Prototyping",
    ],
    benefits: [
      "Health Insurance",
      "Creative Environment",
      "Design Tools",
      "Flexible Schedule",
    ],
    postedDate: "2024-01-14T14:30:00Z",
    companyInfo: {
      size: "50-100 employees",
      industry: "Design",
      founded: "2018",
    },
  },
  {
    id: "3",
    title: "Software Engineer",
    company: "StartupXYZ",
    location: "Austin, TX",
    salary: "$90,000 - $140,000",
    type: "Full-time",
    portal: "AngelList",
    portalUrl: "https://angellist.com/job/345678",
    description: "Join our team to build scalable backend systems...",
    requirements: [
      "4+ years Backend Development",
      "Node.js/Python",
      "Database Design",
      "API Development",
    ],
    benefits: [
      "Equity",
      "Remote First",
      "Learning Budget",
      "Startup Environment",
    ],
    postedDate: "2024-01-13T09:15:00Z",
    companyInfo: {
      size: "10-50 employees",
      industry: "Technology",
      founded: "2022",
    },
  },
  {
    id: "4",
    title: "Product Manager",
    company: "InnovateCo",
    location: "Seattle, WA",
    salary: "$100,000 - $150,000",
    type: "Full-time",
    portal: "Glassdoor",
    portalUrl: "https://glassdoor.com/job/901234",
    description: "Lead product strategy and roadmap for our SaaS platform...",
    requirements: [
      "5+ years Product Management",
      "Agile/Scrum",
      "Data Analysis",
      "Stakeholder Management",
    ],
    benefits: [
      "Stock Options",
      "Health Insurance",
      "Retirement Plan",
      "Professional Development",
    ],
    postedDate: "2024-01-12T16:45:00Z",
    companyInfo: {
      size: "200-500 employees",
      industry: "Software",
      founded: "2016",
    },
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "DataDriven Ltd",
    location: "Boston, MA",
    salary: "$95,000 - $130,000",
    type: "Full-time",
    portal: "LinkedIn",
    portalUrl: "https://linkedin.com/jobs/567890",
    description: "Analyze large datasets to drive business insights...",
    requirements: [
      "PhD/Masters in Data Science",
      "Python/R",
      "Machine Learning",
      "SQL",
    ],
    benefits: [
      "Research Time",
      "Conference Budget",
      "Flexible Hours",
      "Health Benefits",
    ],
    postedDate: "2024-01-11T11:20:00Z",
    companyInfo: {
      size: "100-200 employees",
      industry: "Data Analytics",
      founded: "2019",
    },
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudFirst",
    location: "Denver, CO",
    salary: "$85,000 - $125,000",
    type: "Full-time",
    portal: "Stack Overflow",
    portalUrl: "https://stackoverflow.com/jobs/234567",
    description: "Manage cloud infrastructure and deployment pipelines...",
    requirements: [
      "AWS/Azure/GCP",
      "Docker/Kubernetes",
      "CI/CD",
      "Infrastructure as Code",
    ],
    benefits: [
      "Cloud Certifications",
      "Remote Work",
      "Tech Stipend",
      "Health Insurance",
    ],
    postedDate: "2024-01-10T13:00:00Z",
    companyInfo: {
      size: "50-100 employees",
      industry: "Cloud Services",
      founded: "2020",
    },
  },
];

export const handleSearchJobs: RequestHandler = (req, res) => {
  try {
    const {
      role,
      location,
      experience,
      salaryRange,
      portal,
      search,
      locationSearch,
      page = "1",
      limit = "10",
      sortBy = "postedDate",
      sortOrder = "desc",
    } = req.query;

    let filteredJobs = [...mockJobs];

    // Apply filters
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm),
      );
    }

    if (locationSearch) {
      const locationTerm = (locationSearch as string).toLowerCase();
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(locationTerm),
      );
    }

    if (role) {
      const roleTerm = (role as string).toLowerCase();
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(roleTerm),
      );
    }

    if (location && location !== "all") {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.includes(location as string),
      );
    }

    if (portal && portal !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.portal === portal);
    }

    // Sort jobs
    filteredJobs.sort((a, b) => {
      const order = sortOrder === "desc" ? -1 : 1;
      if (sortBy === "postedDate") {
        return (
          order *
          (new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        );
      }
      return 0;
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const searchResponse: JobSearchResponse = {
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page: pageNum,
      totalPages: Math.ceil(filteredJobs.length / limitNum),
    };

    const response: ApiResponse<JobSearchResponse> = {
      success: true,
      data: searchResponse,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetJobById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const job = mockJobs.find((j) => j.id === id);

    if (!job) {
      const response: ApiResponse = {
        success: false,
        message: "Job not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Job> = {
      success: true,
      data: job,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetFeaturedJobs: RequestHandler = (req, res) => {
  try {
    const { limit = "6" } = req.query;
    const limitNum = parseInt(limit as string);

    // Get most recent jobs as featured
    const featuredJobs = mockJobs
      .sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
      )
      .slice(0, limitNum);

    const response: ApiResponse<Job[]> = {
      success: true,
      data: featuredJobs,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetRecommendedJobs: RequestHandler = (req, res) => {
  try {
    const { limit = "10" } = req.query;
    const limitNum = parseInt(limit as string);

    // For demo, return random jobs as recommended
    const recommendedJobs = mockJobs
      .sort(() => Math.random() - 0.5)
      .slice(0, limitNum);

    const response: ApiResponse<Job[]> = {
      success: true,
      data: recommendedJobs,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetJobPortals: RequestHandler = (req, res) => {
  try {
    const portals = [...new Set(mockJobs.map((job) => job.portal))];

    const response: ApiResponse<string[]> = {
      success: true,
      data: portals,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};

export const handleGetJobStats: RequestHandler = (req, res) => {
  try {
    const stats = {
      totalJobs: mockJobs.length,
      newJobsToday: mockJobs.filter(
        (job) =>
          new Date(job.postedDate).toDateString() === new Date().toDateString(),
      ).length,
      companiesHiring: new Set(mockJobs.map((job) => job.company)).size,
      averageSalary: "$95,000",
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
};
