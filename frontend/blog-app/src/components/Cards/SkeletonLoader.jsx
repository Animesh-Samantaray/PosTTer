import React from "react";

const SkeletonItem = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">

    {/* TITLE */}
    <div className="h-4 w-3/4 bg-slate-200 rounded mb-3"></div>

    {/* DESCRIPTION */}
    <div className="space-y-2 mb-4">
      <div className="h-3 w-full bg-slate-200 rounded"></div>
      <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
      <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
    </div>

    {/* TAG ROW */}
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-slate-200 rounded-lg"></div>
      <div className="h-6 w-20 bg-slate-200 rounded-lg"></div>
      <div className="h-6 w-14 bg-slate-200 rounded-lg"></div>
    </div>

    {/* BUTTON */}
    <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
  </div>
);

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
