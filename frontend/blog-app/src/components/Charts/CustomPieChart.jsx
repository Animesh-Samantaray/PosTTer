import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";

const RADIAN = Math.PI / 180;

// ---------- percent label ----------
const renderPercentLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.06) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-white text-[11px] font-semibold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

// ---------- dynamic color generator ----------
const generateColors = (n) =>
  Array.from({ length: n }, (_, i) =>
    `hsl(${Math.round((360 / n) * i)}, 70%, 55%)`
  );

// ---------- component ----------
const CustomPieChart = ({
  data = [],
  colors = [],
  height = 280,
  innerRadius = 65,
  outerRadius = 95,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hidden, setHidden] = useState({});

  // strong categorical palette (not shade-based)
  const defaultPalette = [
    "#4F46E5", // indigo
    "#16A34A", // green
    "#F59E0B", // amber
    "#DC2626", // red
    "#0891B2", // cyan
    "#7C3AED", // violet
    "#DB2777", // pink
    "#65A30D", // lime
    "#EA580C", // orange
    "#0D9488", // teal
    "#1D4ED8", // blue
    "#9333EA", // purple
  ];

  const safeColors =
    colors.length > 0
      ? colors
      : data.length <= defaultPalette.length
      ? defaultPalette
      : generateColors(data.length);

  const filteredData = useMemo(
    () => data.filter((d) => !hidden[d.name]),
    [data, hidden]
  );

  const total = useMemo(
    () => filteredData.reduce((s, d) => s + (Number(d.count) || 0), 0),
    [filteredData]
  );

  if (!data.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-gray-500">
        No data available
      </div>
    );
  }

  const handleLegendClick = (entry) => {
    setHidden((prev) => ({
      ...prev,
      [entry.value]: !prev[entry.value],
    }));
  };

  return (
    <div className="w-full h-full p-2">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={filteredData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="44%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            cornerRadius={6}
            labelLine={false}
            label={renderPercentLabel}
            activeIndex={activeIndex}
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={safeColors[index % safeColors.length]}
                stroke="#ffffff"
                strokeWidth={activeIndex === index ? 3 : 1}
                opacity={
                  activeIndex === null || activeIndex === index ? 1 : 0.7
                }
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="bottom"
            align="center"
            content={
              <CustomLegend
                onItemClick={handleLegendClick}
                hiddenMap={hidden}
                showValue
              />
            }
          />

          {/* center total */}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-900 text-sm font-bold"
          >
            {total.toLocaleString()}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
