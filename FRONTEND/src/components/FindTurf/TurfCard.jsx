import React, { useEffect, useState } from "react";
import badminton from "../../images/badminton.png";
import cricket from "../../images/cricket.png";
import football from "../../images/football.png";
import basketball from "../../images/basketball.png";
import tennis from "../../images/tennis.png";
import table_tennis from "../../images/table_tennis.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getGamesByTurfId } from "../../ReduxToolKit/TurfSlice";

function TurfCard({
  turfId,
  turfName,
  imageUrl,
  turfLocation,
  gameName,
  games,
  rating,
  noOfRating,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const predefinedGames = [
    { name: "Badminton", image: badminton },
    { name: "Cricket", image: cricket },
    { name: "Football", image: football },
    { name: "Basketball", image: basketball },
    { name: "Tennis", image: tennis },
    { name: "Table Tennis", image: table_tennis },
  ];

  const [availableGames, setAvailableGames] = useState([]);

  useEffect(() => {
    if (games && games.length > 0) {
      const filteredGames = predefinedGames.filter((game) =>
        games.includes(game.name)
      );
      setAvailableGames(filteredGames);
    }
  }, [games]);

  useEffect(() => {
    dispatch(getGamesByTurfId(turfId));
  }, [dispatch, turfId]);

  function capitalizeEachWord(text) {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <div
      onClick={() =>
        navigate(`/turf-details/${turfName}`, {
          state: { turfId, turfName, imageUrl, turfLocation, gameName },
        })
      }
      className="relative border_radius bg-white card_shadow pb-4 cursor-pointer transition transform hover:scale-105 hover:shadow-lg"
    >
      <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-t-md overflow-hidden">
        <img
          alt={turfName}
          src={`data:image/jpeg;base64,${imageUrl}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          {rating === 0 && noOfRating === 0 ? (
            "No Ratings"
          ) : (
            <>
              ⭐ {rating.toFixed(1)} ({noOfRating})
            </>
          )}
        </div>

        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
          <h3 className="text-lg font-semibold truncate">
            {capitalizeEachWord(turfName)}
          </h3>
          <p className="text-sm truncate">{capitalizeEachWord(turfLocation)}</p>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>Games Available:</span>
          <div className="flex items-center space-x-2">
            {availableGames.slice(0, 2).map((game, index) => (
              <img
                key={index}
                alt={game.name}
                src={game.image}
                className="w-8 h-8 rounded-full shadow-md"
              />
            ))}
            {availableGames.length > 2 && (
              <span className="text-xs font-medium text-gray-500">
                +{availableGames.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Internal CSS Styles */}
      <style jsx>{`
        .card_shadow {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        .border_radius {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}

export default TurfCard;
