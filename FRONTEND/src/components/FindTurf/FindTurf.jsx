import React, { useEffect, useState } from "react";
import TurfCard from "./TurfCard";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchTurfsByLocationAndGame } from "../../ReduxToolKit/TurfSlice";

function FindTurf() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { gameName, loc } = location.state || {};
  const [search, setSearch] = useState("");
  const turfs = useSelector((state) => state.turfs.turfs);
  const [selectedSport, setSelectedSport] = useState(() => {
    const savedSport = localStorage.getItem("selectedSport");
    return savedSport ? savedSport : gameName || "All Sports"; 
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTurfsByLocationAndGame({ selectedSport, loc }));
  }, [selectedSport, dispatch, loc]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectSport = (sport) => {
    setSelectedSport(sport);
    localStorage.setItem("selectedSport", sport);
    setIsDropdownOpen(false);
  };
  console.log(turfs);
  

  return (
    <>
      <style jsx>{`
        .border_radius {
          border-radius: 0.5rem;
          --tw-border-opacity: 0.2;
        }
      `}</style>

      <div className="z-20 flex flex-col space-y-3 md:flex-row justify-between px-4 md:px-12 lg:px-18 items-center w-full py-4 border">
        <h1 className="font-bold text-lg md:text-2xl mt-3 w-full md:overflow-hidden md:whitespace-nowrap md:overflow-ellipsis">
          Discover and Book Top{" "}
          {selectedSport === "All Sports" ? "Turf" : selectedSport} Courts in
          Click To Select... Online
        </h1>
        <div className="flex flex-col w-full md:w-auto space-y-3 md:space-y-0 md:flex-row items-center justify-end">
          <div className="w-full md:w-64 md:mx-4 relative">
            <div className="flex flex-col h-10">
              <div className="flex flex-row items-center w-full h-10 leading-tight text-gray-700 border-2 appearance-none border_radius border-border_color border-opacity-20 focus:outline-none focus:shadow-outline">
                <div className="relative w-5 h-5 px-1 ml-2">
                  <img
                    alt="search-icon"
                    sizes="100vw"
                    src="https://playo-website.gumlet.io/playo-website-v2/logos-icons/search-icon.svg"
                    style={{
                      position: "absolute",
                      inset: "0px",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full mx-2 leading-tight text-gray-700 appearance-none border-_container focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Search by venue name"
                />
              </div>
            </div>
          </div>

          {/* Sport Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex flex-row items-center w-full md:w-64 h-10 leading-tight text-gray-700 border-2 appearance-none border-border_color border-opacity-20 border_radius"
            >
              <div className="mx-2">
                <div className="relative w-5 h-5">
                  <img
                    alt="sports-filter"
                    src="https://playo-website.gumlet.io/playo-website-v2/logos-icons/sports-filter.svg"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="pr-4">{selectedSport}</span>
                <div className="hidden mx-2 md:flex">
                  <div className="relative h-2 w-3.5">
                    <img
                      alt="dropdown-arrow"
                      src="https://playo-website.gumlet.io/playo-website-v2/logos-icons/down-arrow-dark.svg"
                    />
                  </div>
                </div>
              </div>
            </button>

            {/* Dropdown options */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 w-auto">
                  <li
                    className="px-10 pr-32 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSport("Badminton")}
                  >
                    Badminton
                  </li>
                  <li
                    className="px-10 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSport("Football")}
                  >
                    Football
                  </li>
                  <li
                    className="px-10 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSport("Tennis")}
                  >
                    Tennis
                  </li>
                  <li
                    className="px-10 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSport("Cricket")}
                  >
                    Cricket
                  </li>
                  <li
                    className="px-10 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSport("Basketball")}
                  >
                    Basketball
                  </li>
                  {/* Add more sports as needed */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Displaying turfs */}
      <div className="flex justify-center bg-surface flex-col">
        <div className="lg:mx-20 mt-8">
          {turfs.length === 0 ? (
            <div className="p-32 text-5xl font-bold text-center mb-6">
              TURF NOT FOUND
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 justify-items-center">
              <div className="w-full col-span-1 pb-10 px-2 md:px-0">
                <div className="grid w-full grid-cols-1 gap-11 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {turfs
                    .filter((turf) => {
                      return search.toLowerCase() === ""
                        ? turf
                        : turf.turfName
                            .toLowerCase()
                            .includes(search.toLowerCase());
                    })
                    .map((turf) => (
                      <TurfCard
                        key={turf.turfId}
                        turfId={turf.turfId}
                        turfName={turf.turfName}
                        imageUrl={turf.imageUrl}
                        turfLocation={turf.turfLocation}
                        gameName={selectedSport}
                        games={turf.games}
                        rating={turf.rating}
                        noOfRating={turf.noOfRating}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FindTurf;
