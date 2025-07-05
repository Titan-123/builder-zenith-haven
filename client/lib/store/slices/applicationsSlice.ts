import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Application,
  ApplicationsResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@shared/api";
import { applicationsAPI } from "../../api";

interface ApplicationsState {
  applications: Application[];
  stats: {
    applied: number;
    interview: number;
    rejected: number;
    offer: number;
  };
  total: number;
  isLoading: boolean;
  error: string | null;
  currentApplication: Application | null;
}

const initialState: ApplicationsState = {
  applications: [],
  stats: {
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  },
  total: 0,
  isLoading: false,
  error: null,
  currentApplication: null,
};

// Async thunks
export const fetchApplications = createAsyncThunk(
  "applications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationsAPI.getApplications();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch applications");
    }
  },
);

export const fetchApplicationById = createAsyncThunk(
  "applications/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const application = await applicationsAPI.getApplicationById(id);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch application");
    }
  },
);

export const createApplication = createAsyncThunk(
  "applications/create",
  async (data: CreateApplicationRequest, { rejectWithValue }) => {
    try {
      const application = await applicationsAPI.createApplication(data);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create application");
    }
  },
);

export const updateApplication = createAsyncThunk(
  "applications/update",
  async (
    { id, data }: { id: string; data: UpdateApplicationRequest },
    { rejectWithValue },
  ) => {
    try {
      const application = await applicationsAPI.updateApplication(id, data);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update application");
    }
  },
);

export const deleteApplication = createAsyncThunk(
  "applications/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await applicationsAPI.deleteApplication(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete application");
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const application = await applicationsAPI.updateApplicationStatus(
        id,
        status,
      );
      return application;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update application status",
      );
    }
  },
);

export const updateApplicationNotes = createAsyncThunk(
  "applications/updateNotes",
  async ({ id, notes }: { id: string; notes: string }, { rejectWithValue }) => {
    try {
      const application = await applicationsAPI.updateApplicationNotes(
        id,
        notes,
      );
      return application;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update application notes",
      );
    }
  },
);

export const checkJobSaved = createAsyncThunk(
  "applications/checkSaved",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const saved = await applicationsAPI.isJobSaved(jobId);
      return { jobId, saved };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to check if job is saved",
      );
    }
  },
);

export const fetchApplicationStats = createAsyncThunk(
  "applications/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await applicationsAPI.getApplicationStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch application stats",
      );
    }
  },
);

// Applications slice
const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentApplication: (
      state,
      action: PayloadAction<Application | null>,
    ) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Applications
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchApplications.fulfilled,
        (state, action: PayloadAction<ApplicationsResponse>) => {
          state.isLoading = false;
          state.applications = action.payload.applications;
          state.stats = action.payload.stats;
          state.total = action.payload.total;
          state.error = null;
        },
      )
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Application by ID
    builder
      .addCase(fetchApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchApplicationById.fulfilled,
        (state, action: PayloadAction<Application>) => {
          state.isLoading = false;
          state.currentApplication = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Application
    builder
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createApplication.fulfilled,
        (state, action: PayloadAction<Application>) => {
          state.isLoading = false;
          state.applications.push(action.payload);
          state.total += 1;
          // Update stats
          state.stats.applied += 1;
          state.error = null;
        },
      )
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Application
    builder
      .addCase(updateApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateApplication.fulfilled,
        (state, action: PayloadAction<Application>) => {
          state.isLoading = false;
          const index = state.applications.findIndex(
            (app) => app.id === action.payload.id,
          );
          if (index !== -1) {
            state.applications[index] = action.payload;
          }
          state.error = null;
        },
      )
      .addCase(updateApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Application
    builder
      .addCase(deleteApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteApplication.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.applications = state.applications.filter(
            (app) => app.id !== action.payload,
          );
          state.total -= 1;
          state.error = null;
        },
      )
      .addCase(deleteApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Application Status
    builder.addCase(
      updateApplicationStatus.fulfilled,
      (state, action: PayloadAction<Application>) => {
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id,
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      },
    );

    // Update Application Notes
    builder.addCase(
      updateApplicationNotes.fulfilled,
      (state, action: PayloadAction<Application>) => {
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id,
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      },
    );

    // Fetch Application Stats
    builder.addCase(fetchApplicationStats.fulfilled, (state, action) => {
      state.stats = {
        applied: action.payload.applied,
        interview: action.payload.interview,
        rejected: action.payload.rejected,
        offer: action.payload.offer,
      };
    });
  },
});

export const { clearError, setCurrentApplication, clearCurrentApplication } =
  applicationsSlice.actions;
export default applicationsSlice.reducer;
