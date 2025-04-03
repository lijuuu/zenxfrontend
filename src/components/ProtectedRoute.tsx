
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/authUtils";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectPath = "/"
}) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      toast.error("You need to be logged in to access this page", {
        duration: 3000,
      });
    }
  }, [authenticated]);

  if (!authenticated) {
    // Redirect to the login page, but save the location they were trying to access
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
