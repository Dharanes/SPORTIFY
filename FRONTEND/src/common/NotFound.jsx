import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800 text-center">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg mb-6">
          Sorry, the page you’re looking for doesn’t exist. It might have been moved or deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md shadow-md transition duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
