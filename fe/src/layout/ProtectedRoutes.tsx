import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/auth/useAuth";
import LoadingCircle from "../components/loadingCircle/LoadingCircle";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingCircle />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
