import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { courtDetails, getGamesDetails } from "../../ReduxToolKit/TurfSlice";
import AuthModal from "../Login/AuthModal";
import { IoMdFootball, IoMdBasketball } from "react-icons/io";
import { MdSportsCricket, MdSportsTennis } from "react-icons/md";

const generalRules = [
  "All participants who intend to participate in the game in the duration of the slot booked must check-in to the facility upon arrival.",
  "Refusal to comply with the venue’s rules and regulations will result in denial of entry to the venue, and no refund will be provided.",
  "Rent sports equipment such as stumps, shoes, footballs, and cricket sets.",
  "Don't forget your socks, they are mandatory for rented shoes. We also have socks for sale.",
  "Playing barefoot is strictly forbidden.",
  "Outside food and beverages are not allowed inside the arena.",
  "Coaching is prohibited after booking the venue for hourly access.",
  "No smoking, drugs, and alcohol.",
];

// Define the rules for each game
const gameSpecificRules = {
  football: [
    "It is recommended but not compulsory to wear football studs while playing at the facility.",
    "Metal studs are not allowed.",
  ],
  cricket: [
    "Please get your own bats & balls. Bat & Ball not available at the venue.",
  ],
  badminton: [
    "Non Marking Shoes compulsory for Badminton. Shoes must be worn after entering the facility.",
    "Customers are requested to bring their own equipment, No equipment available for rent.",
    "Barefoot play is strictly prohibited.",
    "A maximum of 6 members per booking per badminton court is admissible. Exceeding which ₹100 per head will be charged by the venue.",
  ],
  tennis: [
    "Non Marking Tennis Shoes or Canvas Shoes compulsory for Tennis.",
    "Barefoot play is strictly prohibited.",
    "Management is not responsible for loss of personal belongings & any injuries caused during the matches.",
    "A maximum of 4 members per booking per court is admissible.",
  ],
};

export default function TurfDetails() {
  const authStatus = useSelector((state) => state.auth.loggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { turfId, turfName, imageUrl, gameName, turfLocation } = location.state || {};


  const [isGameDetailsModalOpen, setIsGameDetailsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Handlers for GameDetailsModal
  const openGameDetailsModal = (game) => {
    setSelectedGame(game);
    setIsGameDetailsModalOpen(true);
  };
  const closeGameDetailsModal = () => {
    setSelectedGame(null);
    setIsGameDetailsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getGamesDetails(turfId));
  }, [turfId]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleBookNow = () => {
    if (authStatus) {
      // If authenticated, navigate directly to booking page
      navigate(`/booking`, { state: { turfId, gameName, turfName } });
    } else {
      // If not authenticated, trigger modal
      toggleModal(() => {
        // After modal success (e.g., login), navigate to booking page
        navigate(`/booking`, { state: { turfId, gameName, turfName } });
      });
    }
  };

  const gameDetails = useSelector((state) => state.turfs.gameDetails);

  // Function to find min start time and max end time
  const findMinMaxTimes = (gameDetails) => {
    // Initialize the minStartTime and maxEndTime with valid times as fallback
    let minStartTime = "23:59";
    let maxEndTime = "00:00";
  
    // Ensure gameDetails is an array and has valid elements
    if (!Array.isArray(gameDetails) || gameDetails.length === 0) {
      return {
        minStartTime: null,
        maxEndTime: null,
      };
    }
  
    gameDetails.forEach((game) => {
      // Validate game.startTime and game.endTime before comparing
      if (game.startTime && game.endTime) {
        if (game.startTime < minStartTime) {
          minStartTime = game.startTime;
        }
        if (game.endTime > maxEndTime) {
          maxEndTime = game.endTime;
        }
      }
    });
  
    // If no valid times were found, return null
    if (minStartTime === "23:59" || maxEndTime === "00:00") {
      return {
        minStartTime: null,
        maxEndTime: null,
      };
    }
  
    return {
      minStartTime: minStartTime.substring(0, 5),
      maxEndTime: maxEndTime.substring(0, 5),
    };
  };
  

  const { minStartTime, maxEndTime } = findMinMaxTimes(gameDetails);

  // Function to render specific game rules
  const renderGameRules = (gameDetails) => {
    const rules = [];
  
    // Check if gameDetails is a valid array
    if (!Array.isArray(gameDetails) || gameDetails.length === 0) {
      return (
        <p className="text-base text-gray-700">
          No specific rules available for the games at this turf.
        </p>
      );
    }
  
    // Check for each game type and add the respective rules if available
    gameDetails.forEach((game) => {
      // Ensure game.gameName is not null or undefined
      if (game.gameName && game.gameName.toLowerCase()) {
        const gameName = game.gameName.toLowerCase();
  
        // Check if gameSpecificRules is defined and contains the specific game
        if (gameSpecificRules[gameName]) {
          rules.push(
            <div key={gameName}>
              <strong>{game.gameName}:</strong>
              <ul>
                {gameSpecificRules[gameName].map((rule, index) => (
                  <li key={index}>- {rule}</li>
                ))}
              </ul>
            </div>
          );
        }
      }
    });
  
    return rules.length > 0 ? (
      <div>{rules}</div>
    ) : (
      <p className="text-base text-gray-700">
        No specific rules available for the games at this turf.
      </p>
    );
  };
  

  return (
    <div className="bg-gray-50 min-h-screen">
      <AuthModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        navigateToBooking={true}
        turfId={turfId}
        gameName={gameName}
        turfName={turfName  }
      />

      {isGameDetailsModalOpen && (
        <GameDetailsModal
          isOpen={isGameDetailsModalOpen}
          onClose={closeGameDetailsModal}
          game={selectedGame}
          turfId={turfId}
        />
      )}

      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-96">
        <img
          src={`data:image/jpeg;base64,${imageUrl}`}
          className="absolute inset-0 w-full h-full object-cover"
          alt={turfName}
        />
        <div className="absolute inset-0 flex flex-col items-center bg-black bg-opacity-40 justify-center text-center text-white px-4">
          <h1 className="text-4xl lg:text-5xl font-bold">{turfName}</h1>
          <p className="text-lg lg:text-xl mt-4 max-w-2xl">{turfLocation}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left Section */}
          <div className="lg:w-3/4 space-y-8">
            {/* Available Sports Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Available Sports</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
                {gameDetails && gameDetails.map((game, index) => {
                  const gameIcons = {
                    football: <IoMdFootball />,
                    cricket: <MdSportsCricket />,
                    badminton: <IoMdBasketball />,
                    tennis: <MdSportsTennis />,
                  };
                  return (
                    <div
                      key={index}
                      className="bg-white text-center p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg hover:border-green-500 transition w-28 mx-auto"
                      onClick={() => openGameDetailsModal(game)}
                    >
                      <div className="flex items-center justify-center text-4xl h-16 mb-2 text-gray-500">
                        {/* Adjusted to ensure centering */}
                        {gameIcons[game.gameName.toLowerCase()] || "🎮"}
                      </div>
                      <p className="text-xs font-medium text-gray-700 capitalize">
                        {game.gameName.toUpperCase()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Rules Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">General Rules</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {generalRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Game Rules Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Game Rules</h2>
              {renderGameRules(gameDetails)}
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/4 space-y-6">
            {/* Booking Button */}
            <div
              onClick={handleBookNow}
              className="bg-green-600 text-white text-center py-3 rounded-lg shadow cursor-pointer hover:bg-green-700 transition"
            >
              Book Now
            </div>

            {/* Timing Box */}
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Timing
              </h3>
              <p className="text-xl font-bold text-gray-900">
                {minStartTime} - {maxEndTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GameDetailsModal = ({ isOpen, onClose, game, turfId }) => {
  if (!isOpen || !game) return null;
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(courtDetails({turfId,gameId:game.gameID}))
  },[dispatch])
  // const courts = [
  //   {
  //     name: "Court 1",
  //     price: 500,
  //     startTime: "06:00 AM",
  //     endTime: "08:00 AM",
  //     description: "Standard turf with good lighting and equipment."
  //   },
  //   {
  //     name: "Court 2",
  //     price: 600,
  //     startTime: "08:00 AM",
  //     endTime: "10:00 AM",
  //     description: "Ideal for evening matches, spacious and well-maintained."
  //   },
  //   {
  //     name: "Court 3",
  //     price: 550,
  //     startTime: "10:00 AM",
  //     endTime: "12:00 PM",
  //     description: "A high-quality court with synthetic grass, suitable for all sports."
  //   },
  //   {
  //     name: "Court 4",
  //     price: 700,
  //     startTime: "12:00 PM",
  //     endTime: "02:00 PM",
  //     description: "Premium turf with extra amenities like water coolers and seating."
  //   },
  //   {
  //     name: "Court 5",
  //     price: 450,
  //     startTime: "02:00 PM",
  //     endTime: "04:00 PM",
  //     description: "Affordable turf with a great surface for various sports."
  //   }
  // ];

  const courts = useSelector((state)=>state.turfs.courtDetail)
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full h-[70vh] relative transform transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">{game?.gameName}Courts</h2>
        <p className="text-gray-700 mb-4">
          Select a court below for more details or to book:
        </p>

        <div className="space-y-4 overflow-y-auto h-[calc(70vh-150px)]">
          {courts.map((court, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {court.name}
              </h3>
              {/* <p className="text-gray-700">
                <strong>Price:</strong> ₹{court.price} per hour
              </p> */}
              <p className="text-gray-700">
                <strong>Timing:</strong> {court.startTime.substring(0,5)} {court.startTime.substring(0,2)<12?"AM":"PM"} - {court.endTime.substring(0,5)} {court.startTime.substring(0,2)>12?"AM":"PM"}
              </p>
              <p className="text-gray-700">
                <strong>Description:</strong> {court.description || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Number of Courts:</strong> {court.noOfCourts || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};