import React, { useState } from "react";
import { LuSend, LuX, LuSparkles } from "react-icons/lu";
import DefaultUserIcon from '../../assets/user.png';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const CommentReplyInput = ({
  user,
  authorName,
  content, 
  replyText,
  setReplyText,
  handleAddReply,
  handleCancelReply,
  isLoading, // Prop passed from CommentInfoCard
  post, // Add post prop
}) => {
  const [aiLoading, setAiLoading] = useState(false);

const generateReply = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    try {
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_COMMENT_REPLY, {
        author: { name: authorName },
        content,
      });
      
      // DEBUG: Look at your browser console to see the exact structure
      console.log("AI API Response:", aiResponse.data);

      // FIX: Check if the data is a string or an object with a property
      // If your API returns { reply: "..." }, use aiResponse.data.reply
      const generatedReply = typeof aiResponse.data === 'string' 
        ? aiResponse.data 
        : aiResponse.data.reply || aiResponse.data.content; 

      if (generatedReply && generatedReply.length > 0) {
        setReplyText(generatedReply);
      } else {
        console.warn("AI returned an empty or unrecognized format");
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* User Avatar */}
      <img
        src={user?.profileImageUrl || DefaultUserIcon}
        alt={user?.name || "User"}
        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
      />

      <div className="flex-1">
        <div className="relative group">
          {/* MANUAL TEXTAREA: Styled to match your Input.jsx exactly 
              (border-gray-300, rounded-lg, focus:border-black)
          */}
          <div className="w-full border border-gray-300 rounded-lg bg-white transition focus-within:border-black focus-within:ring-1 focus-within:ring-black/20">
            <textarea
              autoFocus
              rows="4"
              disabled={isLoading || aiLoading}
              className="w-full bg-transparent outline-none p-3 text-sm placeholder:text-gray-400 resize-none pr-24"
              placeholder={`Replying to @${authorName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
          
          {/* AI Magic Button inside the textarea area */}
          <button
            type="button"
            onClick={generateReply}
            disabled={aiLoading || isLoading}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {aiLoading ? (
               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LuSparkles size={12} />
            )}
            {aiLoading ? "Thinking..." : "AI Reply"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-3 mt-3">
          <button
            type="button"
            onClick={handleCancelReply}
            disabled={isLoading || aiLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50"
          >
            <LuX size={14} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddReply}
            disabled={!replyText?.trim() || isLoading || aiLoading}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            {isLoading ? (
               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LuSend size={14} />
            )}
            {isLoading ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentReplyInput;