import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/authSlice";
import jobsReducer from "./slices/jobsSlice";
import applicationsReducer from "./slices/applicationsSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectJobs = (state: RootState) => state.jobs;
export const selectApplications = (state: RootState) => state.applications;
export const selectProfile = (state: RootState) => state.profile;

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Jobs selectors
export const selectJobsList = (state: RootState) => state.jobs.jobs;
export const selectCurrentJob = (state: RootState) => state.jobs.currentJob;
export const selectFeaturedJobs = (state: RootState) => state.jobs.featuredJobs;
export const selectRecommendedJobs = (state: RootState) =>
  state.jobs.recommendedJobs;
export const selectJobsLoading = (state: RootState) => state.jobs.isLoading;
export const selectJobsError = (state: RootState) => state.jobs.error;
export const selectJobFilters = (state: RootState) => state.jobs.filters;
export const selectJobsPagination = (state: RootState) => ({
  page: state.jobs.page,
  total: state.jobs.total,
  totalPages: state.jobs.totalPages,
});

// Applications selectors
export const selectApplicationsList = (state: RootState) =>
  state.applications.applications;
export const selectApplicationsStats = (state: RootState) =>
  state.applications.stats;
export const selectApplicationsLoading = (state: RootState) =>
  state.applications.isLoading;
export const selectApplicationsError = (state: RootState) =>
  state.applications.error;
export const selectCurrentApplication = (state: RootState) =>
  state.applications.currentApplication;

// Profile selectors
export const selectProfileData = (state: RootState) => state.profile.profile;
export const selectProfileStats = (state: RootState) => state.profile.stats;
export const selectProfileLoading = (state: RootState) =>
  state.profile.isLoading;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectProfileUpdating = (state: RootState) =>
  state.profile.isUpdating;
