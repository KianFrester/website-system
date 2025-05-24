import LoadingScreen from "../components/LoadingScreen";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { session, roles, loading } = UserAuth();

  if (loading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }

  if (!session) {
    return <Navigate to="/" />;
  }

  const safeRoles = Array.isArray(roles) ? roles : [];

  if (allowedRoles && !safeRoles.some((role) => allowedRoles.includes(role))) {
    if (safeRoles.includes("admin")) {
      return <Navigate to="/dashboard" />;
    } else if (safeRoles.includes("user")) {
      return <Navigate to="/booking" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
