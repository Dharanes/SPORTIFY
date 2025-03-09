import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  bookATurf,
  getCourts,
  getGamesByTurfId,
  getPrice,
  getTimeSlot,
} from "../../ReduxToolKit/TurfSlice";

function Booking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const turfId = location.state?.turfId || "";
  const gameName = location.state?.gameName || "";
  const turfName = location.state?.turfName || "";

  const [maxTime, setMaxTime] = useState(25);
  const [minTime, setMinTime] = useState(1);


  const games = useSelector((state) => state.turfs.games);
  const timeSlots = useSelector((state) => state.turfs.timeSlots);
  const courts = useSelector((state) => state.turfs.courts);
  const price = useSelector((state) => state.turfs.price);

  const gameId = games.filter(game => game.game.toLowerCase() === gameName.toLowerCase())
                    .map(game => game.gameID);

  const [selectedGame, setSelectedGame] = useState(gameId);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCourt, setSelectedCourt] = useState('');

  let [hours, setHours] = useState(1);
  
  
  const [availableGames, setAvailableGames] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableCourts, setAvailableCourts] = useState([]);
  // console.log(availableGames);
  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateString = maxDate.toISOString().split("T")[0];

    document.getElementById("date").setAttribute("min", todayString);
    document.getElementById("date").setAttribute("max", maxDateString);
  }, [turfId]);

  useEffect(()=>{
    dispatch(getGamesByTurfId(turfId))
  },[dispatch])

  useEffect(() => {
    console.log(selectedDate,selectedGame);
    
    if(selectedDate && selectedGame){
      dispatch(getTimeSlot({ selectedGame, turfId, selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    dispatch(
      getCourts({ selectedGame, selectedDate, selectedTime, hours})
    );
  }, [selectedTime, hours]);

  

  useEffect(() => {
    dispatch(
      getPrice({selectedCourt})
    );
  },[selectedCourt]);

  useEffect(() => {
    if (courts && courts.length > 0) {
      setAvailableCourts(courts);
    }
  }, [courts]);

  useEffect(() => {
    if (games && games.length > 0) {
      setAvailableGames(games);
    }
  }, [games]);

  useEffect(() => {
  if (timeSlots && timeSlots.length > 0) {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // Map timeSlots strings to objects with formatted slots
    const formattedTimeSlots = timeSlots.map((time) => {
      const [hours, minutes] = time.split(":");
      return { openingSlot: `${hours}:${minutes}` };
    });

    // Filter based on the selectedDate and currentTime
    if (currentDate === selectedDate) {
      const filteredTimeSlots = formattedTimeSlots.filter(
        (timeSlot) => timeSlot.openingSlot > currentTime
      );
      setAvailableTimeSlots(filteredTimeSlots);
    } else if (currentDate < selectedDate) {
      setAvailableTimeSlots(formattedTimeSlots);
    } else {
      setAvailableTimeSlots([]); // No slots for past dates
    }
  } else {
    setAvailableTimeSlots([]); // Handle cases where timeSlots is empty or undefined
  }
}, [timeSlots, selectedDate]);


  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDecrement = () => {
    if (hours > minTime) {
      setHours(hours - 1);
    }
  };

  const handleIncrement = () => {
    if (hours < maxTime) {
      setHours(hours + 1);
    }
  };

  const handleGameChange = (e) => {
    setSelectedGame(e.target.value);
    
    setSelectedDate("");
    setSelectedTime("");
    setAvailableCourts([]);
  };  

  const handleTimeChange = (event) => {
    const selectedDisplayTime = event.target.value;
    setSelectedTime(selectedDisplayTime);
  
    const selectedTimeIndex = availableTimeSlots.findIndex((timeSlot) => {
      const normalizedTime = timeSlot.openingSlot.slice(0, 5);
      return normalizedTime === selectedDisplayTime;
    });
    setMaxTime(availableTimeSlots.length - selectedTimeIndex);
  
    setHours(1);
    setAvailableCourts([]);
  };
  

  const handleSubmit = () => {
    const gameId = selectedGame;
    const gameName = availableGames.find((game) => game.gameID == gameId)?.game || "";
    const courtId = selectedCourt;
    const courtName = availableCourts.find((court) => court.courtId == courtId)?.courtName || "";
    console.log({turfId,turfName,gameId,gameName,selectedDate,hours,courtId,courtName,selectedTime,price});
    
    navigate("/booking/payment",{state: {turfId,turfName,gameId,gameName,selectedDate,hours,courtId,courtName,selectedTime,price}})
  };

  return (
    <div className="h-screen flex justify-center items-center border border-gray-800 p-4">
      <form className="w-full max-w-lg h-full border border-gray-300 p-4 rounded-md flex flex-col justify-between">
        <table className="w-full flex-grow">
          <tbody>
            <tr>
              <td className="text-left">
                <label htmlFor="gameName" className="block mb-2">
                  Game Name
                </label>
              </td>
              <td className="flex-grow">
                <select
                  id="gameName"
                  value={selectedGame}
                  onChange={handleGameChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="" disabled>
                    Select a Game
                  </option>
                  {availableGames.map((game, index) => (
                    <option key={index} value={game.gameID}>
                      {game.game}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <label htmlFor="date" className="block mb-2">
                  Date
                </label>
              </td>
              <td className="flex-grow">
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <label htmlFor="startTime" className="block mb-2">
                  Start Time
                </label>
              </td>
              <td className="flex-grow">
                <select
                  id="startTime"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="" disabled>
                    Select a Time Slot
                  </option>
                  {availableTimeSlots.map((time, index) => (
                    <option key={index} >
                      {time.openingSlot}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <label htmlFor="duration" className="block mb-2">
                  Duration
                </label>
              </td>
              <td className="flex-grow">
                <div className="relative flex items-center max-w-[8rem] justify-between w-full">
                  <button
                    type="button"
                    id="decrement-button"
                    data-input-counter-decrement="quantity-input"
                    onClick={handleDecrement}
                    disabled={hours <= 1}
                    className={`${
                      hours <= 1
                        ? "bg-gray-400 text-gray-700"
                        : "bg-green-500 text-white"
                    } border-gray-300 rounded-full p-3 h-9 w-12 flex items-center justify-center`}
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>

                  <p className="border-x-0 h-11 text-center text-m block py-2.5 px-24 w-full">
                    {hours}Hr
                  </p>

                  <button
                    type="button"
                    id="increment-button"
                    data-input-counter-increment="quantity-input"
                    onClick={handleIncrement}
                    disabled={hours >= maxTime}
                    className={`${
                      hours >= maxTime
                        ? "bg-gray-400 text-gray-700"
                        : "bg-green-500 text-white"
                    } border-gray-300 rounded-full p-3 h-9 w-12 flex items-center justify-center `}
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <label htmlFor="selectCourt" className="block mb-2">
                  Court
                </label>
              </td>
              <td className="flex-grow">
                <select
                  id="selectCourt"
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="" disabled>
                    Select Court
                  </option>
                  {availableCourts.map((court, index) => (
                    <option key={index} value={court.courtId}>
                      {court.courtName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full p-3 rounded-md ${
              selectedGame && selectedDate && selectedTime && selectedCourt
                ? "text-white bg-orange-700 hover:bg-orange-800"
                : "text-gray-500 bg-gray-300 cursor-not-allowed"
            }`}
            disabled={
              !(selectedGame && selectedDate && selectedTime && selectedCourt)
            }
          >
             {`Book Now - ₹${price * hours || 0}`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Booking;