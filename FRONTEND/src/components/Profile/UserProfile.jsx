import React, { useEffect, useState, useMemo } from "react";
import "tailwindcss/tailwind.css";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking, getUserBooking } from "../../ReduxToolKit/TurfSlice";
import ProfileHeader from "./ProfileHeader";
import BookingList from "./BookingList";
import TabNavigation from "./TabNavigation";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [allBookings, setAllBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.turfs.profileData);
  const cancelFlag = useSelector((state) => state.turfs.cancelFlag);
  const ratingFlag = useSelector((state) => state.turfs.ratingFlag);

  const formatBookingDate = (slotDate, slotTime) => {
    const dateTimeString = `${slotDate}T${slotTime}`;
    const dateObj = new Date(dateTimeString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return dateObj.toLocaleString("en-US", options);
  };

  // Fetch user data and bookings on component mount or when cancelFlag changes
  useEffect(() => {
    dispatch(getUserBooking());
  }, [dispatch, cancelFlag, ratingFlag]);

  // Transform bookings with memoization
  const transformedBookings = useMemo(() => {
    return profileData.map((booking) => {
      const formattedDate = formatBookingDate(
        booking.slotDate,
        booking.slotTime
      );
      const isBookingPast = new Date(formattedDate) < new Date();

      return {
        id: booking.bookingId,
        title: `${booking.turfName} - ${booking.gameName}`,
        turfId: booking.turfId,
        courtName: booking.courtName,
        date: formattedDate,
        status: booking.status,
        image: booking.imageUrl,
        isPastBooking: isBookingPast,
        buttonText:
          booking.status === "CANCELLED"
            ? "Cancelled"
            : isBookingPast
            ? "View Details"
            : "Cancel",
        disabled: booking.status === "CANCELLED",
        duration: booking.duration,
        cost: booking.cost,
        isRated: booking.rated,
      };
    });
  }, [profileData]);

  useEffect(() => {
    const upcomingAndPast = transformedBookings
      .filter((booking) => booking.status !== "CANCELLED")
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

    const cancelled = transformedBookings.filter(
      (booking) => booking.status === "CANCELLED"
    );

    // Set the state with the new sorted data
    setAllBookings(upcomingAndPast);
    setCancelledBookings(cancelled);
  }, [transformedBookings]);

  const handleCancel = (bookingId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!userConfirmed) {
      return;
    }
    dispatch(cancelBooking(bookingId));

    setAllBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "CANCELLED",
              buttonText: "Cancelled",
              disabled: true,
            }
          : booking
      )
    );
    setCancelledBookings((prevCancelled) => [
      ...prevCancelled,
      allBookings.find((booking) => booking.id === bookingId),
    ]);
    setActiveTab(1); // Switch to "Cancelled Bookings" tab
  };

  const renderEmptyMessage = (message) => (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  const arr = ["All Bookings", "Cancelled Bookings"];

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <ProfileHeader />
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              arr={arr}
            />
            {activeTab === 0 &&
              (allBookings.length > 0 ? (
                <BookingList
                  bookings={allBookings}
                  title="All Bookings"
                  onCancel={handleCancel}
                />
              ) : (
                renderEmptyMessage("You have no bookings yet.")
              ))}
            {activeTab === 1 &&
              (cancelledBookings.length > 0 ? (
                <BookingList
                  bookings={cancelledBookings}
                  title="Cancelled Bookings"
                />
              ) : (
                renderEmptyMessage("You have no cancelled bookings.")
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
