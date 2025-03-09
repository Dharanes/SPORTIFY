import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bookATurf } from "../../ReduxToolKit/TurfSlice";

const PaymentSuccess = () => {
  const [showTick, setShowTick] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paymentData = JSON.parse(sessionStorage.getItem('payment'));
  useEffect(() => {
    // Guard: Only execute if paymentData is available
    if (!paymentData) {
      console.error("No payment data found.");
      return;
    }

    let isDispatched = false; // Prevent multiple dispatches
    const timeout1 = setTimeout(() => {
      setShowTick(true);

      if (!isDispatched) {
        dispatch(
          bookATurf({
            turfId: paymentData.turfId,
            gameName: paymentData.gameName,
            selectedDate: paymentData.selectedDate,
            courtId: paymentData.courtId,
            selectedTime: paymentData.selectedTime,
            hours: paymentData.hours,
          })
        );
        isDispatched = true;
      }

      const timeout2 = setTimeout(() => {
        navigate("/profile",{replace: true});
      }, 2000);

      return () => clearTimeout(timeout2);
    }, 5000);

    return () => clearTimeout(timeout1);
  }, [dispatch, navigate, paymentData]);
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    {!showTick ? (
      <div className="flex flex-col items-center justify-center text-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mb-5"></div>
        <p className="text-sm text-gray-600">
          Please do not reload or close the page
        </p>
      </div>
    ) : (
      <div className="flex flex-col items-center text-green-500">
        <div className="text-6xl font-bold animate-bounce">✔</div>
        <p className="mt-3 text-lg font-semibold text-gray-800">Payment Confirmed</p>
      </div>
    )}
  </div>
  
  );
};

export default PaymentSuccess;
