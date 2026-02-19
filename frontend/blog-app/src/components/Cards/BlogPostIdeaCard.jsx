import React from "react";

const BlogPostIdeaCard = ({
  title,
  description,
  tags,
  tone,
  onSelect,
}) => {
  const tagList = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(",")
    : [];

  return (
    <div
      onClick={onSelect}
      className="border rounded-xl p-4 hover:shadow cursor-pointer"
    >
      <h3 className="font-semibold text-sm">
        {title}
        {tone && (
          <span className="ml-2 text-xs bg-indigo-100 px-2 py-1 rounded">
            {tone}
          </span>
        )}
      </h3>

      <p className="text-xs mt-2 text-slate-600">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {tagList.map((t, i) => (
          <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">
            #{t.trim()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogPostIdeaCard;
