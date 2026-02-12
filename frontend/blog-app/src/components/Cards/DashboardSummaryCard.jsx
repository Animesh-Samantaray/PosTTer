import React, { memo } from "react";

const DashboardSummaryCard = ({
  icon,
  label,
  value,
  bgColor = "bg-gray-100",
  color = "text-gray-700",
}) => {
  return (
    <div className="flex items-center gap-3">

      {/* Icon */}
      <div
        className={`
          w-10 h-10
          flex items-center justify-center
          rounded-lg
          ${bgColor} ${color}
        `}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="leading-tight">
        <p className="text-sm font-semibold text-gray-900">
          {value}
        </p>

        <p className="text-xs text-gray-500">
          {label}
        </p>
      </div>

    </div>
  );
};

export default memo(DashboardSummaryCard);
