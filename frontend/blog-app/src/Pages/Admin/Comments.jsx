import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import CommentInfoCard from "../../components/Cards/CommentInfoCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DefaultUserIcon from "../../assets/user.png";
import toast from "react-hot-toast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

const getAllComments = async () => {
  try {
    setIsLoading(true);
    const response = await axiosInstance.get(API_PATHS.COMMENT.GET_ALL);
    
    // FIX: Remove the .filter() to stop hiding replies
    // This gives you the full array returned by your backend
    const allComments = response.data || []; 
    
    setComments(allComments);
  } catch (error) {
    toast.error("Failed to load comments.");
    console.error("Fetch error:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    getAllComments();
  }, []);

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Delete this comment and all its replies?")) return;
    
    try {
      await axiosInstance.delete(`${API_PATHS.COMMENT.DELETE(id)}`);
      toast.success("Comment deleted");
      getAllComments(); 
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <DashboardLayout activeMenu="Comments">
      <div className="max-w-[850px] mx-auto py-10 px-4">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Feedback
          </h2>
          <p className="text-slate-500 mt-2">
            Respond to readers and manage the conversation thread.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="flex flex-col">
            {comments.map((comment) => (
              <CommentInfoCard
                key={comment._id}
                commentId={comment._id}
                authorName={comment.author?.name || "User"}
                authorPhoto={comment.author?.profileImageUrl || DefaultUserIcon}
                content={comment.content}
                updatedOn={comment.updatedAt}
                post={comment.post}
                replies={comment.replies || []}
                onDelete={handleDeleteComment}
                refreshData={getAllComments}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-slate-500 font-medium">No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Comments;