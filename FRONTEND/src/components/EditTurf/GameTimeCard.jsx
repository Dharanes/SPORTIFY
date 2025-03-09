import React from "react";

const GameTimeCard = ({
  gameID,
  game,
  gameTimes,
  errorMessages,
  editingGame,
  handleTimeChange,
  handleEditTime,
  handleCancelEdit,
  handleDeleteGame,
  handleSaveEdit,
  handleShowCourts,
}) => {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div className="space-y-2">
        <span className="text-lg font-medium text-gray-700">{game}</span>
        {editingGame === game && errorMessages[game] && (
          <div className="text-red-500 text-sm">{errorMessages[game]}</div>
        )}
        <div className="text-gray-600 text-sm">
          {editingGame === game ? (
            <div className="flex space-x-4">
              <input
                type="time"
                value={gameTimes?.startTime || ''}
                onChange={(e) =>
                  handleTimeChange(game, "startTime", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
              <span className="text-lg pt-1"> - </span>
              <input
                type="time"
                value={gameTimes?.endTime || ''}
                onChange={(e) =>
                  handleTimeChange(game, "endTime", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {gameTimes?.startTime} - {gameTimes?.endTime}
            </div>
          )}
        </div>
      </div>

      {/* Show Edit/Save/Cancel buttons */}
      <div className="flex space-x-2">
        {editingGame === game ? (
          <>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-500 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </>
        ) : (
          <>
            {/* <button
              type="button"
              onClick={() => handleEditTime(game)}
              className="text-white bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit Time
            </button> */}
            <button
              type="button"
              onClick={() => handleShowCourts(game)}
              className="text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
            >
              Courts
            </button>
            <button
              type="button"
              onClick={() => handleDeleteGame(game)}
              className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameTimeCard;
