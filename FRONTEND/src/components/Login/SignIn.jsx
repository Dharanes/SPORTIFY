import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../ReduxToolKit/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify styles

const SignIn = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.loggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const loginError = useSelector((state) => state.auth.error);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    dispatch(login(formData));
  };

  useEffect(() => {
    if (authStatus) {
      if (userRole === "ADMIN") {
        navigate("/dashboard");
      } else {
        toast.success("Login successful", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        onSuccess(); // Close modal after successful login
      }
    }
  }, [authStatus, userRole, onSuccess]);

  useEffect(() => {
    if (loginError) {
      toast.error(`Error: ${loginError}`, {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      setFormData({
        email: "",
        password: "",
      });
    }
  }, [loginError]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sign In
        </button>
      </form>

      {/* Internal CSS for custom toast positioning */}
      <style jsx>{`
        .custom-toast-position {
          margin-top: 20%;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
