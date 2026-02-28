import React, { useContext, useState } from "react";
import { LuChevronDown, LuDot, LuReply, LuTrash2, LuSend, LuX } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import moment from "moment";

const CommentInfoCard = ({
  commentId,
  authorName,
  authorPhoto,
  content,
  updatedOn,
  post,
  replies,
  onDelete,
  isSubReply,
}) => {
  const { user } = useContext(UserContext);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showSubReplies, setShowSubReplies] = useState(false);

  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Main Comment Card */}
      <div
        className={`bg-white border border-slate-100 p-4 rounded-xl shadow-sm transition-all hover:shadow-md group ${
          isSubReply ? "mb-2 ml-2" : "mb-4"
        }`}
      >
        <div className="flex gap-3">
          {/* Author Avatar */}
          <img
            src={authorPhoto || "https://via.placeholder.com/40"}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />

          <div className="flex-1">
            {/* Header Info */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-slate-800 hover:underline cursor-pointer">
                  @{authorName}
                </h3>
                <LuDot className="text-slate-400" />
                <span className="text-xs text-slate-500">
                  {moment(updatedOn).fromNow()}
                </span>
              </div>
              
              {/* Delete Button (Visible on Hover) */}
              <button
                onClick={() => onDelete(commentId)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Delete comment"
              >
                <LuTrash2 size={16} />
              </button>
            </div>

            {/* Comment Content */}
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              {content}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {!isSubReply && (
                <>
                  <button
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      showReplyForm ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                    }`}
                    onClick={() => setShowReplyForm((prev) => !prev)}
                  >
                    <LuReply size={14} />
                    Reply
                  </button>

                  {replies?.length > 0 && (
                    <button
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                      onClick={() => setShowSubReplies((prev) => !prev)}
                    >
                      {replies.length} {replies.length === 1 ? "reply" : "replies"}
                      <LuChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          showSubReplies ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reply Input Form */}
        {showReplyForm && (
          <div className="mt-4 pt-4 border-t border-slate-50 flex gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex-1 relative">
              <textarea
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Write a reply..."
                rows="2"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelReply}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!replyText.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                >
                  <LuSend size={12} />
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Attachment Preview (Main comment only) */}
      {!isSubReply && post && (
        <div className="ml-12 mb-6 flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group/post">
          <img
            src={post?.coverImageUrl}
            alt=""
            className="w-12 h-12 rounded object-cover shadow-sm"
          />
          <div className="flex-1 overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Replying to post</span>
            <h4 className="text-sm font-medium text-slate-700 truncate group-hover/post:text-blue-600 transition-colors">
              {post?.title}
            </h4>
          </div>
        </div>
      )}

      {/* Nested Replies Rendering */}
      {showSubReplies && replies?.length > 0 && (
        <div className="ml-6 border-l-2 border-slate-100 pl-4 space-y-2 animate-in fade-in slide-in-from-left-2">
          {replies.map((reply, index) => (
            <CommentInfoCard
              key={reply._id}
              commentId={reply._id}
              authorName={reply.author?.name || "Anonymous"}
              authorPhoto={reply.author?.profileImageUrl}
              content={reply.content}
              updatedOn={reply.updatedAt}
              isSubReply
              onDelete={() => onDelete(reply._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentInfoCard;