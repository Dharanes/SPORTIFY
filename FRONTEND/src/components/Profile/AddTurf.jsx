import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerCourtToGame, registerGameToTurf, registerTurf } from "../../ReduxToolKit/TurfRegistrationSlice";
import { courts } from "./courts";
import { toast } from "react-toastify";
 
function AddTurf() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [turf, setTurf] = useState({
    turfName: "",
    location: "",
    imageUrl: null,
  });
  const [selectedGames, setSelectedGames] = useState([]);
  const [errors, setErrors] = useState([]);
 
  const availableGames = [
    "Football",
    "Basketball",
    "Cricket",
    "Tennis",
    "Badminton",
  ];
 
  const validateTimes = (gameIndex, startTime, endTime) => {
    const newErrors = [...errors];
    if (startTime && endTime && startTime >= endTime) {
      newErrors[gameIndex] = "End time must be after start time.";
    } else {
      newErrors[gameIndex] = "";
    }
    setErrors(newErrors);
  };
 
  const handleImageUpload = (e) => {
    setTurf((prevState) => ({ ...prevState, imageUrl: e.target.files[0] }));
  };
 
  const handleTurf = (e) => {
    const { name, value } = e.target;
    setTurf({
      ...turf,
      [name]: value,
    });
  };
 
  const handleGameChange = (gameIndex, selectedGame) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[gameIndex].game = selectedGame;
    newSelectedGames[gameIndex].courtData = []; // Reset courtData when game changes
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
 
  const handleAddGame = () => {
    setSelectedGames([
      ...selectedGames,
      { game: "", startTime: "", endTime: "", courtData: [] },
    ]);
  };
 
  const handleAddCourt = (gameIndex) => {
    if (!selectedGames[gameIndex].game) {
      alert("Please select a game before adding a court!");
      return;
    }
 
    const newSelectedGames = [...selectedGames];
    newSelectedGames[gameIndex].courtData.push({
      courtName: "",
      description: "",
      price: "",
      count: 1,
    });
    setSelectedGames(newSelectedGames);
  };
 
  const handleCourtChange = (gameIndex, courtIndex, value, field) => {
    const newSelectedGames = [...selectedGames];
    const selectedCourtData = newSelectedGames[gameIndex].courtData[courtIndex];
 
    // Prevent selecting the same court multiple times for the same game
    if (field === "courtName") {
      const isCourtAlreadySelected = newSelectedGames[gameIndex].courtData.some(
        (court) => court.courtName === value
      );
      if (isCourtAlreadySelected) {
        alert("This court has already been selected for this game.");
        return; // Prevent further actions if court is already selected
      }
 
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
 
  const handleIncrement = (gameIndex, courtIndex) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[gameIndex].courtData[courtIndex].count += 1;
    setSelectedGames(newSelectedGames);
  };
 
  const handleDecrement = (gameIndex, courtIndex) => {
    const newSelectedGames = [...selectedGames];
    const currentCount = newSelectedGames[gameIndex].courtData[courtIndex].count;
    if (currentCount > 1) {
      newSelectedGames[gameIndex].courtData[courtIndex].count -= 1;
      setSelectedGames(newSelectedGames);
    }
  };
 
  const handleRemoveGame = (gameIndex) => {
    const newSelectedGames = selectedGames.filter((_, index) => index !== gameIndex);
    setSelectedGames(newSelectedGames);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!turf.turfName.trim()) {
      alert("Turf Name is required!");
      return;
    }
 
    if (!turf.location.trim()) {
      alert("Turf Location is required!");
      return;
    }
 
    if (!turf.imageUrl) {
      alert("Please upload an image for the turf!");
      return;
    }
 
    if (selectedGames.length === 0) {
      alert("At least one game is required!");
      return;
    }
 
    for (const game of selectedGames) {
      if (!game.game.trim()) {
        alert("Game name is required for each game!");
        return;
      }
 
      if (!game.startTime || !game.endTime) {
        alert("Start time and end time are required for each game!");
        return;
      }
 
      if (game.startTime >= game.endTime) {
        alert(`Start time must be before end time for the game "${game.game}"!`);
        return;
      }
 
      if (game.courtData.length === 0) {
        alert(`At least one court is required for the game "${game.game}"!`);
        return;
      }
 
      for (const court of game.courtData) {
        if (!court.courtName.trim()) {
          alert(`Court name is required for a court in the game "${game.game}"!`);
          return;
        }
 
        if (!court.description.trim()) {
          alert(`Court description is required for a court in the game "${game.game}"!`);
          return;
        }
 
        if (!court.price || court.price <= 0) {
          alert(`A valid price is required for a court in the game "${game.game}"!`);
          return;
        }
      }
    }
 
    const formData = new FormData();
    formData.append("turfName", turf.turfName);
    formData.append("location", turf.location);
    formData.append("imageUrl", turf.imageUrl);
 
    dispatch(registerTurf(formData))
      .then(() => {
        toast.success("Turf registered successfully! Wait for approval");
        for (const game of selectedGames) {
          dispatch(registerGameToTurf(game))
            .then(() => {
              for (const court of game.courtData) {
                for (let i = 0; i < court.count; i++) {
                  dispatch(registerCourtToGame(court));
                }
              }
            })
            .catch((error) => {
              console.error("Error registering game: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error registering turf: ", error);
      });
    navigate("/profile");
  };
 
  // Function to filter out already selected games
  const getAvailableGames = () => {
    const selectedGameNames = selectedGames.map((game) => game.game);
    return availableGames.filter((game) => !selectedGameNames.includes(game));
  };
 
  const getAvailableCourts = (gameIndex) => {
    const selectedCourts = selectedGames[gameIndex].courtData.map(
      (court) => court.courtName
    );
    return courts[selectedGames[gameIndex].game].filter(
      (court) => !selectedCourts.includes(court.name)
    );
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <form
        className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Turf Registration
        </h2>
 
        {/* Turf Information Section */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="turfName"
              className="block text-lg font-medium text-gray-700"
            >
              Turf Name
            </label>
            <input
              id="turfName"
              name="turfName"
              value={turf.turfName}
              onChange={handleTurf}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Turf Name"
            />
          </div>
          <div>
            <label
              htmlFor="turfLocation"
              className="block text-lg font-medium text-gray-700"
            >
              Turf Location
            </label>
            <input
              id="turfLocation"
              name="location"
              value={turf.location}
              onChange={handleTurf}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Turf Location"
            />
          </div>
          <div>
            <label
              htmlFor="turfImage"
              className="block text-lg font-medium text-gray-700"
            >
              Turf Image
            </label>
            <input
              id="turfImage"
              name="imageUrl"
              type="file"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
 
        {/* Render Game Selection and Time Inputs */}
        {selectedGames.map((selectedGame, gameIndex) => (
          <div key={gameIndex} className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <label
                htmlFor={`game_${gameIndex}`}
                className="text-lg font-medium text-gray-700"
              >
                Game Name
              </label>
              <button
                type="button"
                onClick={() => handleRemoveGame(gameIndex)}
                className="text-red-600 font-bold text-sm"
              >
                Remove
              </button>
            </div>
            <select
              id={`game_${gameIndex}`}
              value={selectedGame.game}
              onChange={(e) => handleGameChange(gameIndex, e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" >
                {selectedGame.game ? selectedGame.game : 'Select a Game'}
              </option>
              {getAvailableGames().map((gameOption) => (
                <option key={gameOption} value={gameOption}>
                  {gameOption}
                </option>
              ))}
            </select>
 
            {/* Time and Court Selection */}
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
                  value={selectedGame.startTime}
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
                  value={selectedGame.endTime}
                  onChange={(e) =>
                    handleTimeChange(gameIndex, "endTime", e.target.value)
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {errors[gameIndex] && <p className="text-red-500 text-md mt-2">{errors[gameIndex]}</p>}
 
            {/* Render Court Fields */}
            {selectedGame.courtData.map((court, courtIndex) => (
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
                    value={court.courtName}
                    onChange={(e) =>
                      handleCourtChange(gameIndex, courtIndex, e.target.value, "courtName")
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" >
                      {court.courtName ? court.courtName : 'Select a Court'}
                    </option>
                    {getAvailableCourts(gameIndex).map((courtOption) => (
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
                    value={court.description}
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
                    value={court.price}
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
                    <span className="pl-2">
                      No. of Similar Courts
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDecrement(gameIndex, courtIndex)}
                      className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{court.count}</span>
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
 
            <button
              type="button"
              onClick={() => handleAddCourt(gameIndex)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Court
            </button>
          </div>
        ))}
 
        <button
          type="button"
          onClick={handleAddGame}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Game
        </button>
 
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          Register Turf
        </button>
      </form>
    </div>
  );
}
 
export default AddTurf;
 
 
 

































// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { registerCourtToGame, registerGameToTurf, registerTurf } from "../../ReduxToolKit/TurfRegistrationSlice";
// import { courts } from "./courts";
 
// function AddTurf() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [turf, setTurf] = useState({
//     turfName: "",
//     location: "",
//     imageUrl: null,
//   });
//   const [selectedGames, setSelectedGames] = useState([]);
//   const [errors, setErrors] = useState([]);
 
//   const availableGames = [
//     "Football",
//     "Basketball",
//     "Cricket",
//     "Tennis",
//     "Badminton",
//   ];
 
//   const validateTimes = (gameIndex, startTime, endTime) => {
//     const newErrors = [...errors];
//     if (startTime && endTime && startTime >= endTime) {
//       newErrors[gameIndex] = "End time must be after start time.";
//     } else {
//       newErrors[gameIndex] = "";
//     }
//     setErrors(newErrors);
//   };
 
//   const handleImageUpload = (e) => {
//     setTurf((prevState) => ({ ...prevState, imageUrl: e.target.files[0] }));
//   };
 
//   const handleTurf = (e) => {
//     const { name, value } = e.target;
//     setTurf({
//       ...turf,
//       [name]: value,
//     });
//   };
 
//   const handleGameChange = (index, game) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[index].game = game;
//     newSelectedGames[index].courtData = []; // Reset courtData when game changes
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
 
//   const handleAddGame = () => {
//     setSelectedGames([
//       ...selectedGames,
//       { game: "", startTime: "", endTime: "", courtData: [] },
//     ]);
//   };
 
//   const handleAddCourt = (gameIndex) => {
//     if (!selectedGames[gameIndex].game) {
//       alert("Please select a game before adding a court!");
//       return;
//     }
 
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData.push({
//       courtName: "",
//       description: "",
//       price: "",
//       count: 1,
//     });
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleCourtChange = (gameIndex, courtIndex, value, field) => {
//     const newSelectedGames = [...selectedGames];
//     const selectedCourtData = newSelectedGames[gameIndex].courtData[courtIndex];
 
//     if (field === 'courtName') {
//       selectedCourtData.courtName = value;
//       const selectedCourt = courts[selectedGames[gameIndex].game].find(
//         (court) => court.name === value
//       );
//       if (selectedCourt) {
//         selectedCourtData.description = selectedCourt.description;
//       }
//     } else if (field === 'price') {
//       selectedCourtData.price = value;
//     } else if (field === 'description') {
//       selectedCourtData.description = value;
//     }
 
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleRemoveCourt = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData.splice(courtIndex, 1);
//     setSelectedGames(newSelectedGames);
//   };
//   const handleRemoveGame = (gameIndex) => {
//     const newSelectedGames = selectedGames.filter(
//       (_, index) => index !== gameIndex
//     );
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleIncrement = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData[courtIndex].count += 1;
//     setSelectedGames(newSelectedGames);
//   };
 
//   const handleDecrement = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     const currentCount = newSelectedGames[gameIndex].courtData[courtIndex].count;
//     if (currentCount > 1) {
//       newSelectedGames[gameIndex].courtData[courtIndex].count -= 1;
//       setSelectedGames(newSelectedGames);
//     }
//   };
 
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!turf.turfName.trim()) {
//       alert("Turf Name is required!");
//       return;
//     }
 
//     if (!turf.location.trim()) {
//       alert("Turf Location is required!");
//       return;
//     }
 
//     if (!turf.imageUrl) {
//       alert("Please upload an image for the turf!");
//       return;
//     }
 
//     if (selectedGames.length === 0) {
//       alert("At least one game is required!");
//       return;
//     }
 
//     for (const game of selectedGames) {
//       if (!game.game.trim()) {
//         alert("Game name is required for each game!");
//         return;
//       }
 
//       if (!game.startTime || !game.endTime) {
//         alert("Start time and end time are required for each game!");
//         return;
//       }
 
//       if (game.startTime >= game.endTime) {
//         alert(`Start time must be before end time for the game "${game.game}"!`);
//         return;
//       }
 
//       if (game.courtData.length === 0) {
//         alert(`At least one court is required for the game "${game.game}"!`);
//         return;
//       }
 
//       for (const court of game.courtData) {
//         if (!court.courtName.trim()) {
//           alert(`Court name is required for a court in the game "${game.game}"!`);
//           return;
//         }
 
//         if (!court.description.trim()) {
//           alert(`Court description is required for a court in the game "${game.game}"!`);
//           return;
//         }
 
//         if (!court.price || court.price <= 0) {
//           alert(`A valid price is required for a court in the game "${game.game}"!`);
//           return;
//         }
//       }
//     }
 
//     const formData = new FormData();
//     formData.append("turfName", turf.turfName);
//     formData.append("location", turf.location);
//     formData.append("imageUrl", turf.imageUrl);
//     console.log(selectedGames);
    
//     dispatch(registerTurf(formData))
//       .then(() => {
//         for (const game of selectedGames) {
//           dispatch(registerGameToTurf(game))
//             .then(() => {
//               for (const court of game.courtData) {
//                 for (let i = 0; i < court.count; i++) {
//                   dispatch(registerCourtToGame(court));
//                 }
//               }
//             })
//             .catch((error) => {
//               console.error("Error registering game: ", error);
//             });
//         }
//       })
//       .catch((error) => {
//         console.error("Error registering turf: ", error);
//       });
//     navigate("/profile");
//   };
 
//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
//       <form
//         className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg space-y-6"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
//           Turf Registration
//         </h2>
 
//         {/* Turf Information Section */}
//         <div className="space-y-4">
//           <div>
//             <label
//               htmlFor="turfName"
//               className="block text-lg font-medium text-gray-700"
//             >
//               Turf Name
//             </label>
//             <input
//               id="turfName"
//               name="turfName"
//               value={turf.turfName}
//               onChange={handleTurf}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Turf Name"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="turfLocation"
//               className="block text-lg font-medium text-gray-700"
//             >
//               Turf Location
//             </label>
//             <input
//               id="turfLocation"
//               name="location"
//               value={turf.location}
//               onChange={handleTurf}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Turf Location"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="turfImage"
//               className="block text-lg font-medium text-gray-700"
//             >
//               Turf Image
//             </label>
//             <input
//               id="turfImage"
//               name="imageUrl"
//               type="file"
//               onChange={handleImageUpload}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
 
//         {/* Render Game Selection and Time Inputs */}
//         {selectedGames.map((selectedGame, gameIndex) => (
//           <div key={gameIndex} className="space-y-4 border-t pt-6">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center w-full">
//                 <label
//                   htmlFor={`game_${gameIndex}`}
//                   className="block text-lg font-medium text-gray-700 w-full"
//                 >
//                   Game Name
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveGame(gameIndex)}
//                   className="ml-2 text-red-600 font-bold text-sm"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//             <select
//               id={`game_${gameIndex}`}
//               value={selectedGame.game}
//               onChange={(e) => handleGameChange(gameIndex, e.target.value)}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a Game</option>
//               {availableGames.map((gameOption) => (
//                 <option key={gameOption} value={gameOption}>
//                   {gameOption}
//                 </option>
//               ))}
//             </select>
 
//             <div className="flex space-x-4">
//               <div className="w-full">
//                 <label
//                   htmlFor={`startTime_${gameIndex}`}
//                   className="block text-lg font-medium text-gray-700"
//                 >
//                   Start Time
//                 </label>
//                 <input
//                   type="time"
//                   id={`startTime_${gameIndex}`}
//                   value={selectedGame.startTime}
//                   onChange={(e) =>
//                     handleTimeChange(gameIndex, "startTime", e.target.value)
//                   }
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
 
//               <div className="w-full">
//                 <label
//                   htmlFor={`endTime_${gameIndex}`}
//                   className="block text-lg font-medium text-gray-700"
//                 >
//                   End Time
//                 </label>
//                 <input
//                   type="time"
//                   id={`endTime_${gameIndex}`}
//                   value={selectedGame.endTime}
//                   onChange={(e) =>
//                     handleTimeChange(gameIndex, "endTime", e.target.value)
//                   }
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
 
//             {/* Render Court Fields */}
//             {selectedGame.courtData.map((court, courtIndex) => (
//               <div key={courtIndex} className="space-y-4 border-t pt-4">
//                 <div>
//                   <label
//                     htmlFor={`courtName_${gameIndex}_${courtIndex}`}
//                     className="block text-lg font-medium text-gray-700"
//                   >
//                     Court Name
//                   </label>
//                   <select
//                     id={`courtName_${gameIndex}_${courtIndex}`}
//                     value={court.courtName}
//                     onChange={(e) =>
//                       handleCourtChange(gameIndex, courtIndex, e.target.value, "courtName")
//                     }
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select a Court</option>
//                     {courts[selectedGame.game].map((courtOption) => (
//                       <option key={courtOption.name} value={courtOption.name}>
//                         {courtOption.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
 
//                 {/* Court Description */}
//                 <div>
//                   <label
//                     htmlFor={`courtDescription_${gameIndex}_${courtIndex}`}
//                     className="block text-lg font-medium text-gray-700"
//                   >
//                     Court Description
//                   </label>
//                   <textarea
//                     id={`courtDescription_${gameIndex}_${courtIndex}`}
//                     value={court.description}
//                     onChange={(e) =>
//                       handleCourtChange(gameIndex, courtIndex, e.target.value, "description")
//                     }
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter Court Description"
//                   />
//                 </div>
 
//                 {/* Court Price */}
//                 <div>
//                   <label
//                     htmlFor={`courtPrice_${gameIndex}_${courtIndex}`}
//                     className="block text-lg font-medium text-gray-700"
//                   >
//                     Price
//                   </label>
//                   <input
//                     type="number"
//                     id={`courtPrice_${gameIndex}_${courtIndex}`}
//                     value={court.price}
//                     onChange={(e) =>
//                       handleCourtChange(gameIndex, courtIndex, e.target.value, "price")
//                     }
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter Price in Rupees per Hour"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
 
//                 <div className="flex items-center justify-between space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveCourt(gameIndex, courtIndex)}
//                     className="text-red-600 font-bold text-sm"
//                   >
//                     Remove Court
//                   </button>
//                   <div className="flex items-center space-x-4">
//                     <span className="pl-2">
//                       No. of Similar Courts
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => handleDecrement(gameIndex, courtIndex)}
//                       className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
//                     >
//                       -
//                     </button>
//                     <span className="text-lg font-medium">{court.count}</span>
//                     <button
//                       type="button"
//                       onClick={() => handleIncrement(gameIndex, courtIndex)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
 
//             <button
//               type="button"
//               onClick={() => handleAddCourt(gameIndex)}
//               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//             >
//               Add Court
//             </button>
//           </div>
//         ))}
 
//         <button
//           type="button"
//           onClick={handleAddGame}
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//         >
//           Add Game
//         </button>
 
//         <button
//           type="submit"
//           className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//         >
//           Register Turf
//         </button>
//       </form>
//     </div>
//   );
// }
 
// export default AddTurf;
 

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   registerCourtToGame,
//   registerGameToTurf,
//   registerTurf,
// } from "../../ReduxToolKit/TurfRegistrationSlice";

// function AddTurf() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [turf, setTurf] = useState({
//     turfName: "",
//     location: "",
//     imageUrl: null,
//   });
//   const [selectedGames, setSelectedGames] = useState([]);

//   const availableGames = [
//     "Football",
//     "Basketball",
//     "Cricket",
//     "Tennis",
//     "Badminton",
//   ];

//   const [errors, setErrors] = useState([]); // To track errors for each game

//   const validateTimes = (gameIndex, startTime, endTime) => {
//     const newErrors = [...errors];
//     if (startTime && endTime && startTime >= endTime) {
//       newErrors[gameIndex] = "End time must be after start time.";
//     } else {
//       newErrors[gameIndex] = ""; // Clear the error if validation passes
//     }
//     setErrors(newErrors);
//   };

//   const handleImageUpload = (e) => {
//     setTurf((prevState) => ({ ...prevState, imageUrl: e.target.files[0] }));
//   };

//   const handleTurf = (e) => {
//     const { name, value } = e.target;
//     setTurf({
//       ...turf,
//       [name]: value,
//     });
//   };

//   const handleGameChange = (index, game) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[index].game = game;
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

//   const handleAddGame = () => {
//     setSelectedGames([
//       ...selectedGames,
//       { game: "", startTime: "", endTime: "", courtData: [] },
//     ]);
//   };

//   const handleAddCourt = (gameIndex) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData.push({
//       courtName: "",
//       description: "",
//       price: "",
//     });
//     setSelectedGames(newSelectedGames);
//   };

//   const handleCourtChange = (gameIndex, courtIndex, type, value) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData[courtIndex][type] = value;
//     setSelectedGames(newSelectedGames);
//   };

//   const handleRemoveCourt = (gameIndex, courtIndex) => {
//     const newSelectedGames = [...selectedGames];
//     newSelectedGames[gameIndex].courtData.splice(courtIndex, 1); // Remove the court by its index
//     setSelectedGames(newSelectedGames);
//   };

  // const handleRemoveGame = (gameIndex) => {
  //   const newSelectedGames = selectedGames.filter(
  //     (_, index) => index !== gameIndex
  //   );
  //   setSelectedGames(newSelectedGames);
  // };

//   const [count, setCount] = useState(1);

//   const handleIncrement = () => {
//     setCount((prevCount) => prevCount + 1);
//   };

//   const handleDecrement = () => {
//     setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!turf.turfName.trim()) {
//       alert("Turf Name is required!");
//       return;
//     }

//     if (!turf.location.trim()) {
//       alert("Turf Location is required!");
//       return;
//     }

//     if (!turf.imageUrl) {
//       alert("Please upload an image for the turf!");
//       return;
//     }

//     if (selectedGames.length === 0) {
//       alert("At least one game is required!");
//       return;
//     }

//     for (const game of selectedGames) {
//       if (!game.game.trim()) {
//         alert("Game name is required for each game!");
//         return;
//       }

//       if (!game.startTime || !game.endTime) {
//         alert("Start time and end time are required for each game!");
//         return;
//       }

//       if (game.startTime >= game.endTime) {
//         alert(
//           `Start time must be before end time for the game "${game.game}"!`
//         );
//         return;
//       }

//       if (game.courtData.length === 0) {
//         alert(`At least one court is required for the game "${game.game}"!`);
//         return;
//       }

//       for (const court of game.courtData) {
//         if (!court.courtName.trim()) {
//           alert(
//             `Court name is required for a court in the game "${game.game}"!`
//           );
//           return;
//         }

//         if (!court.description.trim()) {
//           alert(
//             `Court description is required for a court in the game "${game.game}"!`
//           );
//           return;
//         }

//         if (!court.price || court.price <= 0) {
//           alert(
//             `A valid price is required for a court in the game "${game.game}"!`
//           );
//           return;
//         }
//       }
//     }
//     const formData = new FormData();
//     formData.append("turfName", turf.turfName);
//     formData.append("location", turf.location);
//     formData.append("imageUrl", turf.imageUrl);
//     // Register the turf first
//     console.log(selectedGames);
//     dispatch(registerTurf(formData))
//       .then(() => {
//         for (const game of selectedGames) {
//           console.log(game);
//           dispatch(registerGameToTurf(game))
//             .then(() => {
//               for (const court of game.courtData) {
//                 dispatch(registerCourtToGame(court));
//               }
//             })
//             .catch((error) => {
//               console.error("Error registering game: ", error);
//             });
//         }
//       })
//       .catch((error) => {
//         console.error("Error registering turf: ", error);
//       });
//     navigate("/profile");
//     // window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
//       <form
//         className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg space-y-6"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
//           Turf Registration
//         </h2>

//         {/* Turf Information Section */}
//         <div className="space-y-4">
//           <div>
//             <label
//               htmlFor="turfName"
//               className="block text-lg font-medium text-gray-700"
//             >
//               Turf Name
//             </label>
//             <input
//               id="turfName"
//               name="turfName"
//               value={turf.turfName}
//               onChange={handleTurf}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Turf Name"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="turfLocation"
//               className="block text-lg font-medium text-gray-700"
//             >
//               Turf Location
//             </label>
//             <input
//               id="turfLocation"
//               name="location"
//               value={turf.location}
//               onChange={handleTurf}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Turf Location"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="turfImage"
//               className="block text-lg font-medium text-gray-700"
//             >
//               Turf Image
//             </label>
//             <input
//               id="turfImage"
//               name="imageUrl"
//               type="file"
//               onChange={handleImageUpload}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter Turf Image URL"
//             />
//           </div>
//         </div>

//         {/* Render Game Selection and Time Inputs */}
//         {selectedGames.map((selectedGame, gameIndex) => (
//           <div key={gameIndex} className="space-y-4 border-t pt-6">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center w-full">
//                 <label
//                   htmlFor={`game_${gameIndex}`}
//                   className="block text-lg font-medium text-gray-700 w-full"
//                 >
//                   Game Name
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveGame(gameIndex)}
//                   className="ml-2 text-red-600 font-bold text-sm"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//             <select
//               id={`game_${gameIndex}`}
//               value={selectedGame.game}
//               onChange={(e) => handleGameChange(gameIndex, e.target.value)}
//               className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a Game</option>
//               {availableGames.map((gameOption) => (
//                 <option key={gameOption} value={gameOption}>
//                   {gameOption}
//                 </option>
//               ))}
//             </select>

//             <div className="flex space-x-4">
//               <div className="w-full">
//                 <label
//                   htmlFor={`startTime_${gameIndex}`}
//                   className="block text-lg font-medium text-gray-700"
//                 >
//                   Start Time
//                 </label>
//                 <input
//                   type="time"
//                   id={`startTime_${gameIndex}`}
//                   value={selectedGame.startTime}
//                   onChange={(e) =>
//                     handleTimeChange(gameIndex, "startTime", e.target.value)
//                   }
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div className="w-full">
//                 <label
//                   htmlFor={`endTime_${gameIndex}`}
//                   className="block text-lg font-medium text-gray-700"
//                 >
//                   End Time
//                 </label>
//                 <input
//                   type="time"
//                   id={`endTime_${gameIndex}`}
//                   value={selectedGame.endTime}
//                   onChange={(e) =>
//                     handleTimeChange(gameIndex, "endTime", e.target.value)
//                   }
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//             {errors[gameIndex] && (
//               <p className="text-red-500 text-sm mt-2">{errors[gameIndex]}</p>
//             )}

//             {/* Render Court Fields */}
//             {selectedGame.courtData.map((court, courtIndex) => (
//               <div key={courtIndex} className="space-y-4 border-t pt-4">
//                 <div>
//                   <label
//                     htmlFor={`courtName_${gameIndex}_${courtIndex}`}
//                     className="block text-lg font-medium text-gray-700"
//                   >
//                     Court Name
//                   </label>
//                   <input
//                     type="text"
//                     id={`courtName_${gameIndex}_${courtIndex}`}
//                     value={court.courtName}
//                     onChange={(e) =>
//                       handleCourtChange(
//                         gameIndex,
//                         courtIndex,
//                         "courtName",
//                         e.target.value
//                       )
//                     }
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter Court Name"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor={`courtDescription_${gameIndex}_${courtIndex}`}
//                     className="block text-lg font-medium text-gray-700"
//                   >
//                     Court Description
//                   </label>
//                   <textarea
//                     id={`courtDescription_${gameIndex}_${courtIndex}`}
//                     value={court.description}
//                     onChange={(e) =>
//                       handleCourtChange(
//                         gameIndex,
//                         courtIndex,
//                         "description",
//                         e.target.value
//                       )
//                     }
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter Court Description"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor={`courtPrice_${gameIndex}_${courtIndex}`}
//                     className="block text-lg font-medium text-gray-700"
//                   >
//                     Price
//                   </label>
//                   <input
//                     type="number"
//                     id={`courtPrice_${gameIndex}_${courtIndex}`}
//                     value={court.price}
//                     onChange={(e) =>
//                       handleCourtChange(
//                         gameIndex,
//                         courtIndex,
//                         "price",
//                         e.target.value
//                       )
//                     }
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter Price in Rupees per Hour"
//                     min="0" // Ensure price is not negative
//                     step="0.01" // Allow decimal values (if needed)
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => handleRemoveCourt(gameIndex, courtIndex)}
//                   className="text-red-600 font-bold text-sm"
//                 >
//                   Remove Court
//                 </button>
//                 <div className="flex items-center space-x-4 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => handleDecrement(court.id)}
//                     className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
//                   >
//                     -
//                   </button>
//                   <span className="text-lg font-medium">{count}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleIncrement(court.id)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={() => handleAddCourt(gameIndex)}
//               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//             >
//               Add Court
//             </button>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={handleAddGame}
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//         >
//           Add Game
//         </button>

//         <button
//           type="submit"
//           className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//         >
//           Register Turf
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddTurf;