import React, { useState } from "react";
import BookingModal from "./BookingModal";
import { useDispatch } from "react-redux";
import { submitRatings, updateIsRated } from "../../ReduxToolKit/TurfSlice";
import { ToastContainer, toast } from 'react-toastify';

const BookingList = ({ bookings, title, onCancel }) => {
  const [modalData, setModalData] = useState(null);
  const dispatch = useDispatch()

  const handleListClick = (item) => {
    setModalData({
      id:item.id,
      name: item.title,
      turfId:item.turfId,
      price: item.cost,
      duration: item.duration,
      courtName: item.courtName,
      buttonText: item.buttonText,
      isPastBooking: item.isPastBooking,
      isRated: item.isRated
    });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleSubmitRating = (id, turfId, rating) => {
    dispatch(submitRatings({ turfId, rating }))
      .then(() => {
        dispatch(updateIsRated(id))
          .then(() => {
            toast.success("Rating submitted successfully!", {
              autoClose: 1000,
            });
          })
          .catch((error) => {
            toast.error("Error updating rating status!", {
              autoClose: 1000,
            });
          });
      })
      .catch((error) => {
        toast.error("Error submitting rating!", {
          autoClose: 1000,
        });
      });
  };
  

  return (
    <div>
      <ToastContainer />
      <h2 className="text-[#111715] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {title}
      </h2>
      {bookings.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between cursor-pointer"
          onClick={() => handleListClick(item)} // Click handler for the list item
        >
          <div className="flex items-center gap-4">
            <img
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
              src={`data:image/jpeg;base64,${item.image}`}
              alt="Turf"
            />
            <div className="flex flex-col justify-center">
              <p className="text-[#111715] text-base font-medium leading-normal line-clamp-1">
                {item.title}
              </p>
              <p className="text-[#648778] text-sm font-normal leading-normal line-clamp-2">
                {item.date}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent button click from triggering the modal
                onCancel(item.id);
              }}
              disabled={item.disabled}
              className={`flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-8 px-4 w-fit text-sm font-medium leading-normal ${
                item.disabled
                  ? "bg-[#af4c4c] text-white cursor-default"
                  : "bg-[#f0f4f3] text-[#111715]"
              }`}
            >
              <span className="truncate">{item.buttonText}</span>
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      <BookingModal
        modalData={modalData}
        closeModal={closeModal}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
};

export default BookingList;
