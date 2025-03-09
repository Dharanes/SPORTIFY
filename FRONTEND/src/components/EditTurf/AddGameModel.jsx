// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import {
//   getGamesDetails,
//   registerCourtToGameById,
//   registerGameToTurfById,
// } from "../../ReduxToolKit/TurfSlice";
// import { courts } from "../Profile/courts";
 
// function AddGameModel({ isModalOpen, setIsModalOpen, turfName, turfId }) {
//   const dispatch = useDispatch();
//   const [selectedGames, setSelectedGames] = useState([
//     {
//       game: "",
//       startTime: "",
//       endTime: "",
//       courtData: [],
//     },
//   ]);
 
//   const availableGames = ["Football", "Basketball", "Cricket", "Tennis", "Badminton"];
//   const [errors, setErrors] = useState([]);
 
//   const validateTimes = (gameIndex, startTime, endTime) => {
//     const newErrors = [...errors];
//     if (startTime && endTime && startTime >= endTime) {
//       newErrors[gameIndex] = "End time must be after start time.";
//     } else {
//       newErrors[gameIndex] = "";
//     }
//     setErrors(newErrors);
//   };
 
//   const handleGameChange = (index, game) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[index].game = game;
//     newSelectedGames[index].courtData = []; // Clear courts when game changes
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleTimeChange = (index, type, value) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[index][type] = value;
 
//     const { startTime, endTime } = newSelectedGames[index];
//     if (type === "startTime") {
//       validateTimes(index, value, endTime);
//     } else if (type === "endTime") {
//       validateTimes(index, startTime, value);
//     }
 
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleAddCourt = (gameIndex) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData.push({
//       courtName: "",
//       description: "",
//       count: 1, // Initialize count for new court
//     });
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleIncrement = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     const court = newSelectedGames[gameIndex].courtData[courtIndex];
//     court.count += 1; // Increment the count of similar courts
 
//     // Duplicate the court data based on the new count
//     while (newSelectedGames[gameIndex].courtData.length < court.count) {
//       newSelectedGames[gameIndex].courtData.push({ ...court });
//     }
 
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleDecrement = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     const court = newSelectedGames[gameIndex].courtData[courtIndex];
//     if (court.count > 1) {
//       court.count -= 1; // Decrement the count of similar courts
 
//       // Remove the extra court data if the count decreases
//       newSelectedGames[gameIndex].courtData = newSelectedGames[gameIndex].courtData.slice(0, court.count);
//     }
 
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleCourtChange = (gameIndex, courtIndex, value, field) => {
//     const newSelectedGames = [...selectedGames];
//     const selectedCourtData = newSelectedGames[gameIndex].courtData[courtIndex];
 
//     if (field === "courtName") {
//       selectedCourtData.courtName = value;
//       const selectedCourt = courts[selectedGames[gameIndex].game].find(
//         (court) => court.name === value
//       );
//       if (selectedCourt) {
//         selectedCourtData.description = selectedCourt.description;
//       }
//     } else if (field === "price") {
//       selectedCourtData.price = value;
//     } else if (field === "description") {
//       selectedCourtData.description = value;
//     }
 
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleRemoveCourt = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData.splice(courtIndex, 1);
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleRegisterGame = () => {
//     const gameDataWithTurfId = {
//       game: selectedGames[0].game,
//       startTime: selectedGames[0].startTime,
//       endTime: selectedGames[0].endTime,
//     };
//     dispatch(registerGameToTurfById({ game: gameDataWithTurfId, id: turfId }))
//       .then((gameResponse) => {
//         if (gameResponse.meta.requestStatus === "fulfilled") {
//           console.log("Game registered successfully:", gameResponse.payload);
 
//           const courts = selectedGames[0].courtData;
//           for (const court of courts) {
//             dispatch(
//               registerCourtToGameById({
//                 id: turfId,
//                 gameName: selectedGames[0].game,
//                 court,
//               })
//             ).then((courtResponse) => {
//               if (courtResponse.meta.requestStatus === "fulfilled") {
//                 console.log("Court registered successfully:", turfName, courtResponse.payload);
//                 dispatch(getGamesDetails(turfName));
//               } else {
//                 console.error("Failed to register court:", courtResponse.error);
//               }
//             });
//           }
//         } else {
//           console.error("Failed to register game:", gameResponse.error);
//         }
//       })
//       .catch((gameError) => {
//         console.error("Error registering game:", gameError);
//       });
 
//     setSelectedGames([
//       {
//         game: "",
//         startTime: "",
//         endTime: "",
//         courtData: [],
//       },
//     ]);
//     setIsModalOpen(false);
//   };
 
//   return (
//     <div
//       className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center ${!isModalOpen && "hidden"}`}
//     >
//       <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-3xl relative h-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-semibold text-center text-blue-600">Register Game</h2>
//           <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold text-gray-600 hover:text-gray-900">
//             &times;
//           </button>
//         </div>
 
//         <div className="max-h-[50vh] overflow-y-auto">
//           {selectedGames.map((selectedGame, gameIndex) => (
//             <div key={gameIndex} className="space-y-4 border-t pt-6">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center w-full">
//                   <label htmlFor={`game_${gameIndex}`} className="block text-lg font-medium text-gray-700 w-full">
//                     Game Name
//                   </label>
//                 </div>
//               </div>
//               <select
//                 id={`game_${gameIndex}`}
//                 value={selectedGame.game}
//                 onChange={(e) => handleGameChange(gameIndex, e.target.value)}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select a Game</option>
//                 {availableGames.map((gameOption) => (
//                   <option key={gameOption} value={gameOption}>
//                     {gameOption}
//                   </option>
//                 ))}
//               </select>
 
//               <div className="flex space-x-4">
//                 <div className="w-full">
//                   <label htmlFor={`startTime_${gameIndex}`} className="block text-lg font-medium text-gray-700">
//                     Start Time
//                   </label>
//                   <input
//                     type="time"
//                     id={`startTime_${gameIndex}`}
//                     value={selectedGame.startTime}
//                     onChange={(e) => handleTimeChange(gameIndex, "startTime", e.target.value)}
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
 
//                 <div className="w-full">
//                   <label htmlFor={`endTime_${gameIndex}`} className="block text-lg font-medium text-gray-700">
//                     End Time
//                   </label>
//                   <input
//                     type="time"
//                     id={`endTime_${gameIndex}`}
//                     value={selectedGame.endTime}
//                     onChange={(e) => handleTimeChange(gameIndex, "endTime", e.target.value)}
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
 
//               {errors[gameIndex] && <p className="text-red-500 text-sm mt-2">{errors[gameIndex]}</p>}
 
//               {/* Render Court Fields */}
//               {selectedGame.courtData.map((court, courtIndex) => (
//                 <div key={courtIndex} className="space-y-4 border-t pt-4">
//                   <div>
//                     <label
//                       htmlFor={`courtName_${gameIndex}_${courtIndex}`}
//                       className="block text-lg font-medium text-gray-700"
//                     >
//                       Court Name
//                     </label>
//                     <select
//                       id={`courtName_${gameIndex}_${courtIndex}`}
//                       value={court.courtName}
//                       onChange={(e) =>
//                         handleCourtChange(gameIndex, courtIndex, e.target.value, "courtName")
//                       }
//                       className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select a Court</option>
//                       {selectedGame.game && courts[selectedGame.game] && courts[selectedGame.game].map((courtOption) => (
//                         <option key={courtOption.name} value={courtOption.name}>
//                           {courtOption.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
 
//                   {/* Court Description */}
//                   <div>
//                     <label
//                       htmlFor={`courtDescription_${gameIndex}_${courtIndex}`}
//                       className="block text-lg font-medium text-gray-700"
//                     >
//                       Court Description
//                     </label>
//                     <textarea
//                       id={`courtDescription_${gameIndex}_${courtIndex}`}
//                       value={court.description}
//                       onChange={(e) =>
//                         handleCourtChange(gameIndex, courtIndex, e.target.value, "description")
//                       }
//                       className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter Court Description"
//                     />
//                   </div>
 
//                   {/* Court Price */}
//                   <div>
//                     <label
//                       htmlFor={`courtPrice_${gameIndex}_${courtIndex}`}
//                       className="block text-lg font-medium text-gray-700"
//                     >
//                       Price
//                     </label>
//                     <input
//                       type="number"
//                       id={`courtPrice_${gameIndex}_${courtIndex}`}
//                       value={court.price}
//                       onChange={(e) =>
//                         handleCourtChange(gameIndex, courtIndex, e.target.value, "price")
//                       }
//                       className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter Price in Rupees per Hour"
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
 
//                   <div className="flex items-center justify-between space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveCourt(gameIndex, courtIndex)}
//                       className="text-red-600 font-bold text-sm"
//                     >
//                       Remove Court
//                     </button>
//                     <div className="flex items-center space-x-4">
//                       <span className="pl-2">No. of Similar Courts</span>
//                       <button
//                         type="button"
//                         onClick={() => handleDecrement(gameIndex, courtIndex)}
//                         className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-medium">{court.count}</span>
//                       <button
//                         type="button"
//                         onClick={() => handleIncrement(gameIndex, courtIndex)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
 
//         {/* Add Court and Register Game Button */}
//         <div className="mt-6 flex space-x-4 justify-end">
//           <button
//             type="button"
//             onClick={() => handleAddCourt(selectedGames.length - 1)}
//             className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//           >
//             Add Court
//           </button>
//           <button
//             onClick={handleRegisterGame}
//             className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//           >
//             Register Game
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
 
// export default AddGameModel;
 

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGamesDetails,
  registerCourtToGameById,
  registerGameToTurfById,
} from "../../ReduxToolKit/TurfSlice";
import { courts } from "../Profile/courts";
 
function AddGameModel({ isModalOpen, setIsModalOpen, turfName, turfId }) {
  const dispatch = useDispatch();
 
  // Simulating the fetched game details, in real app it would come from Redux store.
  const gameDetails = useSelector((state) => state.turfs.gameDetails);
 
  // Extract the existing game names from the gameDetails
  const gameArray = gameDetails 
  ? gameDetails.map(game => game?.gameName || null) 
  : [];

 
  const availableGames = ["Football", "Basketball", "Cricket", "Tennis", "Badminton"];
 
  // Filter the available games to exclude those already in gameArray
  const filteredAvailableGames = availableGames.filter(game => !gameArray.includes(game));
 
  const [selectedGames, setSelectedGames] = useState([
    {
      game: "",
      startTime: "",
      endTime: "",
      courtData: [],
    },
  ]);
 
  const [errors, setErrors] = useState([]);
 
  const validateTimes = (gameIndex, startTime, endTime) => {
    const newErrors = [...errors];
    if (startTime && endTime && startTime >= endTime) {
      newErrors[gameIndex] = "End time must be after start time.";
    } else {
      newErrors[gameIndex] = "";
    }
    setErrors(newErrors);
  };
 
  const handleGameChange = (index, game) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[index].game = game;
    newSelectedGames[index].courtData = []; // Clear courts when game changes
    setSelectedGames(newSelectedGames);
  };
 
  const handleTimeChange = (index, type, value) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[index][type] = value;
 
    const { startTime, endTime } = newSelectedGames[index];
    if (type === "startTime") {
      validateTimes(index, value, endTime);
    } else if (type === "endTime") {
      validateTimes(index, startTime, value);
    }
 
    setSelectedGames(newSelectedGames);
  };
 
  const handleAddCourt = (gameIndex) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[gameIndex].courtData.push({
      courtName: "",
      description: "",
      count: 1,
    });
    setSelectedGames(newSelectedGames);
  };
 
  const handleIncrement = (gameIndex, courtIndex) => {
    const newSelectedGames = [...selectedGames];
    const court = newSelectedGames[gameIndex].courtData[courtIndex];
    court.count += 1;
    setSelectedGames(newSelectedGames);
  };
 
  const handleDecrement = (gameIndex, courtIndex) => {
    const newSelectedGames = [...selectedGames];
    const court = newSelectedGames[gameIndex].courtData[courtIndex];
    if (court.count > 1) {
      court.count -= 1;
      setSelectedGames(newSelectedGames);
    }
  };
 
  const handleCourtChange = (gameIndex, courtIndex, value, field) => {
    const newSelectedGames = [...selectedGames];
    const selectedCourtData = newSelectedGames[gameIndex].courtData[courtIndex];
 
    if (field === "courtName") {
      selectedCourtData.courtName = value;
      const selectedCourt = courts[selectedGames[gameIndex].game].find(
        (court) => court.name === value
      );
      if (selectedCourt) {
        selectedCourtData.description = selectedCourt.description;
      }
    } else if (field === "price") {
      selectedCourtData.price = value;
    } else if (field === "description") {
      selectedCourtData.description = value;
    }
 
    setSelectedGames(newSelectedGames);
  };
 
  const handleRemoveCourt = (gameIndex, courtIndex) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[gameIndex].courtData.splice(courtIndex, 1);
    setSelectedGames(newSelectedGames);
  };
 
  const handleRegisterGame = () => {
    const gameDataWithTurfId = {
      game: selectedGames[0].game,
      startTime: selectedGames[0].startTime,
      endTime: selectedGames[0].endTime,
    };
 
    dispatch(registerGameToTurfById({ game: gameDataWithTurfId, id: turfId }))
      .then((gameResponse) => {
        if (gameResponse.meta.requestStatus === "fulfilled") {
          console.log("Game registered successfully:", gameResponse.payload);
 
          const courts = selectedGames[0].courtData;
          courts.forEach((court) => {
            for (let i = 0; i < court.count; i++) {
              dispatch(
                registerCourtToGameById({
                  id: turfId,
                  gameName: selectedGames[0].game,
                  court,
                })
              ).then((courtResponse) => {
                if (courtResponse.meta.requestStatus === "fulfilled") {
                  console.log("Court registered successfully:", turfName, courtResponse.payload);
                  dispatch(getGamesDetails(turfName));
                } else {
                  console.error("Failed to register court:", courtResponse.error);
                }
              });
            }
          });
        } else {
          console.error("Failed to register game:", gameResponse.error);
        }
      })
      .catch((gameError) => {
        console.error("Error registering game:", gameError);
      });
 
    setSelectedGames([
      {
        game: "",
        startTime: "",
        endTime: "",
        courtData: [],
      },
    ]);
    setIsModalOpen(false);
  };
 
  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center ${!isModalOpen && "hidden"}`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-3xl relative h-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-center text-blue-600">Register Game</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold text-gray-600 hover:text-gray-900">
            &times;
          </button>
        </div>
 
        <div className="max-h-[50vh] overflow-y-auto">
        {selectedGames?.map((selectedGame, gameIndex) => (
  <div key={gameIndex} className="space-y-4 border-t pt-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center w-full">
        <label
          htmlFor={`game_${gameIndex}`}
          className="block text-lg font-medium text-gray-700 w-full"
        >
          Game Name
        </label>
      </div>
    </div>
    <select
      id={`game_${gameIndex}`}
      value={selectedGame?.game || ""}
      onChange={(e) => handleGameChange(gameIndex, e.target.value)}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select a Game</option>
      {filteredAvailableGames?.map((gameOption) => (
        <option key={gameOption} value={gameOption}>
          {gameOption}
        </option>
      ))}
    </select>

    <div className="flex space-x-4">
      <div className="w-full">
        <label
          htmlFor={`startTime_${gameIndex}`}
          className="block text-lg font-medium text-gray-700"
        >
          Start Time
        </label>
        <input
          type="time"
          id={`startTime_${gameIndex}`}
          value={selectedGame?.startTime || ""}
          onChange={(e) =>
            handleTimeChange(gameIndex, "startTime", e.target.value)
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="w-full">
        <label
          htmlFor={`endTime_${gameIndex}`}
          className="block text-lg font-medium text-gray-700"
        >
          End Time
        </label>
        <input
          type="time"
          id={`endTime_${gameIndex}`}
          value={selectedGame?.endTime || ""}
          onChange={(e) =>
            handleTimeChange(gameIndex, "endTime", e.target.value)
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    {errors?.[gameIndex] && (
      <p className="text-red-500 text-sm mt-2">{errors[gameIndex]}</p>
    )}

    {/* Render Court Fields */}
    {selectedGame?.courtData?.map((court, courtIndex) => (
      <div key={courtIndex} className="space-y-4 border-t pt-4">
        <div>
          <label
            htmlFor={`courtName_${gameIndex}_${courtIndex}`}
            className="block text-lg font-medium text-gray-700"
          >
            Court Name
          </label>
          <select
            id={`courtName_${gameIndex}_${courtIndex}`}
            value={court?.courtName || ""}
            onChange={(e) =>
              handleCourtChange(gameIndex, courtIndex, e.target.value, "courtName")
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a Court</option>
            {selectedGame?.game &&
              courts?.[selectedGame.game]?.map((courtOption) => (
                <option key={courtOption.name} value={courtOption.name}>
                  {courtOption.name}
                </option>
              ))}
          </select>
        </div>

        {/* Court Description */}
        <div>
          <label
            htmlFor={`courtDescription_${gameIndex}_${courtIndex}`}
            className="block text-lg font-medium text-gray-700"
          >
            Court Description
          </label>
          <textarea
            id={`courtDescription_${gameIndex}_${courtIndex}`}
            value={court?.description || ""}
            onChange={(e) =>
              handleCourtChange(gameIndex, courtIndex, e.target.value, "description")
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Court Description"
          />
        </div>

        {/* Court Price */}
        <div>
          <label
            htmlFor={`courtPrice_${gameIndex}_${courtIndex}`}
            className="block text-lg font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id={`courtPrice_${gameIndex}_${courtIndex}`}
            value={court?.price || ""}
            onChange={(e) =>
              handleCourtChange(gameIndex, courtIndex, e.target.value, "price")
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Price in Rupees per Hour"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex items-center justify-between space-x-4">
          <button
            type="button"
            onClick={() => handleRemoveCourt(gameIndex, courtIndex)}
            className="text-red-600 font-bold text-sm"
          >
            Remove Court
          </button>
          <div className="flex items-center space-x-4">
            <span className="pl-2">No. of Similar Courts</span>
            <button
              type="button"
              onClick={() => handleDecrement(gameIndex, courtIndex)}
              className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-lg font-medium">{court?.count || 0}</span>
            <button
              type="button"
              onClick={() => handleIncrement(gameIndex, courtIndex)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              +
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
))}

        </div>
 
        {/* Add Court and Register Game Button */}
        <div className="mt-6 flex space-x-4 justify-end">
          <button
            type="button"
            onClick={() => handleAddCourt(selectedGames.length - 1)}
            className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Court
          </button>
          <button
            onClick={handleRegisterGame}
            className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Register Game
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default AddGameModel;
 
 
 