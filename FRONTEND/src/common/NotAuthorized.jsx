import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 text-center">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-lg mb-6">
          Sorry, you do not have the required permissions to access this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md shadow-sm transition duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
