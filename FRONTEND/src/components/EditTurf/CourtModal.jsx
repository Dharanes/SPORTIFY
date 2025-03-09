// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { getTurfId, registerCourtToGameById } from "../../ReduxToolKit/TurfSlice";
// import { BiEditAlt } from "react-icons/bi";
// import { AiTwotoneDelete } from "react-icons/ai";
// import { courts } from "../Profile/courts";

// const CourtModal = ({
//   isModalOpen,
//   courtData,
//   selectedGame,
//   handleCloseModal,
//   handleSaveCourtChanges,
//   turfId
// }) => {
//   const dispatch = useDispatch();
//   const [editableCourts, setEditableCourts] = useState([]);
//   const [editingCourtIndex, setEditingCourtIndex] = useState(null);
//   const [newCourt, setNewCourt] = useState({
//     name: "",
//     description: "",
//     price: "",
//     count: 1, // Adding a count property for similar courts
//   });
//   const [showAddCourtForm, setShowAddCourtForm] = useState(false);
//   const [tempCourt, setTempCourt] = useState(null);

//   useEffect(() => {
//     if (isModalOpen) {
//       setShowAddCourtForm(false); // Ensure the Add Court form is disabled by default when modal is opened
//     }
//   }, [isModalOpen]); // Only runs when the modal is opened

//   useEffect(() => {
//     setEditableCourts(courtData);
//   }, [courtData]);

//   const handleChange = (field, value) => {
//     const updatedCourt = { ...tempCourt, [field]: value };
//     setTempCourt(updatedCourt);
//   };

//   const startEditing = (index) => {
//     const courtToEdit = editableCourts[index];
//     setTempCourt({ ...courtToEdit });
//     setEditingCourtIndex(index);
//   };

//   const handleSaveChanges = () => {
// handleSaveCourtChanges(tempCourt, editingCourtIndex, selectedGame);
// const updatedCourts = [...editableCourts];
// updatedCourts[editingCourtIndex] = tempCourt;
// setEditableCourts(updatedCourts);
// setEditingCourtIndex(null);
//   };

//   const handleAddNewCourt = () => {
//     if (newCourt.name && newCourt.description && newCourt.price) {
//       for (let i = 0; i < newCourt.count; i++) {
//         // Add multiple similar courts based on the count
//         dispatch(
//           registerCourtToGameById({
//             gameName: selectedGame,
//             court: {
//               courtName: newCourt.name,
//               description: newCourt.description,
//               price: newCourt.price,
//             },
//             id: turfId,
//           })
//         ).then((registerResponse) => {
//           if (registerResponse.meta.requestStatus === "fulfilled") {
//             setEditableCourts((prevCourts) => [
//               ...prevCourts,
//               {
//                 name: newCourt.name,
//                 description: newCourt.description,
//                 price: newCourt.price,
//               },
//             ]);
//             setNewCourt({ name: "", description: "", price: "", count: 1 });
//             setShowAddCourtForm(false);
//           } else {
//             alert("Failed to register the court. Please try again.");
//           }
//         });
//       }
//     } else {
//       alert("Please fill out all fields to add a court");
//     }
//   };

//   const handleCancelEdit = () => {
//     setTempCourt(null); // Reset the temporary state
//     setEditingCourtIndex(null); // Exit edit mode
//   };

//   const handleDeleteCourt = (index) => {
//     const courtName = editableCourts[index].name;
//     const confirmDelete = window.confirm(`Are you sure you want to delete ${courtName}?`);
//     if (confirmDelete) {
//       const updatedCourts = editableCourts.filter((court, idx) => idx !== index);
//       setEditableCourts(updatedCourts);
//       // Here, you'd also dispatch an action to delete the court from your backend
//       // dispatch(deleteCourtFromGameById(courtId)); // If you have a Redux action for deletion
//     }
//   };

//   const incrementCount = () => {
//     setNewCourt((prev) => ({ ...prev, count: prev.count + 1 }));
//   };

//   const decrementCount = () => {
//     setNewCourt((prev) => ({ ...prev, count: Math.max(1, prev.count - 1) }));
//   };

//   return isModalOpen ? (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-3xl p-8 shadow-lg h-full max-h-[80vh] overflow-y-auto">
//         <div className="flex justify-between items-center border-b pb-4 mb-6">
//           <h3 className="text-2xl font-semibold text-gray-800">
//             {selectedGame} Courts
//           </h3>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setShowAddCourtForm(true)} // Show the form to add a new court
//               className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//             >
//               Add Court
//             </button>
//             <button
//               className="text-gray-500 hover:text-gray-800 text-3xl"
//               onClick={handleCloseModal}
//             >
//               &times;
//             </button>
//           </div>
//         </div>

//         {/* Add Court Form */}
//         {showAddCourtForm && (
//           <div className="mb-6 border-b pb-6">
//             <h4 className="text-lg font-semibold text-gray-800 mb-4">
//               Add New Court
//             </h4>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Court Name
//                 </label>
//                 <select
//                   value={newCourt.name}
//                   onChange={(e) => {
//                     const selectedCourt = courts[selectedGame]?.find(
//                       (court) => court.name === e.target.value
//                     );
//                     setNewCourt({
//                       ...newCourt,
//                       name: e.target.value,
//                       description: selectedCourt?.description || "",
//                     });
//                   }}
//                   className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <option value="">Select Court</option>
//                   {courts[selectedGame]?.map((court) => (
//                     <option key={court.name} value={court.name}>
//                       {court.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Court Description
//                 </label>
//                 <textarea
//                   value={newCourt.description}
//                   onChange={(e) =>
//                     setNewCourt({ ...newCourt, description: e.target.value })
//                   }
//                   className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   rows="2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   value={newCourt.price}
//                   onChange={(e) =>
//                     setNewCourt({ ...newCourt, price: e.target.value })
//                   }
//                   className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Number of Similar Courts
//                 </label>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <button
//                       onClick={decrementCount}
//                       className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//                     >
//                       -
//                     </button>
//                     <span className="text-lg font-medium">{newCourt.count}</span>
//                     <button
//                       onClick={incrementCount}
//                       className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <div className="flex space-x-4">
//                     <button
//                       onClick={() => setShowAddCourtForm(false)} // Cancel adding a court
//                       className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleAddNewCourt} // Add the new court
//                       className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                     >
//                       Add Court
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Render Editable Courts */}
//         {editableCourts && editableCourts.length > 0 ? (
//           editableCourts.map((court, index) => (
//             <div key={index} className="mb-6 border-b pb-6">
//               {editingCourtIndex === index ? (
//                 // Render editable fields if this court is being edited
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Court Name
//                     </label>
//                     <input
//                       type="text"
//                       value={tempCourt?.name || ""}
//                       onChange={(e) => handleChange("name", e.target.value)}
//                       className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Description
//                     </label>
//                     <textarea
//                       value={tempCourt?.description || ""}
//                       onChange={(e) =>
//                         handleChange("description", e.target.value)
//                       }
//                       className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       rows="4"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Price
//                     </label>
//                     <input
//                       type="number"
//                       value={tempCourt?.price.match(/\d+/)[0] || ""}
//                       onChange={(e) => handleChange("price", e.target.value)}
//                       className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                   <div className="flex justify-end space-x-4">
//                     <button
//                       onClick={handleCancelEdit} // Cancel edit
//                       className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleSaveChanges} // Save changes
//                       className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 // Render static court data if not in edit mode
//                 <div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex">
//                       <div className="text-md font-semibold text-gray-800 pr-1">
//                         {court.name}
//                       </div>
//                       <button
//                         onClick={() => startEditing(index)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <BiEditAlt
//                           className="text-lg text-blue-500 cursor-pointer"
//                         />
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteCourt(index)} // Handle delete action
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <AiTwotoneDelete className="text-red-500 text-xl" />
//                     </button>
//                   </div>
//                   <div className="text-sm text-gray-600 mt-2">{court.description}</div>
//                   <div className="text-sm font-medium text-gray-900 mt-2">{court.price}</div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-600">No courts available for this game.</p>
//         )}
//       </div>
//     </div>
//   ) : null; // Ensure modal is only rendered when open
// };

// export default CourtModal;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteCourtById,
  registerCourtToGameById,
} from "../../ReduxToolKit/TurfSlice";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineClose, AiOutlineSave, AiTwotoneDelete } from "react-icons/ai";
import { courts } from "../Profile/courts";

const CourtModal = ({
  isModalOpen,
  courtData,
  selectedGame,
  handleCloseModal,
  handleSaveCourtChanges,
  turfId,
}) => {
  const dispatch = useDispatch();
  const [editableCourts, setEditableCourts] = useState([]);
  const [editingCourtIndex, setEditingCourtIndex] = useState(null);
  const [newCourt, setNewCourt] = useState({
    name: "",
    description: "",
    price: "",
    count: 1,
  });
  const [showAddCourtForm, setShowAddCourtForm] = useState(false);
  const [tempCourt, setTempCourt] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      setShowAddCourtForm(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    setEditableCourts(courtData);
  }, [courtData]);

  const handleChange = (field, value) => {
    const updatedCourt = { ...tempCourt, [field]: value };
    setTempCourt(updatedCourt);
  };

  const startEditing = (index) => {
    const courtToEdit = editableCourts[index];
    setTempCourt({ ...courtToEdit });
    setEditingCourtIndex(index);
  };

  const handleSaveChanges = () => {
    handleSaveCourtChanges(tempCourt, editingCourtIndex, selectedGame);
    const updatedCourts = [...editableCourts];
    updatedCourts[editingCourtIndex] = tempCourt;
    setEditableCourts(updatedCourts);
    setEditingCourtIndex(null);
  };

  const handleAddNewCourt = () => {
    if (newCourt.name && newCourt.description && newCourt.price) {
      for (let i = 0; i < newCourt.count; i++) {
        dispatch(
          registerCourtToGameById({
            gameName: selectedGame,
            court: {
              courtName: newCourt.name,
              description: newCourt.description,
              price: newCourt.price,
            },
            id: turfId,
          })
        ).then((registerResponse) => {
          if (registerResponse.meta.requestStatus === "fulfilled") {
            setEditableCourts((prevCourts) => [
              ...prevCourts,
              {
                name: newCourt.name,
                description: newCourt.description,
                price: newCourt.price,
              },
            ]);
            setNewCourt({ name: "", description: "", price: "", count: 1 });
            setShowAddCourtForm(false);
          } else {
            alert("Failed to register the court. Please try again.");
          }
        });
      }
    } else {
      alert("Please fill out all fields to add a court");
    }
  };

  const handleCancelEdit = () => {
    setTempCourt(null);
    setEditingCourtIndex(null);
  };

  const handleDeleteCourt = (index) => {
    const courtName = editableCourts[index].name;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${courtName}?`
    );
    if (confirmDelete) {
      dispatch(deleteCourtById({ id: editableCourts[index].id }));

      const updatedCourts = editableCourts.filter(
        (court, idx) => idx !== index
      );
      setEditableCourts(updatedCourts);
    }
  };

  const incrementCount = () => {
    setNewCourt((prev) => ({ ...prev, count: prev.count + 1 }));
  };

  const decrementCount = () => {
    setNewCourt((prev) => ({ ...prev, count: Math.max(1, prev.count - 1) }));
  };

  return isModalOpen ? (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 shadow-lg h-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {selectedGame} Courts
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddCourtForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Add Court
            </button>
            <button
              className="text-gray-500 hover:text-gray-800 text-3xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
          </div>
        </div>

        {showAddCourtForm && (
          <div className="mb-6 border-b pb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Court
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Court Name
                </label>
                <select
                  value={newCourt.name}
                  onChange={(e) => {
                    const selectedCourt = courts[selectedGame]?.find(
                      (court) => court.name === e.target.value
                    );
                    setNewCourt({
                      ...newCourt,
                      name: e.target.value,
                      description: selectedCourt?.description || "",
                    });
                  }}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Court</option>
                  {courts[selectedGame]?.length > 0 ? (
                    courts[selectedGame].map((court) => (
                      <option key={court.name} value={court.name}>
                        {court.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No courts available</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Court Description
                </label>
                <textarea
                  value={newCourt.description}
                  onChange={(e) =>
                    setNewCourt({ ...newCourt, description: e.target.value })
                  }
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={newCourt.price}
                  onChange={(e) =>
                    setNewCourt({ ...newCourt, price: e.target.value })
                  }
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Similar Courts
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decrementCount}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">
                      {newCourt.count}
                    </span>
                    <button
                      onClick={incrementCount}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowAddCourtForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewCourt}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Add Court
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {editableCourts && editableCourts.length > 0 ? (
          editableCourts.map((court, index) => (
            <div key={index} className="mb-6 border-b pb-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="text-md font-semibold text-gray-800 pr-1">
                      {court.name}
                    </div>
                    <button
                      onClick={() => startEditing(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <BiEditAlt className="text-lg text-blue-500 cursor-pointer" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteCourt(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiTwotoneDelete className="text-red-500 text-xl" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {court.description}
                </div>
              </div>
              {editingCourtIndex === index ? (
                <div className="flex items-center space-x-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-md font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      value={tempCourt?.price || ""}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="p-1 pl-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center"
                    >
                      <AiOutlineClose className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <AiOutlineSave className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-900 mt-2">
                  Rs {court.price}/hr
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No courts available for this game.</p>
        )}
      </div>
    </div>
  ) : null;
};

export default CourtModal;
