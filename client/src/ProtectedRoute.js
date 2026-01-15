import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("loggedInUser");
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
