import React, { useState, useEffect } from "react";
import bcrypt from 'bcryptjs';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("editProfile");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        userName: userData?.userName || "",
        email: userData?.email || "",
        phone: userData?.contactNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setActiveTab("editProfile");
    }
  }, [isOpen, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const newErrors = {};

    // Validate Profile (UserName, Email, Phone)
    if (activeTab === "editProfile") {
      if (!formData.userName || !formData.email || !formData.phone) {
        alert("Please fill in all fields.");
        return;
      }

      // Email Validation
      const email = formData.email;
      if (!email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Contact Number Validation
      const contactNumber = formData.phone;
      if (!contactNumber) {
        newErrors.contactNumber = "Contact number is required";
      } else if (!/^[6-9]/.test(contactNumber)) {
        newErrors.contactNumber = "Contact number should start with a digit between 6 and 9";
      } else if (!/^\d{10}$/.test(contactNumber)) {
        newErrors.contactNumber = "Contact number must be 10 digits";
      }
    } 
    // Validate Password (Change Password)
    else if (activeTab === "changePassword") {
      const currentPassword = formData.currentPassword;
      const newPassword = formData.newPassword;
      const confirmPassword = formData.confirmPassword;

      const isMatch = await bcrypt.compare(formData.currentPassword, userData.password.substring(8));

      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
      }
      if (!isMatch) {
        alert("Wrong password");
        return;
      }
      if (currentPassword === newPassword) {
        alert("Current password and new password should not be the same.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
      }

      // Password Validation
      if (newPassword.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        newErrors.password = "Password must contain at least one special character";
      }

      // Confirm Password Validation
      if (confirmPassword !== newPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Set errors state
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // alert("Please fix the errors before saving.");
      return;
    }

    // Proceed to save if no validation errors
    onSave(formData);
    onClose();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-6 border-b-2 border-gray-300">
          <button
            onClick={() => handleTabChange("editProfile")}
            className={`py-2 px-4 w-1/2 text-center text-sm font-medium ${activeTab === "editProfile" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => handleTabChange("changePassword")}
            className={`py-2 px-4 w-1/2 text-center text-sm font-medium ${activeTab === "changePassword" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            Change Password
          </button>
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === "editProfile" ? (
          <>
            {/* Username Field */}
            <div className="flex items-center mb-4">
              <label htmlFor="userName" className="block text-sm font-medium w-1/3 text-gray-700">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleInputChange}
                className="mt-2 p-2 w-2/3 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.userName && <div className="text-red-600 text-xs mt-1">{errors.userName}</div>}

            {/* Email Field */}
            <div className="flex items-center mb-2">
              <label htmlFor="email" className="block text-sm font-medium w-1/3 text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2 p-2 w-2/3 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.email && <div className="text-red-600 text-xs mb-2">{errors.email}</div>}

            {/* Phone Number Field */}
            <div className="flex items-center mb-4">
              <label htmlFor="phone" className="block text-sm font-medium w-1/3 text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2 p-2 w-2/3 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.contactNumber && <div className="text-red-600 text-xs mt-1">{errors.contactNumber}</div>}
          </>
        ) : (
          <>
            {/* Current Password Field */}
            <div className="flex items-center mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium w-1/3 text-gray-700">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="mt-2 p-2 w-2/3 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.currentPassword && <div className="text-red-600 text-xs mt-1">{errors.currentPassword}</div>}

            {/* New Password Field */}
            <div className="flex items-center mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium w-1/3 text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="mt-2 p-2 w-2/3 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.password && <div className="text-red-600 text-xs mt-1">{errors.password}</div>}

            {/* Confirm Password Field */}
            <div className="flex items-center mb-3">
              <label htmlFor="confirmPassword" className="block text-sm font-medium w-1/3 text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-2 p-2 w-2/3 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {errors.confirmPassword && <div className="text-red-600 text-xs mt-1">{errors.confirmPassword}</div>}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditProfileModal;
