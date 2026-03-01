import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import CommentInfoCard from "../../components/Cards/CommentInfoCard";
import CommentReplyInput from "../../components/Inputs/CommentReplyInput";
import DefaultUserIcon from "../../assets/user.png";
import { LuMessageSquare, LuArrowLeft, LuSparkles } from "react-icons/lu";
import { Link } from "react-router-dom";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogPostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Fetch blog post and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        
        // Fetch blog post
        const postResponse = await axiosInstance.get(API_PATHS.POSTS.GET_BY_SLUG(slug));
        const postData = postResponse.data;
        setPost(postData);

        // Fetch comments for this post
        const commentsResponse = await axiosInstance.get(API_PATHS.COMMENT.GET_ALL_BY_POST(postData._id));
        setComments(commentsResponse.data);

        // Increment views
        await axiosInstance.post(API_PATHS.POSTS.INCREMENT_VIEW(postData._id));
      } catch (error) {
        toast.error("Failed to load blog post");
        console.error("Error fetching post:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostAndComments();
    }
  }, [slug, navigate]);

  // Update browser tab title
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | BlogPilot`;
    }
  }, [post]);

  // Handle adding a new top-level comment
  const handleAddComment = async () => {
    if (!commentText.trim() || !user) {
      if (!user) {
        toast.error("Please login to comment");
      }
      return;
    }

    setIsSubmittingComment(true);
    try {
      await axiosInstance.post(API_PATHS.COMMENT.ADD(post._id), {
        content: commentText,
        parentComment: null, // Top-level comment
      });

      toast.success("Comment posted!");
      setCommentText("");
      
      // Refresh comments
      const commentsResponse = await axiosInstance.get(API_PATHS.COMMENT.GET_ALL_BY_POST(post._id));
      setComments(commentsResponse.data);
    } catch (error) {
      toast.error("Failed to post comment");
      console.error("Comment error:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Generate AI summary
  const generateSummary = async () => {
    if (!post?.content) return;
    setIsSummarizing(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_POST_SUMMARY, {
        content: post.content,
      });
      
      // Handle different response formats from AI API
      const summary = typeof response.data === 'string' 
        ? response.data 
        : response.data.summary || response.data.content || response.data.title || 'Summary generated';
      
      setSummaryContent(summary);
      toast.success("AI Summary Generated!");
    } catch (error) {
      toast.error("AI Analysis failed.");
      console.error("Summary error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`${API_PATHS.COMMENT.DELETE}/${commentId}`);
      toast.success("Comment deleted");
      
      // Refresh comments
      const commentsResponse = await axiosInstance.get(API_PATHS.COMMENT.GET_ALL_BY_POST(post._id));
      setComments(commentsResponse.data);
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Delete error:", error);
    }
  };

  // Refresh data after reply operations
  const refreshComments = async () => {
    try {
      const commentsResponse = await axiosInstance.get(API_PATHS.COMMENT.GET_ALL_BY_POST(post._id));
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error refreshing comments:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <LuArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Blog Post Content */}
      <article className="max-w-4xl mx-auto px-6 pb-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-slate-600 mb-8">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.profileImageUrl || DefaultUserIcon}
                alt={post.author?.name || "Author"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-slate-900">{post.author?.name || "Anonymous"}</p>
                <p>{moment(post.createdAt).format("MMMM D, YYYY")}</p>
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          )}
        </header>

        {/* AI Summary Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <LuSparkles className="text-blue-600 animate-pulse" /> AI Perspective
            </h3>
            <button
              onClick={generateSummary}
              disabled={isSummarizing || summaryContent}
              className="text-xs font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 transition-all disabled:opacity-30 tracking-wider"
            >
              {isSummarizing ? "ANALYZING..." : summaryContent ? "SUMMARY GENERATED" : "SUMMARIZE ARTICLE"}
            </button>
          </div>
          
          <div className={`transition-all duration-700 ${summaryContent ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}>
            <p className="text-slate-600 text-sm leading-relaxed font-medium border-l-4 border-blue-500 pl-8 py-2">
              {summaryContent}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Comments Section */}
        <section className="border-t border-slate-200 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <LuMessageSquare className="text-slate-600" size={20} />
            <h2 className="text-2xl font-bold text-slate-900">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment Form */}
          {user ? (
            <div className="mb-12">
              <div className="flex gap-4">
                <img
                  src={user.profileImageUrl || DefaultUserIcon}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-12 p-6 bg-slate-100 rounded-lg text-center">
              <p className="text-slate-600">
                Please <Link to="/admin-login" className="text-blue-600 hover:text-blue-700 font-medium">login</Link> to join the conversation.
              </p>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentInfoCard
                  key={comment._id}
                  commentId={comment._id}
                  authorName={comment.author?.name || "User"}
                  authorPhoto={comment.author?.profileImageUrl}
                  content={comment.content}
                  updatedOn={comment.updatedAt}
                  post={post}
                  replies={comment.replies || []}
                  onDelete={handleDeleteComment}
                  refreshData={refreshComments}
                  isSubReply={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-slate-500 font-medium">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </section>
      </article>
    </div>
  );
};

export default BlogPostView;