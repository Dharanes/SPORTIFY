import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { logout, refreshJwtToken } from "../ReduxToolKit/AuthSlice";

export const useTokenMonitor = (token) => {
  const dispatch = useDispatch(); 
  
  useEffect(() => {
    let decoded;
    try {
      if(token){
        decoded = jwtDecode(token);
      }
      if (!decoded || !decoded.exp) {
        // console.error("Decoded token missing expiration date, logging out.");
        dispatch(logout());
        return;
      }

      
    } catch (error) {
      console.error("Error decoding token:", error);
      dispatch(logout());
      return;
    }

    const { exp } = decoded; // exp is in seconds
    const expirationTime = exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    if (timeUntilExpiry <= 0) {
      console.log("Token already expired, logging out.");
      dispatch(logout());
      return;
    }

    // Set a timer to trigger 5 minutes before the token expires
    const timer = setTimeout(() => {
      const userWantsToExtend = window.confirm(
        "Your session is about to expire. Do you want to extend your session?"
      );

      if (userWantsToExtend) {
        refreshToken();
      } else {
        dispatch(logout());
      }
    }, timeUntilExpiry - 5 * 60 * 1000);

    // Clean up timer on component unmount or token change
    return () => clearTimeout(timer);
  }, [token, dispatch]);

  const refreshToken = async () => {
    try {
      // Dispatch action to refresh the token
      dispatch(refreshJwtToken());
    } catch (error) {
      console.error("Error refreshing token:", error);
      dispatch(logout());
    }
  };
};
