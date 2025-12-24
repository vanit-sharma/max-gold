import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Require login for all except login page
export function RequireAuth({ children }) {
  const { data: user, initialized, loading } = useSelector((s) => s.userStore);
  if (!initialized || loading) {
    return;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children ? children : <Outlet />;
}

// Block /agent/* for role 8 (redirect to /home)
export async function BlockAgentForRole8({ children }) {
  const { data: user, initialized, loading } = useSelector((s) => s.userStore);
  if (!initialized || loading) {
    return;
  }
  if (user?.user_role === 8) {
    return <Navigate to="/home" replace />;
  }
  return children ? children : <Outlet />;
}

// For /agent/* routes: only allow user_role !== 8
export function OnlyAgentForNotRole8({ children }) {
  const { data: user, initialized, loading } = useSelector((s) => s.userStore);
  if (!initialized || loading) {
    return;
  }
  if (user.user_role === 8) {
    return <Navigate to="/agent/dashboard" replace />;
  }
  return children ? children : <Outlet />;
}

// On any non-agent page, if user_role !== 8, redirect to /agent/dashboard
export function NonAgentRedirect({ children }) {
  const { data: user, initialized, loading } = useSelector((s) => s.userStore);
  if (!initialized || loading) {
    return;
  }

  if (user && user.user_role !== 8) {
    console.log("NonAgentRedirect user details:", user);
    // return <Navigate to="/home" replace />;
  }
  return children ? children : <Outlet />;
}
