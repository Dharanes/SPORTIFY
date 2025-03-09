import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getImage, logout } from "../../ReduxToolKit/AuthSlice";
import avatar from "../../images/Avatar.png";
import AuthModal from "../Login/AuthModal";
 
export default function Header({ token }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);
  const image = useSelector((state) => state.auth.imageUpdate);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(()=>{
    dispatch(getImage(token))
  },[isLoggedIn]) 
  
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
        dispatch(logout());
        setIsDropdownOpen(false);
        navigate("/", { replace: true });
    }
};
 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
 
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);
 
  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" className="mr-3 h-12" alt="Logo" />
          </Link>
          <div className="mr-5 flex items-center lg:order-2">
            {!isLoggedIn ? (
              <button
                onClick={toggleModal} // Open modal on button click
                className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Log in/Sign Up
              </button>
            ) : (
              <div>
                <img
                  ref={avatarRef} // Attach the ref to the avatar image
                  className="w-10 rounded-full cursor-pointer"
                  src={image ? `data:image/jpeg;base64,${image}` : avatar}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  alt="User Avatar"
                />
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef} // Attach the ref to the dropdown
                    className="absolute right-10 z-10 mt-2 bg-white border border-gray-300 rounded-md divide-y shadow-lg"
                  >
                    <Link to="/profile">
                      <button
                        className="flex w-full font-medium items-center px-3 pr-20 py-2 rounded-md md:bg-white text-sm hover:bg-surface"
                        onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                      >
                        Profile
                      </button>
                    </Link>
                    <button
                      className="flex w-full font-medium items-center px-3 pr-20 py-2 rounded-md md:bg-white text-sm hover:bg-surface"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isModalOpen} onClose={toggleModal} />
    </header>
  );
}
 