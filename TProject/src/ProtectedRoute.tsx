import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const C_id = sessionStorage.getItem("C_id");

  if (!C_id) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
