import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (currentUser?.role === "seller") {
      return <Navigate to="/seller-dashboard" replace />;
    } else {
      return <Navigate to="/marketplace" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
