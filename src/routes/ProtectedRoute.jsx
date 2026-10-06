import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Remember where they were going so we can return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}