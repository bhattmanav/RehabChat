import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    // Show a loading indicator, you can replace this with your own loading component
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/signup" />;
}
