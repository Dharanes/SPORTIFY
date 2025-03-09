import React, { useEffect, useState } from "react";
import GamesCard from "./GamesCard";
import games from "./games";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../ReduxToolKit/LocationSlice";
import { SlLocationPin } from "react-icons/sl";


export default function Home() {
  const location = useSelector((state) => state.location.location);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const selectedLocation = e.target.value;
    dispatch(setLocation(selectedLocation));
    localStorage.setItem("location", selectedLocation);
  };

  return (
    <>
      <div className="grid h-screen grid-cols-2">
        <div className="flex h-full items-center">
          <div className="px-10">
          <div className="relative mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
                <SlLocationPin className="absolute text-xl left-3" />
                <select
                  className="w-full p-3 pl-9 appearance-none text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  onChange={handleChange}
                  value={location}
                >
                  <option value="" disabled>
                    Enter your location
                  </option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>
 

            <h2 className="text-3xl font-bold mb-2 text-gray-700">
              FIND GAMES &<br />
              VENUES NEARBY
            </h2>
            <p className="text-xl font-semibold text-gray-500">
              Seamlessly explore sports venues and play <br />
              with sports enthusiasts just like you!
            </p>
          </div>
        </div>
        <div className="grid p-10 h-[84vh] grid-cols-2">
          {/* Left panel with one image */}
          <div className="flex h-full">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://cdn.pixabay.com/photo/2021/02/09/15/55/badminton-5998954_1280.jpg')",
              }}
            ></div>
          </div>

          {/* Right panel with two images */}
          <div className="flex flex-col h-full">
            {/* First image in the right panel */}
            <div
              className="w-full h-1/2 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://cdn.pixabay.com/photo/2015/01/26/22/40/child-613199_1280.jpg')",
              }}
            ></div>

            {/* Second image in the right panel */}
            <div
              className="w-full h-1/2 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://cdn.pixabay.com/photo/2015/04/15/21/06/cricket-724615_1280.jpg')",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-8 min-h-[140px] bg-gray-100">
        <h3 className="md:px-12 pt-4 px-4 font-bold leading-9 md:text-2xl text-xl">
          Available Sports
        </h3>
        <div className="flex space-x-6 overflow-x-auto no-scrollbar md:justify-start px-4">
          {games.map((game) => (
            <GamesCard
              key={game.name}
              imageUrl={game.image}
              gameName={game.name}
              location={location}
            />
          ))}
        </div>
      </div>
 
    </>
  );
}
