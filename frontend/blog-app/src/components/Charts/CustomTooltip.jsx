import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value, color } = payload[0];

  return (
    <div className="backdrop-blur-md bg-white/90 border border-gray-200 
                    shadow-xl rounded-xl px-3 py-2 min-w-[140px]
                    transition-all duration-200">

      {/* Title Row */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-xs font-semibold text-gray-800 tracking-wide">
          {name}
        </p>
      </div>

      {/* Value Row */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Count
        </span>

        <span className="text-sm font-bold text-gray-900">
          {value}
        </span>
      </div>
    </div>
  );
};

export default CustomTooltip;
