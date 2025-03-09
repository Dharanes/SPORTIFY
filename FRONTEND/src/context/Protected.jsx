import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Protected({ children, authentication = true, allowedRoles = [], adminRoute = false }) {
  const authStatus = useSelector((state) => state.auth.loggedIn);
  const userRole = useSelector((state) => state.auth.role);

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      // If authentication is required and the user is not authenticated
      navigate('/signin');
    } else if (!authentication && authStatus !== authentication) {
      // If authentication is not required and the user is authenticated
      navigate('/');
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // If the user's role is not in the allowedRoles list, navigate to home
      navigate('/');
    }

    // If admin is trying to access a non-dashboard route, redirect them
    if (adminRoute && userRole === 'ADMIN' && window.location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    setLoader(false);
  }, [authStatus, authentication, allowedRoles, userRole, navigate, adminRoute]);

  return loader ? null : <>{children}</>;
}

export default Protected;
