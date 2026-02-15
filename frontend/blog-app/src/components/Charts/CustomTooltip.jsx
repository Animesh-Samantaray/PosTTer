import React, { useMemo } from "react";

// ---------------- FORMATTER ----------------
const formatValue = (value, type = "number") => {
  if (value == null) return "-";

  const num = Number(value);

  if (type === "currency") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  }

  if (type === "percent") {
    return `${(num * 100).toFixed(1)}%`;
  }

  return typeof value === "number"
    ? value.toLocaleString()
    : String(value);
};

// ---------------- COMPONENT ----------------
const CustomTooltip = ({
  active,
  payload,
  label,
  valueType = "number",
  showTotal = false,
  footer,
}) => {
  // ----- normalize rows -----
  const rows = useMemo(() => {
    if (!active || !Array.isArray(payload)) return [];
    return payload.filter((p) => p && p.value != null);
  }, [active, payload]);

  // ----- compute total -----
  const total = useMemo(() => {
    if (rows.length <= 1) return 0;
    return rows.reduce(
      (sum, r) => sum + (typeof r.value === "number" ? r.value : 0),
      0
    );
  }, [rows]);

  if (!active || rows.length === 0) return null;

  return (
    <div
      role="tooltip"
      className="
        backdrop-blur-md
        bg-white/95 dark:bg-gray-900/95
        border border-gray-200 dark:border-gray-700
        shadow-xl rounded-xl
        px-3 py-3
        min-w-[170px] max-w-[260px]
        transition-all duration-150
      "
    >
      {/* -------- header -------- */}
      {label && (
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 truncate">
          {label}
        </div>
      )}

      {/* -------- rows -------- */}
      <div className="space-y-2">
        {rows.map((item, idx) => (
          <div
            key={`${item.dataKey || item.name || "row"}-${idx}`}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* color dot */}
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color || "#888" }}
              />

              {/* label */}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {item.name}
              </span>
            </div>

            {/* value */}
            <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
              {formatValue(item.value, valueType)}
            </span>
          </div>
        ))}
      </div>

      {/* -------- total -------- */}
      {showTotal && rows.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <span className="text-xs font-semibold text-gray-500">
            Total
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {formatValue(total, valueType)}
          </span>
        </div>
      )}

      {/* -------- footer -------- */}
      {footer && (
        <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default React.memo(CustomTooltip);
