import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Job,
  JobFilters,
  JobSearchResponse,
  PaginationParams,
} from "@shared/api";
import { jobsAPI } from "../../api";

interface JobsState {
  jobs: Job[];
  featuredJobs: Job[];
  recommendedJobs: Job[];
  currentJob: Job | null;
  total: number;
  page: number;
  totalPages: number;
  filters: JobFilters;
  isLoading: boolean;
  error: string | null;
  portals: string[];
  stats: {
    totalJobs: number;
    newJobsToday: number;
    companiesHiring: number;
    averageSalary: string;
  } | null;
}

const initialState: JobsState = {
  jobs: [],
  featuredJobs: [],
  recommendedJobs: [],
  currentJob: null,
  total: 0,
  page: 1,
  totalPages: 0,
  filters: {},
  isLoading: false,
  error: null,
  portals: [],
  stats: null,
};

// Async thunks
export const searchJobs = createAsyncThunk(
  "jobs/search",
  async (
    {
      filters,
      pagination,
    }: { filters?: JobFilters; pagination?: PaginationParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await jobsAPI.searchJobs(filters, pagination);
      console.log("response===",response)
      return response;
    } catch (error: any) {
      console.error("Error searching jobs:", error);
      return rejectWithValue(error.message || "Failed to search jobs");
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const job = await jobsAPI.getJobById(id);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch job details");
    }
  },
);

export const fetchFeaturedJobs = createAsyncThunk(
  "jobs/fetchFeatured",
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const jobs = await jobsAPI.getFeaturedJobs(limit);
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch featured jobs");
    }
  },
);

export const fetchRecommendedJobs = createAsyncThunk(
  "jobs/fetchRecommended",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const jobs = await jobsAPI.getRecommendedJobs(limit);
      return jobs;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch recommended jobs",
      );
    }
  },
);

export const fetchJobPortals = createAsyncThunk(
  "jobs/fetchPortals",
  async (_, { rejectWithValue }) => {
    try {
      const portals = await jobsAPI.getJobPortals();
      return portals;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch job portals");
    }
  },
);

export const fetchJobStats = createAsyncThunk(
  "jobs/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await jobsAPI.getJobStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch job stats");
    }
  },
);

// Jobs slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<JobFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // Search Jobs
    builder
      .addCase(searchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        searchJobs.fulfilled,
        (state, action: PayloadAction<JobSearchResponse>) => {
          state.isLoading = false;
          state.jobs = action.payload.jobs;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
          state.error = null;
        },
      )
      .addCase(searchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Job by ID
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.isLoading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Featured Jobs
    builder
      .addCase(fetchFeaturedJobs.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchFeaturedJobs.fulfilled,
        (state, action: PayloadAction<Job[]>) => {
          state.featuredJobs = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchFeaturedJobs.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Recommended Jobs
    builder
      .addCase(fetchRecommendedJobs.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchRecommendedJobs.fulfilled,
        (state, action: PayloadAction<Job[]>) => {
          state.recommendedJobs = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchRecommendedJobs.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Job Portals
    builder.addCase(
      fetchJobPortals.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.portals = action.payload;
      },
    );

    // Fetch Job Stats
    builder.addCase(fetchJobStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentJob,
  clearCurrentJob,
} = jobsSlice.actions;
export default jobsSlice.reducer;
