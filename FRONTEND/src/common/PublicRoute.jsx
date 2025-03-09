import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element: Component }) => {
  const { loggedIn, role } = useSelector((state) => state.auth);

  if (loggedIn && role ==="ADMIN" || role ==="OWNER") {
    // Redirect logged-in users to a specific route based on their role
    const redirectPath = role === "ADMIN"
      ? "/dashboard"
      : role === "OWNER"
      ? "/profile"
      : "/"; // Default to profile for general users

    return <Navigate to={redirectPath} />;
  }

  // Public routes are accessible if the user is not authenticated
  return <Component />;
};

export default PublicRoute;
