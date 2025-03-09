import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameTimeCard from "./GameTimeCard"; // Import GameTimeCard component
import CourtModal from "./CourtModal"; // Import CourtModal component
import { deleteGame, getGamesDetails, updateCourtData} from "../../ReduxToolKit/TurfSlice";
 
const EditTurfForm = ({ turfId }) => {
  const dispatch = useDispatch();
 
  const [temporaryGameTimes, setTemporaryGameTimes] = useState({});
 
  const [editingGame, setEditingGame] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);
  const [courtData, setCourtData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const gameDetails = useSelector((state) => state.turfs.gameDetails);
  const flag = useSelector((state) => state.turfs.flag);
  const updateFlag = useSelector((state) =>state.turfs.updateFlag)
 
  useEffect(() => {
    dispatch(getGamesDetails(turfId));
  }, [dispatch,gameDetails,flag]);
 
  useEffect(() => {
    if (gameDetails && gameDetails.length > 0) {
      let gameAndTimes = {};
      let gameAndCourts = {};
      gameDetails.forEach((gameDetail) => {
        gameAndTimes = {
          ...gameAndTimes,
          [gameDetail.gameName]: {
            startTime: gameDetail.startTime.substring(0, 5),
            endTime: gameDetail.endTime.substring(0, 5),
          },
        };
 
        gameAndCourts[gameDetail.gameName] = gameAndCourts[gameDetail.gameName]
          ? [
              ...gameAndCourts[gameDetail.gameName],
              ...gameDetail.courts.map((court) => ({
                id: court.courtId,
                name: court.courtType,
                description: court.courtStyle,
                price: `${court.price}`,
              })),
            ]
          : gameDetail.courts.map((court) => ({
              id: court.courtId,
              name: court.courtType,
              description: court.courtStyle,
              price: `${court.price}`,
            }));
      });
      setGameTimes(gameAndTimes);
      setCourtsInfo(gameAndCourts);
    }
  }, [gameDetails,updateFlag]);
 
  const [gameTimes, setGameTimes] = useState({});
  const [courtsInfo, setCourtsInfo] = useState({});
 
  const handleSaveEdit = () => {
    const currentGame = temporaryGameTimes[editingGame];
    if (currentGame.endTime <= currentGame.startTime) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [editingGame]: `End time cannot be before the start time.`,
      }));
      return;
    }
    setGameTimes({ ...temporaryGameTimes });
    setEditingGame(null);
    setErrorMessages({});
  };
 
  const handleTimeChange = (game, type, value) => {
    const newTemporaryGameTimes = { ...temporaryGameTimes };
    newTemporaryGameTimes[game] = {
      ...newTemporaryGameTimes[game],
      [type]: value,
    };
 
    setTemporaryGameTimes(newTemporaryGameTimes);
 
    if (type === "endTime" && value <= newTemporaryGameTimes[game]?.startTime) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [game]: `End time cannot be before the start time.`,
      }));
    } else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [game]: "",
      }));
    }
  };
 
  const handleEditTime = (game) => {
    setEditingGame(game);
    setTemporaryGameTimes({
      ...gameTimes,
    });
  };
 
  const handleCancelEdit = () => {
    setEditingGame(null);
    setTemporaryGameTimes({});
  };
 
  const handleDeleteGame = (game) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the game "${game}"?`
    );
    if (!confirmDelete) return;
 
    dispatch(deleteGame({ turfId, gameName: game }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
 
    for (const game in gameTimes) {
      const { startTime, endTime } = gameTimes[game];
      if (endTime <= startTime) {
        errors[game] = `End time for ${game} cannot be before the start time.`;
      }
    }
 
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
 
    setErrorMessages({});
  };
 
  const handleShowCourts = (game) => {
    setSelectedGame(game);
    setCourtData(courtsInfo[game] || []);
    setIsModalOpen(true);
  };
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };
 
  const handleSaveCourtChanges = (updatedCourt, index, selectedGame) => {
    dispatch(
      updateCourtData({ gameName: selectedGame, turfId, court: updatedCourt })
    );
    const updatedCourtData = [...courtData];
    updatedCourtData[index] = updatedCourt;
    setCourtData(updatedCourtData);
  };
 
  return (
    <form className="w-full max-w-3xl bg-white px-8 rounded-lg" onSubmit={handleSubmit}>
    <div>
      {/* Check if gameDetails is not null or undefined before rendering */}
      {gameDetails && gameDetails.length > 0 ? (
        gameDetails.map((game) => (
          <GameTimeCard
            key={game.gameName}
            gameID={game.gameID}
            game={game.gameName}
            gameTimes={
              // Ensure temporaryGameTimes and gameTimes are not null or undefined
              temporaryGameTimes && temporaryGameTimes[game.gameName] ? temporaryGameTimes[game.gameName] : gameTimes && gameTimes[game.gameName]
            }
            errorMessages={errorMessages || {}}
            editingGame={editingGame || false}
            handleTimeChange={handleTimeChange}
            handleEditTime={handleEditTime}
            handleCancelEdit={handleCancelEdit}
            handleDeleteGame={handleDeleteGame}
            handleShowCourts={handleShowCourts}
            handleSaveEdit={handleSaveEdit}
          />
        ))
      ) : (
        <div className="text-center text-[22px] font-bold text-red-500 mt-20 py-6">
        <p>No games available.</p>
        </div>
      )}
    </div>
 
    <CourtModal
      isModalOpen={isModalOpen}
      courtData={courtData || []} // Default to an empty array if courtData is null or undefined
      selectedGame={selectedGame || ''} // Default to empty string if selectedGame is null or undefined
      handleCloseModal={handleCloseModal}
      handleSaveCourtChanges={handleSaveCourtChanges}
      turfId={turfId || ''} // Default to empty string if turfId is null or undefined
    />
  </form>
 
  );
};
 
export default EditTurfForm;
 
 



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerTurf } from "../../ReduxToolKit/TurfRegistrationSlice";
// import GameTimeCard from "./GameTimeCard"; // Import GameTimeCard component
// import CourtModal from "./CourtModal"; // Import CourtModal component
// import {
//   deleteGame,
//   getGamesDetails,
//   updateCourtData,
// } from "../../ReduxToolKit/TurfSlice";

// const EditTurfForm = ({ turfId }) => {
//   const dispatch = useDispatch();

//   const [temporaryGameTimes, setTemporaryGameTimes] = useState({});

//   const [editingGame, setEditingGame] = useState(null);
//   const [errorMessages, setErrorMessages] = useState({});
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [courtData, setCourtData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const gameDetails = useSelector((state) => state.turfs.gameDetails);
//   const flag = useSelector((state) => state.turfs.flag);

//   useEffect(() => {
//     dispatch(getGamesDetails(turfId));
//   }, [dispatch,gameDetails,flag]);

//   useEffect(() => {
//     if (gameDetails && gameDetails.length > 0) {
//       let gameAndTimes = {};
//       let gameAndCourts = {};
//       gameDetails.forEach((gameDetail) => {
//         gameAndTimes = {
//           ...gameAndTimes,
//           [gameDetail.gameName]: {
//             startTime: gameDetail.startTime.substring(0, 5),
//             endTime: gameDetail.endTime.substring(0, 5),
//           },
//         };

//         gameAndCourts[gameDetail.gameName] = gameAndCourts[gameDetail.gameName]
//           ? [
//               ...gameAndCourts[gameDetail.gameName],
//               ...gameDetail.courts.map((court) => ({
//                 name: court.courtType,
//                 description: court.courtStyle,
//                 price: `Rs ${court.price}/hr`,
//               })),
//             ]
//           : gameDetail.courts.map((court) => ({
//               name: court.courtType,
//               description: court.courtStyle,
//               price: `Rs ${court.price}/hr`,
//             }));
//       });
//       setGameTimes(gameAndTimes);
//       setCourtsInfo(gameAndCourts);
//     }
//   }, [gameDetails]);

//   const [gameTimes, setGameTimes] = useState({});
//   const [courtsInfo, setCourtsInfo] = useState({});

//   const handleSaveEdit = () => {
//     const currentGame = temporaryGameTimes[editingGame];
//     if (currentGame.endTime <= currentGame.startTime) {
//       setErrorMessages((prevErrors) => ({
//         ...prevErrors,
//         [editingGame]: `End time cannot be before the start time.`,
//       }));
//       return;
//     }
//     setGameTimes({ ...temporaryGameTimes });
//     setEditingGame(null);
//     setErrorMessages({});
//   };

//   const handleTimeChange = (game, type, value) => {
//     const newTemporaryGameTimes = { ...temporaryGameTimes };
//     newTemporaryGameTimes[game] = {
//       ...newTemporaryGameTimes[game],
//       [type]: value,
//     };

//     setTemporaryGameTimes(newTemporaryGameTimes);

//     if (type === "endTime" && value <= newTemporaryGameTimes[game]?.startTime) {
//       setErrorMessages((prevErrors) => ({
//         ...prevErrors,
//         [game]: `End time cannot be before the start time.`,
//       }));
//     } else {
//       setErrorMessages((prevErrors) => ({
//         ...prevErrors,
//         [game]: "",
//       }));
//     }
//   };

//   const handleEditTime = (game) => {
//     setEditingGame(game);
//     setTemporaryGameTimes({
//       ...gameTimes,
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingGame(null);
//     setTemporaryGameTimes({});
//   };

//   const handleDeleteGame = (game) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete the game "${game}"?`
//     );
//     if (!confirmDelete) return;

//     dispatch(deleteGame({ turfId, gameName: game }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     let errors = {};

//     for (const game in gameTimes) {
//       const { startTime, endTime } = gameTimes[game];
//       if (endTime <= startTime) {
//         errors[game] = `End time for ${game} cannot be before the start time.`;
//       }
//     }

//     if (Object.keys(errors).length > 0) {
//       setErrorMessages(errors);
//       return;
//     }

//     setErrorMessages({});
//     // dispatch(registerTurf(gameTimes));
//   };

//   const handleShowCourts = (game) => {
//     setSelectedGame(game);
//     setCourtData(courtsInfo[game] || []);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedGame(null);
//   };

//   const handleSaveCourtChanges = (updatedCourt, index, selectedGame) => {
//     dispatch(
//       updateCourtData({ gameName: selectedGame, turfName, court: updatedCourt })
//     );
//     const updatedCourtData = [...courtData];
//     updatedCourtData[index] = updatedCourt;
//     setCourtData(updatedCourtData);
//   };

//   return (
//     <form
//       className="w-full max-w-3xl bg-white px-8 rounded-lg"
//       onSubmit={handleSubmit}
//     >
//       <div>
//         {gameDetails.map((game) => (
//           <GameTimeCard
//             key={game.gameName}
//             gameID ={game.gameID}
//             game={game.gameName}
//             gameTimes={
//               temporaryGameTimes[game.gameName] || gameTimes[game.gameName]
//             }
//             errorMessages={errorMessages}
//             editingGame={editingGame}
//             handleTimeChange={handleTimeChange}
//             handleEditTime={handleEditTime}
//             handleCancelEdit={handleCancelEdit}
//             handleDeleteGame={handleDeleteGame}
//             handleShowCourts={handleShowCourts}
//             handleSaveEdit={handleSaveEdit}
//           />
//         ))}
//       </div>

//       <CourtModal
//         isModalOpen={isModalOpen}
//         courtData={courtData}
//         selectedGame={selectedGame}
//         handleCloseModal={handleCloseModal}
//         handleSaveCourtChanges={handleSaveCourtChanges}
//         turfId={turfId}
//       />
//     </form>
//   );
// };

// export default EditTurfForm;
