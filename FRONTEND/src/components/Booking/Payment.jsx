import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { payment } from "../../ReduxToolKit/TurfSlice";

const Payment = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const bookingData = location.state || {};
  console.log(bookingData);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentData = {
      turfId: bookingData.turfId,
      turfName: bookingData.turfName,
      gameId: bookingData.gameId,
      gameName: bookingData.gameName,
      courtId: bookingData.courtId,
      courtName: bookingData.courtName,
      selectedTime: bookingData.selectedTime,
      selectedDate: bookingData.selectedDate,
      hours: bookingData.hours,
      price: bookingData.price * bookingData.hours,
    };

    dispatch(payment(paymentData));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-100 via-indigo-100 to-pink-100 px-5">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-center mb-8 text-3xl font-extrabold text-gray-800 tracking-wide">
          Payment Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className=" text-sm font-medium text-gray-600 mb-2 flex items-center space-x-2">
              <span>Game Name:</span>
            </label>
            <div className="text-sm text-gray-800 font-medium">
              {`${bookingData.gameName} - ${bookingData.courtName}`}
            </div>
          </div>

          <div className="mb-6">
            <label className=" text-sm font-medium text-gray-600 mb-2 flex items-center space-x-2">
              <span>Hours:</span>
            </label>
            <div className="text-sm text-gray-800 font-medium">
              {bookingData.hours}
            </div>
          </div>

          <div className="mb-6">
            <label className=" text-sm font-medium text-gray-600 mb-2 flex items-center space-x-2">
              <span>Total Cost:</span>
            </label>
            <div className="text-sm text-gray-800 font-medium">
              ₹{bookingData.price * bookingData.hours}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-md shadow-lg hover:from-teal-600 hover:to-teal-500 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
