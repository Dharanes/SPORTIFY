import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, navigateToBooking, turfId, gameName, turfName }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) setIsSignIn(true);
  }, [isOpen]);
  
  if (!isOpen) return null;
 

  const toggleForm = () => setIsSignIn(!isSignIn);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleSuccess = () => {    
    if (navigateToBooking) {
      navigate(`/booking`, { state: { turfId, gameName, turfName } });
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
      style={{ zIndex: 50 }}
    >
      <div
        className="modal-content bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 m-6 mt-2">
          {isSignIn ? "Login" : "Sign Up"}
        </h2>

        {isSignIn ? (
          <SignIn onSuccess={handleSuccess} />
        ) : (
          <SignUp onSuccess={handleSuccess} />
        )}

        <div className="text-center mt-4">
          {isSignIn ? (
            <>
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="font-medium text-indigo-600 cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="font-medium text-indigo-600 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-5 font-bold text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
