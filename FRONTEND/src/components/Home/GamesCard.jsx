import React from "react";
import { useNavigate } from "react-router-dom";

function GamesCard({ imageUrl, gameName, location }) {
  const navigate = useNavigate()
  const url = `/find-turf/${encodeURIComponent(location)}`;

  const handleClick = (e) => {
    if (!location) {
      e.preventDefault();
      alert("Please select a location before proceeding.");
    } else {
      const loc = location
      navigate(url, { state: { gameName, loc } });
      
    }
  };

  return (
    <div onClick={handleClick} aria-label={`Select ${gameName}`}>
      <div className="relative cursor-pointer rounded-2xl overflow-hidden min-w-[180px] md:min-w-[100px] min-h-[120px] m-4">
        <div className="absolute text-white font-bold bottom-0 ml-4 mb-6 md:mb-4 leading-7">
          {gameName}
        </div>
        <img
          src={imageUrl}
          alt={`Image of ${gameName}`}
          className="min-w-[180px] md:min-w-[100px] min-h-[120px]"
        />
      </div>
    </div>
  );
}

export default GamesCard;
