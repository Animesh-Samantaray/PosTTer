import React from "react";
import { LuEye, LuHeart, LuTrash2 } from "react-icons/lu";

const TAG_COLORS = [
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-cyan-50 text-cyan-700 border-cyan-200",
  "bg-purple-50 text-purple-700 border-purple-200",
];

const BlogPostSummaryCard = ({
  title,
  imgUrl,
  updatedOn,
  tags = [],
  likes = 0,
  views = 0,
  onClick,
  onDelete,
}) => {
  return (
    <article
      onClick={onClick}
      className="
        group flex gap-4
        bg-white p-3 md:p-4 mb-4
        rounded-xl border border-gray-200
        hover:border-gray-300 hover:shadow-md
        transition-all duration-200
        cursor-pointer
      "
      role="button"
      tabIndex={0}
    >
      {/* IMAGE */}
      <img
        src={imgUrl || "/placeholder.png"}
        alt={title}
        loading="lazy"
        className="
          w-16 h-16 md:w-20 md:h-20
          rounded-lg object-cover
          border border-gray-200
          flex-shrink-0
        "
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
        }}
      />

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* TITLE */}
        <h3 className="
          text-sm md:text-base font-semibold text-gray-900
          line-clamp-2
        ">
          {title}
        </h3>

        {/* META ROW */}
        <div className="flex flex-wrap items-center gap-2 mt-2">

          <span className="
            text-[11px] font-medium
            bg-gray-100 text-gray-700
            px-2 py-1 rounded-md
          ">
            Updated: {updatedOn}
          </span>

          {/* STATS */}
          <div className="flex items-center gap-2">
            <span className="
              flex items-center gap-1
              text-xs font-medium
              bg-sky-50 text-sky-700
              px-2 py-1 rounded-md
            ">
              <LuEye className="text-sm" />
              {views.toLocaleString()}
            </span>

            <span className="
              flex items-center gap-1
              text-xs font-medium
              bg-pink-50 text-pink-700
              px-2 py-1 rounded-md
            ">
              <LuHeart className="text-sm" />
              {likes.toLocaleString()}
            </span>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.slice(0, 6).map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className={`
                text-[11px] font-medium px-2 py-1
                rounded-md border
                ${TAG_COLORS[i % TAG_COLORS.length]}
              `}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* DELETE */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="
          self-start
          opacity-0 group-hover:opacity-100
          hidden md:flex items-center gap-2
          text-xs font-medium
          text-rose-600 bg-rose-50
          px-3 py-1.5 rounded-lg
          border border-rose-200
          hover:bg-rose-100
          transition
        "
        aria-label="Delete post"
      >
        <LuTrash2 />
        Delete
      </button>
    </article>
  );
};

export default React.memo(BlogPostSummaryCard);
