import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = [
  "#0096cc",
  "#00a9e6",
  "#00bcff",
  "#1ac3ff",
  "#33c9ff",
  "#4dd0ff",
  "#66d7ff",
];



const TagCloud = ({ tags = [] }) => {
  if (!tags.length) return null;

  const maxCount = Math.max(...tags.map(t => t.count), 1);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const ratio = tag.count / maxCount;

        // small controlled size variation
        const fontSize = 13 + ratio * 3; // 13–16px only

        return (
          <span
            key={tag.name}
            className="
              px-3 py-1
              rounded-full
              bg-sky-100
              text-sky-800
              font-medium
              border border-sky-200
              hover:bg-sky-200
              transition
              cursor-default
              leading-none
            "
            style={{ fontSize: `${fontSize}px` }}
          >
            #{tag.name}
          </span>
        );
      })}
    </div>
  );
};


const TagInsights = ({ tagUsage }) => {
  const processedData = (() => {
    if (!tagUsage?.length) return [];

    const sorted = [...tagUsage].sort((a, b) => b.count - a.count);

    const topFour = sorted.slice(0, 4);
    const others = sorted.slice(4);

    const othersCount = others.reduce((sum, item) => sum + item.count, 0);

    const finalData = topFour.map((item) => ({
      name: item.tag || "",
      count: item.count,
    }));

    if (othersCount > 0) {
      finalData.push({
        name: "Others",
        count: othersCount,
      });
    }

    return finalData;
  })();

  return (
    <div className="grid grid-cols-12  mt-4 md:mt-8">
      {/* LEFT — PIE */}
      <div className="col-span-12 md:col-span-7 ">
        <CustomPieChart data={processedData} colors={COLORS} />
      </div>

      <div className="col-span-12 md:col-span-5 md:mt-auto">
        <TagCloud
          tags={tagUsage.slice(0, 15).map((item) => ({
            name: item.tag || "",
            count: item.count,
          }))}
        />
      </div>
    </div>
  );
};

export default TagInsights;
