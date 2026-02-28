import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import CommentInfoCard from "../../components/Cards/CommentInfoCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";
const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  const getAllComments = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.COMMENT.GET_ALL);
      setComments(response.data?.length>0 ? response.data : []);
    } catch (error) {
      console.error(`error is ${error}`)
    }
  };
  useEffect(() => {
    getAllComments();
    return () => {};
  }, []);
  const deleteComment = async () => {};
  return (
    <DashboardLayout activeMenu="Comments">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <h2 className="text-2xl font-semibold mt-5 mb-5">Comments</h2>

{comments.map((comment) => (
  <CommentInfoCard
    key={comment._id}
    commentId={comment._id || null}
    // FIX: Use optional chaining (?.) and a fallback string
    authorName={comment.author?.name || "Unknown User"} 
    
    // FIX: Handle potential null for profile image as well
    authorPhoto={comment.author?.profileImageUrl || null} 
    
    content={comment.content}
    updatedOn={
      comment.updatedAt
        ? moment(comment.updatedAt).format("Do MMM YYYY")
        : "-"
    }
    post={comment.post}
    replies={comment.replies || []}
    getAllComments={getAllComments}
    onDelete={(commentId) =>
      setOpenDeleteAlert({
        open: true,
        data: commentId || comment._id,
      })
    }
  />
))}
      </div>
    </DashboardLayout>
  );
};

export default Comments;
