import React, { useMemo } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

// ✅ Real multi-color categorical palette
const COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#A855F7", // purple
  "#F97316", // orange
  "#14B8A6", // teal
  "#E11D48", // rose
  "#84CC16", // lime
];

// ---------------- TAG CLOUD ----------------
// ---------------- TAG CLOUD ----------------
const TagCloud = ({ tags = [] }) => {
  if (!tags.length) return null;

  const maxCount = Math.max(...tags.map((t) => t.count || 0), 1);

  return (
    <div className="flex flex-wrap gap-2 bg-white">
      {tags.map((tag, i) => {
        const ratio = (tag.count || 0) / maxCount;
        const fontSize = 13 + ratio * 3;

        const bgColor = COLORS[i % COLORS.length];

        return (
          <span
            key={`${tag.name}-${i}`}
            className="
              px-3 py-1 rounded-full
              font-semibold
              shadow-sm border border-white/30
              hover:scale-105 hover:shadow-md
              transition-all duration-150
              cursor-default leading-none
              text-white
            "
            style={{
              fontSize: `${fontSize}px`,
              backgroundColor: bgColor,
            }}
          >
            #{tag.name}
          </span>
        );
      })}
    </div>
  );
};


// ---------------- MAIN ----------------
const TagInsights = ({ tagUsage = [] }) => {
  // ✅ memoized processing
  const processedData = useMemo(() => {
    if (!Array.isArray(tagUsage) || tagUsage.length === 0) return [];

    const sorted = [...tagUsage].sort((a, b) => b.count - a.count);

    const topFour = sorted.slice(0, 4);
    const others = sorted.slice(4);

    const othersCount = others.reduce(
      (sum, item) => sum + (item.count || 0),
      0
    );

    const finalData = topFour.map((item) => ({
      name: item.tag || "Unknown",
      count: item.count || 0,
    }));

    if (othersCount > 0) {
      finalData.push({
        name: "Others",
        count: othersCount,
      });
    }

    return finalData;
  }, [tagUsage]);

  if (!processedData.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-gray-500">
        No tag insights available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 mt-4 md:mt-8 bg-white">
      {/* LEFT — PIE */}
      <div className="col-span-12 md:col-span-7">
        <CustomPieChart data={processedData} colors={COLORS} />
      </div>

      {/* RIGHT — TAG CLOUD */}
      <div className="col-span-12 md:col-span-5 md:mt-auto">
        <TagCloud
          tags={tagUsage.slice(0, 15).map((item) => ({
            name: item.tag || "",
            count: item.count || 0,
          }))}
        />
      </div>
    </div>
  );
};

export default TagInsights;
