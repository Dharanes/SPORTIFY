import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditTurfForm from "../EditTurf/EditTurfForm.jsx";
import GameModal from "../EditTurf/AddGameModel.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../ReduxToolKit/TurfSlice.js";
import { deleteTurf } from "../../ReduxToolKit/TurfRegistrationSlice.js";

const AboutTurf = () => {
  const [selectedSection, setSelectedSection] = useState("editProfile");
  const [availableBookings, setAvailableBookings] = useState([]);
  const [showAddGameForm, setShowAddGameForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bookings = useSelector((state) => state.turfs.booking);

  function formatSlotTime(slotTime, duration) {
    const [hours, minutes] = slotTime.split(":").map(Number);
    const formattedStartTime = [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
    ].join(":");
    const formattedEndTime = [
      (hours + duration).toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
    ].join(":");
    return `${formattedStartTime} - ${formattedEndTime}`;
  }

  const location = useLocation();
  const { turf } = location.state || {};
  

  function capitalizeEachWord(text) {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleDeleteTurf = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${capitalizeEachWord(turf.turfName)}?`
    );
    if (confirmDelete) {
      try {
        dispatch(deleteTurf(turf.turfName));
        navigate("/profile");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting turf:", error);
        alert("Failed to delete turf. Please try again.");
      }
    }
  };

  useEffect(() => {
    dispatch(getBookings(turf.turfId));
  }, [dispatch]);

  useEffect(() => {
    setAvailableBookings(bookings);
  }, [bookings]);

  const getLinkClass = (section) => {
    return selectedSection === section
      ? "bg-green-400 text-white hover:bg-green-500 rounded-lg p-4"
      : "text-black hover:text-slate-600 border-transparent rounded-lg p-4";
  };

  const handleAddGameClick = () => {
    setShowAddGameForm(true);
  };

  
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex gap-4 px-16 py-8">
          {/* Left Container: Fixed with Rounded Border */}
          <div
            className="layout-content-container flex flex-col w-80 sticky top-0 border-2 border-[#dce5dc] rounded-[15px]"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 20px)",
            }}
          >
            <div className="relative h-32 sm:h-36 flex flex-col items-center">
              <img
                alt="turf Image"
                sizes="100vw"
                src={`data:image/jpeg;base64,${turf.imageUrl}`}
                className="p-4 object-cover rounded-md w-full h-full"
              />
            </div>
            <div className="flex flex-wrap justify-between gap-2 px-6 pt-3 pb-0">
              <p className="text-[#111811] tracking-light text-[25px] font-bold leading-tight min-w-68">
                {turf.turfName.toUpperCase()}
              </p>
            </div>

            <p className="text-[#638864] text-sm font-normal leading-normal px-6 py-1">
              {capitalizeEachWord(turf.turfLocation)}
            </p>
            <div className="p-6">
              <div className="flex flex-row items-center w-full md:flex-col">
                
                <button
                  className={`flex flex-col py-3 w-full transition-all duration-300 ease-in-out ${getLinkClass(
                    "editProfile"
                  )}`}
                  onClick={() => setSelectedSection("editProfile")}
                >
                  <p className="text-sm font-bold leading-normal">
                    Edit Turf Details
                  </p>
                </button>
                <button
                  className={`flex flex-col py-3 w-full transition-all duration-300 ease-in-out ${getLinkClass(
                    "bookings"
                  )}`}
                  onClick={() => setSelectedSection("bookings")}
                >
                  <p className="text-sm font-bold leading-normal">
                    All Bookings
                  </p>
                </button>
              </div>
            </div>
            <div className="flex px-6 py-6 justify-center mt-auto">
              <button
                onClick={handleDeleteTurf}
                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-700"
              >
                <span className="truncate">Delete Turf</span>
              </button>
            </div>
          </div>

          {/* Right Container: Scrollable with Rounded Border */}
          <div
            className="layout-content-container flex flex-col max-w-[960px] flex-1 overflow-y-auto border-2 border-[#dce5dc] rounded-[15px]"
            style={{ height: "calc(100vh - 20px)" }}
          >
            <div className="flex justify-between items-center p-6">
              <h2 className="sticky top-0 bg-white text-[#111811] text-[22px] font-bold leading-tight tracking-[-0.015em] z-10">
                {selectedSection === "bookings"
                  ? "All Bookings"
                  : "Edit Turf Details"}
              </h2>
              {/* Conditionally render "Add Game" button if in Edit Turf Details section */}
              {selectedSection !== "bookings" && (
                <button
                  type="button"
                  onClick={handleAddGameClick} // Replace with actual logic
                  className="text-white w-[120px] bg-green-500 mr-8 px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Add Game
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
              {selectedSection === "bookings" ? (
                <div>
                  {!availableBookings || availableBookings.length === 0 ? (
                    <div className="text-center text-[22px] font-bold text-red-500 mt-20 py-6">
                      <p>NO BOOKINGS AVAILABLE</p>
                    </div>
                  ) : (
                    availableBookings.map((booking) => (
                      <div
                        className="flex items-center gap-4 bg-white px-6 min-h-[72px] py-3"
                        key={booking.bookingId}
                      >
                        {/* 1st Column: User Profile */}
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14"
                          style={{
                            backgroundImage: `url(data:image/jpeg;base64,${booking.imageUrl})`,
                          }} // user profile pic
                        ></div>

                        {/* 2nd Column: Name & Game Info */}
                        <div className="flex flex-col justify-between w-1/3">
                          <p className="text-[#111811] text-base font-medium leading-normal line-clamp-1">
                            {booking.userName}
                          </p>{" "}
                          {/* get user name using user id*/}
                          <p className="text-[#638864] text-sm font-normal leading-normal line-clamp-2">
                            {booking.gameName} - {booking.courtName}
                          </p>
                        </div>

                        {/* 3rd Column: Date & Time Slot */}
                        <div className="flex flex-col justify-between w-1/3">
                          <p className="text-sm text-[#444444] pb-1 font-normal">
                            {new Date(booking.slotDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#444444] font-normal">
                            {formatSlotTime(booking.slotTime, booking.duration)}
                          </p>
                        </div>

                        {/* 4th Column: Total Price */}
                        <div className="flex flex-col justify-between w-1/3">
                          <p className="text-sm text-[#00ff73] font-bold">
                            Status: {booking.status}
                          </p>
                          <p className="text-sm text-[#FF6F00] font-bold">
                            Total Price: Rs {booking.cost}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <EditTurfForm turfId={turf.turfId} />
              )}
            </div>
          </div>
        </div>
      </div>
      <GameModal
        isModalOpen={showAddGameForm}
        setIsModalOpen={setShowAddGameForm}
        turfName={turf.turfName}
        turfId={turf.turfId}
      />
    </div>
  );
};

export default AboutTurf;
