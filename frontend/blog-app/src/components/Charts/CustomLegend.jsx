import React from "react";

const CustomLegend = ({
  payload = [],
  onItemClick,
  hiddenMap = {},
  showValue = false,
}) => {
  if (!Array.isArray(payload) || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
      {payload.map((entry, index) => {
        const isHidden = hiddenMap?.[entry.value];

        return (
          <button
            key={`legend-${entry.value}-${index}`}
            type="button"
            onClick={() => onItemClick?.(entry)}
            className={`
              flex items-center gap-2
              text-xs font-medium
              transition-opacity duration-150
              ${isHidden ? "opacity-40" : "opacity-100"}
              hover:opacity-80
            `}
          >
            {/* color dot */}
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />

            {/* label */}
            <span className="text-gray-700 truncate max-w-[120px]">
              {entry.value}
            </span>

            {/* optional value */}
            {showValue && entry.payload?.count != null && (
              <span className="text-gray-400 tabular-nums">
                ({entry.payload.count.toLocaleString()})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(CustomLegend);
