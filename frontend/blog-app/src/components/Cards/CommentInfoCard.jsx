import React, { useContext, useState } from "react";
import { LuChevronDown, LuDot, LuReply, LuTrash2 } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import moment from "moment";
import CommentReplyInput from "../Inputs/CommentReplyInput";

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
  refreshData,
}) => {
  const { user } = useContext(UserContext);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showSubReplies, setShowSubReplies] = useState(false);

  // FIX 1: restored the logic to actually send the reply to your API
  const handleAddReply = async () => {
    if (!replyText.trim()) return;

    // Safety check for the postId
    const postId = post?._id;
    if (!postId) {
      toast.error("Error: Associated post not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Correctly using your dynamic API path for adding comments
      await axiosInstance.post(API_PATHS.COMMENT.ADD(postId), {
        content: replyText,
        parentComment: commentId, // Links it as a reply
      });

      toast.success("Reply posted!");
      setReplyText("");
      setShowReplyForm(false);
      setShowSubReplies(true); // Open the thread so the user sees their new reply
      refreshData(); // Triggers a re-fetch in the parent Comments.jsx
    } catch (error) {
      toast.error("Failed to post reply");
      console.error("Reply Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div className={`flex flex-col w-full ${isSubReply ? "mt-2" : "mt-6"}`}>
      <div
        className={`bg-white border p-5 rounded-2xl transition-all ${
          isSubReply
            ? "ml-4 bg-slate-50/40 border-slate-100"
            : "shadow-sm hover:shadow-md border-slate-200/60"
        }`}
      >
        <div className="flex gap-4">
          <img
            src={authorPhoto || "https://via.placeholder.com/40"}
            alt={authorName}
            className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-bold text-slate-900">@{authorName}</h3>
                <LuDot className="text-slate-300" />
                <span className="text-xs text-slate-400 font-medium">
                  {moment(updatedOn).fromNow()}
                </span>
              </div>

              <button
                onClick={() => onDelete(commentId)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LuTrash2 size={16} />
              </button>
            </div>

            <p className="text-[14.5px] text-slate-600 leading-relaxed mb-4">{content}</p>

            <div className="flex items-center gap-5">
              {!isSubReply && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    showReplyForm ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                  }`}
                >
                  <LuReply size={15} /> Reply
                </button>
              )}

              {replies?.length > 0 && (
                <button
                  onClick={() => setShowSubReplies(!showSubReplies)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-all"
                >
                  {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                  <LuChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${showSubReplies ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {showReplyForm && (
          <CommentReplyInput
            user={user}
            authorName={authorName}
            content={content}
            replyText={replyText}
            setReplyText={setReplyText}
            handleAddReply={handleAddReply}
            handleCancelReply={handleCancelReply}
            isLoading={isSubmitting}
            post={post}
          />
        )}
      </div>

      {/* Post Context Bar */}
      {!isSubReply && post && (
        <div className="ml-16 mt-2 mb-6 flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200/50 rounded-xl hover:bg-blue-50/30 transition-all cursor-pointer group max-w-fit">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold overflow-hidden">
            {post.coverImageUrl ? <img src={post.coverImageUrl} className="object-cover w-full h-full" alt="post" /> : "POST"}
          </div>
          <div className="pr-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Thread Source</p>
            <h4 className="text-[12px] font-bold text-slate-700 truncate group-hover:text-blue-600">{post.title}</h4>
          </div>
        </div>
      )}

      {/* Recursive Nested Replies */}
      {showSubReplies && replies?.length > 0 && (
        <div className="ml-10 border-l-2 border-slate-100 space-y-2 mb-4 animate-in fade-in slide-in-from-left-3">
          {replies.map((reply) => (
            <CommentInfoCard
              key={reply._id}
              commentId={reply._id}
              authorName={reply.author?.name || "User"}
              authorPhoto={reply.author?.profileImageUrl}
              content={reply.content}
              updatedOn={reply.updatedAt}
              post={post}
              isSubReply={true}
              onDelete={onDelete}
              refreshData={refreshData}
              replies={reply.replies || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentInfoCard;