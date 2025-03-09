import React, { useState, useRef, useEffect } from "react";

const BookingModal = ({ modalData, closeModal, onSubmitRating }) => {
  // Check if modalData is not null and has required properties
  if (!modalData) {
    return null; // Return nothing if modalData is null or undefined
  }

  const [selectedRating, setSelectedRating] = useState(modalData.rating || 0); // Track selected rating
  const [hoveredRating, setHoveredRating] = useState(0); // Track hovered rating
  const modalRef = useRef(null); // Reference to the modal content to detect outside clicks

  // Function to handle click outside the modal
  const handleOutsideClick = (event) => {
    // If the click is outside the modal, close the modal
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  // Add the event listener when the component mounts and clean up on unmount
  useEffect(() => {
    // Adding the event listener for outside click
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleStarClick = (rating) => {
    setSelectedRating(rating); // Update the rating when a star is clicked
  };

  const handleSubmitRating = () => {
    if (selectedRating > 0) {
      onSubmitRating(modalData.id ,modalData.turfId, selectedRating); // Call the onSubmitRating function to handle the rating submission
      closeModal(); // Close the modal after submission
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div
        ref={modalRef} // Reference to the modal content
        className="relative bg-white rounded-lg p-6 w-[90%] max-w-lg transform animate-fade-in-up shadow-xl transition-all duration-500 ease-in-out ring-2 ring-blue-500 ring-opacity-50"
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          &times;
        </button>

        <h3 className="text-3xl font-semibold text-gray-900 tracking-tight mb-4">
          {modalData.name}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          <strong className="font-semibold">Price:</strong> ₹{modalData.price}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong className="font-semibold">Duration:</strong>{" "}
          {modalData.duration} {modalData.duration === 1 ? "hour" : "hours"}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong className="font-semibold">Court:</strong>{" "}
          {modalData.courtName}
        </p>

        {/* Star Rating for Past Bookings */}
        {modalData.isPastBooking && !modalData.isRated &&(
          <div className="flex items-center mt-6">
            <strong className="mr-4 text-gray-800">Rating:</strong>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill={
                    star <= (hoveredRating || selectedRating)
                      ? "#FFD700" // Filled yellow if it is <= selectedRating or hoveredRating
                      : "#D3D3D3" // Otherwise gray
                  }
                  viewBox="0 0 24 24"
                  className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 hover:fill-yellow-400"
                  onClick={() => handleStarClick(star)} // Update rating on click
                  onMouseEnter={() => setHoveredRating(star)} // Update rating on hover
                  onMouseLeave={() => setHoveredRating(0)} // Reset hover on mouse leave
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        )}

        {/* Submit Rating Button - Only visible if it's a past booking */}
        {modalData.buttonText === "View Details" && !modalData.isRated &&(
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmitRating} // Submit the rating
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:from-blue-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit Rating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
