import React from "react";
import moment from "moment";
import { LuDot } from "react-icons/lu";

const RecentComentsList = ({ comments = [] }) => {
  if (!comments.length) {
    return (
      <div className="mt-6 text-sm text-gray-500 text-center">
        No recent comments
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ul className="space-y-4">
        {comments.slice(0, 10).map((comment) => {
          const avatar =
            comment.author?.profileImageUrl ||
            `https://ui-avatars.com/api/?name=${comment.author?.name || "U"}&background=e5e7eb&color=374151`;

          return (
            <li
              key={comment._id}
              className="
                group flex gap-4 p-4
                rounded-xl border border-gray-200
                bg-white
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
              "
              
            >
              {/* Avatar */}
              <img
                src={avatar}
                alt={comment.author?.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Top Row */}
                <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 font-medium">
                  <span className="text-gray-900 font-semibold" >
                    @{comment.author?.name}
                  </span>

                  <LuDot className="text-gray-400" />

                  <span>
                    {moment(comment.updatedAt).fromNow()}
                  </span>

                  <LuDot className="text-gray-400" />

                  <span>
                    {moment(comment.updatedAt).format("DD MMM YYYY")}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="
                  text-sm text-gray-800 mt-1.5
                  leading-relaxed line-clamp-3
                  group-hover:text-gray-900
                ">
                  {comment.content}
                </p>

                {/* Post Ref */}
                <div className="
                  mt-3 flex items-center gap-3
                  bg-gray-50 rounded-lg p-2
                  border border-gray-100
                ">
                  <img
                    src={comment.post?.coverImageUrl}
                    alt={comment.post?.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />

                  <p className="
                    text-[13px] font-medium text-gray-700
                    line-clamp-2
                  ">
                    {comment.post?.title}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentComentsList;
