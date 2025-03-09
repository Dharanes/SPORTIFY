import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element: Component, allowedRoles }) => {
  const { loggedIn, role } = useSelector((state) => state.auth);
  if (!loggedIn) {
    // Redirect to sign-in page if not authenticated
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" />;
  }
  

  return <Component />;
};

export default PrivateRoute;
