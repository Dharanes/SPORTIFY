import React from "react";

const TabNavigation = ({ activeTab, setActiveTab, arr }) => (
  <div className="pb-3">
    <div className="flex border-b border-[#dce5e1] px-4 gap-8">
      {arr.map(
        (tab, index) => (
          <button
            key={tab}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
              activeTab === index
                ? "border-b-[#111715] text-[#111715]"
                : "border-b-transparent text-[#648778]"
            } text-sm font-bold leading-normal tracking-[0.015em]`}
            onClick={() => setActiveTab(index)}
          >
            <p>{tab}</p>
          </button>
        )
      )}
    </div>
  </div>
);

export default TabNavigation;
