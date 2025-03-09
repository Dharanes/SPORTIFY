import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../ReduxToolKit/AuthSlice";
import { toast } from "react-toastify";
 
const SignUp = ({ onSuccess }) => {
  const dispatch = useDispatch();
 
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    role: "",
  });
 
  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
   
    // Trigger validation dynamically as user types
    validateForm({ [name]: value });
  };
 
  const validateForm = (updatedData = {}) => {
    const newErrors = { ...errors };  // Copy current errors
    const { userName, email, password, confirmPassword, contactNumber, role } = { ...formData, ...updatedData };
 
    // User Name validation
    if ('userName' in updatedData || formData.userName !== userName) {
      if (!userName) {
        newErrors.userName = "User name is required";
      } else {
        delete newErrors.userName;
      }
    }
 
    // Email validation
    if ('email' in updatedData || formData.email !== email) {
      if (!email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }
 
    // Password validation
    if ('password' in updatedData || formData.password !== password) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = "Password must contain at least one special character";
      } else {
        delete newErrors.password;
      }
    }
 
    // Confirm Password validation
    if ('confirmPassword' in updatedData || formData.confirmPassword !== confirmPassword) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }
 
    // Contact Number validation
    if ('contactNumber' in updatedData || formData.contactNumber !== contactNumber) {
      if (!contactNumber) {
        newErrors.contactNumber = "Contact number is required";
      } else if (!/^[6-9]/.test(contactNumber)) {
        newErrors.contactNumber = "Contact number should start with a digit between 6 and 9";
      } else if (!/^\d{10}$/.test(contactNumber)) {
        newErrors.contactNumber = "Contact number must be 10 digits";
      } else {
        delete newErrors.contactNumber;
      }
    }
 
    // Role validation
    if ('role' in updatedData || formData.role !== role) {
      if (!role) {
        newErrors.role = "Role is required";
      } else {
        delete newErrors.role;
      }
    }
 
    setErrors(newErrors); // Update error state dynamically
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      const { userName, email, password, contactNumber, role } = formData;
      const data = { userName, password, email, contactNumber, role };
      dispatch(register(data));
      toast.success("Registered Successfully...");
      onSuccess()
 
      // Reset form after successful submission
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        role: "",
      });
      setErrors({});
    }
  };
 
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="Enter your name"
            value={formData.userName}
            onChange={handleChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.userName && <p className="text-red-500 text-xs">{errors.userName}</p>}
        </div>
 
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>
 
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>
 
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
        </div>
 
        <div className="mb-4">
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            placeholder="Enter your mobile number"
            value={formData.contactNumber}
            onChange={handleChange}
            maxLength="10"
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber}</p>}
        </div>
 
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          >
            <option value="">Select role</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
        </div>
 
        <div className="mb-6">
          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default SignUp;
 