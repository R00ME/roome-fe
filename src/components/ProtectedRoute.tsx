import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute() {
  const isAuthenticated = !!useAuthStore((state) => state.accessToken);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
