import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getUserData } from "../../ReduxToolKit/AuthSlice";
import { MdAdd } from "react-icons/md";
import EditProfileModal from "./EditProfileModal";
import { BiEditAlt } from "react-icons/bi";
import { Password } from "@mui/icons-material";
import { updateUserProfile } from "../../ReduxToolKit/TurfSlice";

const ProfileHeader = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userData = useSelector((state) => state.auth.users);
  
  const[updatedUserData,setUpdatedUserData] = useState({});
  useEffect(()=>{
    setUpdatedUserData(userData)
  },[userData])

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (updatedUserData?.imageUrl) {
      setImage(updatedUserData.imageUrl);
    }
  }, [updatedUserData]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("imageUrl", file);
      dispatch(updateProfile(formData)).then(() => {
        dispatch(getUserData());
      });
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfileData = (updatedData) => {
    // Update user data state with the new values
    setUpdatedUserData({
      ...updatedUserData,
      userName: updatedData.userName,
      contactNumber: updatedData.phone,
      email: updatedData.email,
    });
    const updatedCustomerDto = {
      userName: updatedData.userName,
      password: updatedData.newPassword, // Assuming updatedData contains password as well
      email: updatedData.email,
      contactNumber: updatedData.phone,
      role: updatedUserData.role, // Assuming the role is either "USER" or "OWNER"
    };
    console.log(updatedUserData,updatedData);
    
    
    dispatch(updateUserProfile(updatedCustomerDto))
    
    // Close the modal after saving
    closeEditModal();
  };
 


  const updatedImageUrl = image || updatedUserData?.imageUrl;

  return (
    <div className="flex p-4 @container">
      <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
        <div className="flex gap-4 items-center relative">
          <div className="h-32 w-32 bg-cover bg-center rounded-full relative">
            <img
              src={updatedImageUrl ? `data:image/jpeg;base64,${updatedImageUrl}` : image}
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 p-0 bg-green-500 rounded-full shadow-lg group hover:bg-green-600">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-8 h-8 opacity-0"
                onChange={handleImageUpload}
              />
              <MdAdd className="text-white cursor-pointer" size={28} />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#111715] text-[22px] font-bold leading-tight tracking-[-0.015em] flex items-center">
              {updatedUserData?.userName}
              <BiEditAlt
                onClick={openEditModal}
                className="text-xl text-blue-500 cursor-pointer ml-2"
              />
            </p>
            <p className="text-[#648778] text-base font-normal leading-normal">
              {updatedUserData?.email}
            </p>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        userData={updatedUserData}
        onSave={handleSaveProfileData}
      />
    </div>
  );
};

export default ProfileHeader;