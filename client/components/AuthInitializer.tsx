import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store";
import { getCurrentUser } from "@/lib/store/slices/authSlice";
import { authAPI } from "@/lib/api";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (authAPI.isAuthenticated()) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}
