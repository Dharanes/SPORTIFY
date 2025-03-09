import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingRequests,
  getTurfs,
} from "../../ReduxToolKit/TurfRegistrationSlice";
import TabNavigation from "./TabNavigation";
import ProfileHeader from "./ProfileHeader";
import {GrFormNext, GrFormPrevious} from "react-icons/gr"

function OwnerProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const ownerTurfs = useSelector((state) => state.turf.ownersTurfs);
  const pendingRequests = useSelector((state) => state.turf.pendingTurfs);

  const arr = ["Owned Turfs", "Pending Requests"];

  useEffect(() => {
    dispatch(getTurfs());
  }, [location.state, dispatch]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (activeTab === 0) {
        await dispatch(getTurfs());
      } else if (activeTab === 1) {
        await dispatch(getPendingRequests());
      }
      setLoading(false);
    };
    fetchData();
  }, [activeTab, dispatch]);

  const handleAddTurf = () => {
    navigate("/add-turf");
  };

  const renderEmptyMessage = (message) => (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (dataLength) => {
    const totalPages = Math.ceil(dataLength / itemsPerPage);
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-center mt-4 gap-4 items-center">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <GrFormPrevious />
        </button>
        <span
          className="text-sm text-gray-700 font-medium"
          style={{ minWidth: "120px", textAlign: "center" }}
        >
          {`Page ${currentPage} of ${totalPages}`}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <GrFormNext />
        </button>
      </div>
    );
  };
  

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Profile Header and Add Turf Button */}
            <div className="flex justify-between items-center mb-6">
              <ProfileHeader />
              <button
                onClick={handleAddTurf}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded shadow"
              >
                Add Turf
              </button>
            </div>

            {/* Tab Navigation */}
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              arr={arr}
            />

            {/* Tab Content */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Loading...</p>
              </div>
            ) : activeTab === 0 ? (
              ownerTurfs && ownerTurfs.length > 0 ? (
                <>
                  {paginate(ownerTurfs).map((turf) => (
                    <div
                      key={`${turf.id}_${turf.turfName}`}
                      className="flex w-full max-w-[960px] items-center gap-4 p-4 bg-white rounded shadow cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:scale-105 "
                      onClick={() => navigate("/turf-data", { state: { turf } })}
                      role="button"
                      aria-label={`View details for ${turf.turfName}`}
                    >
                      <div
                        className="w-14 h-14 bg-cover bg-center rounded-lg"
                        style={{
                          backgroundImage: turf.imageUrl
                            ? `url(data:image/png;base64,${turf.imageUrl})`
                            : "url('/path/to/placeholder-image.png')",
                        }}
                        aria-label="Turf Image"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {turf.turfName.toUpperCase()}
                        </h3>
                        <h4 className="text-sm text-gray-600">
                          {turf.turfLocation.toUpperCase()}
                        </h4>
                      </div>
                    </div>
                  ))}
                  {renderPagination(ownerTurfs.length)}
                </>
              ) : (
                renderEmptyMessage("No turfs available at the moment.")
              )
            ) : pendingRequests && pendingRequests.length > 0 ? (
              <>
                {paginate(pendingRequests).map((request) => (
                  <div
                    key={request.turfId}
                    className="flex w-full max-w-[960px] items-center gap-4 p-4 bg-white rounded shadow mb-4"
                  >
                    <div
                      className="w-14 h-14 bg-cover bg-center rounded-lg"
                      style={{
                        backgroundImage: request.imageUrl
                          ? `url(data:image/png;base64,${request.imageUrl})`
                          : "url('/path/to/placeholder-image.png')",
                      }}
                      aria-label={`${request.turfName} Image`}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.turfName.toUpperCase()}
                      </h3>
                      <h4 className="text-sm text-gray-600">
                        {request.turfLocation.toUpperCase()}
                      </h4>
                    </div>
                    <div className="ml-auto text-yellow-500 font-bold px-4 py-2">
                      PENDING
                    </div>
                  </div>
                ))}
                {renderPagination(pendingRequests.length)}
              </>
            ) : (
              renderEmptyMessage("No pending requests at the moment.")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerProfile;
