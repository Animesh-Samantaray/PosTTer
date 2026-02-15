import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex overflow-x-auto no-scrollbar gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`
                relative flex items-center gap-2
                px-4 py-2
                text-sm font-medium
                whitespace-nowrap
                transition
                rounded-t-md
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }
              `}
            >
              <span>{tab.label}</span>

              {typeof tab.count !== "undefined" && (
                <span
                  className={`
                    text-xs font-semibold
                    px-2 py-0.5 rounded-full
                    ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}

              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
