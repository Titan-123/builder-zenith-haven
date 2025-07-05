import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, UpdateProfileRequest, ProfileStatsResponse } from "@shared/api";
import { profileAPI } from "../../api";

interface ProfileState {
  profile: User | null;
  stats: ProfileStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

const initialState: ProfileState = {
  profile: null,
  stats: null,
  isLoading: false,
  error: null,
  isUpdating: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileAPI.getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const profile = await profileAPI.updateProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const profile = await profileAPI.uploadAvatar(file);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload avatar");
    }
  },
);

export const fetchProfileStats = createAsyncThunk(
  "profile/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await profileAPI.getProfileStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile stats");
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await profileAPI.deleteAccount();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete account");
    }
  },
);

export const exportData = createAsyncThunk(
  "profile/exportData",
  async (_, { rejectWithValue }) => {
    try {
      const blob = await profileAPI.exportData();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jobtracker-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return "Data exported successfully";
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to export data");
    }
  },
);

// Profile slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isUpdating = false;
          state.profile = action.payload;
          state.error = null;
        },
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Upload Avatar
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<User>) => {
        state.isUpdating = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Fetch Profile Stats
    builder
      .addCase(fetchProfileStats.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchProfileStats.fulfilled,
        (state, action: PayloadAction<ProfileStatsResponse>) => {
          state.stats = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchProfileStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.profile = null;
        state.stats = null;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Export Data
    builder
      .addCase(exportData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportData.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(exportData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
