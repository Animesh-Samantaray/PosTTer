import React, { useEffect, useState } from 'react' // Fixed: Added missing imports
import BlogLayout from '../../components/Layouts/BlogLayout/BlogLayout'
import BlogPostSummaryCard from '../../components/Cards/BlogPostSummaryCard'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { LuHash, LuArrowLeft, LuLoaderCircle, LuInbox } from 'react-icons/lu'
import toast from 'react-hot-toast'

const PostByTags = () => {
  const { tagName } = useParams();
  const navigate = useNavigate();
  
  const [blogPostList, setBlogPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPostByTag = async () => {
    try {
      setIsLoading(true);
      // Using the functional API path from your config
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_BY_TAG(tagName));
      
      if (response.data) {
        setBlogPostList(response.data);
      }
    } catch (error) {
      console.error("Tag Fetch Error:", error);
      toast.error("Failed to load posts for this tag.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostByTag();
  }, [tagName]); // Added tagName as dependency

  return (
    <BlogLayout>
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        <div className="max-w-[1240px] mx-auto px-6 pt-12">
          
          {/* --- Header Section --- */}
          <div className="mb-12">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-8 transition-all"
            >
              <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)]">
                <LuHash size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Topic Explorer</p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight capitalize">
                  {tagName}
                </h1>
              </div>
            </div>
            
            <div className="h-1 w-full bg-slate-200/50 mt-10 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 w-24" />
            </div>
          </div>

          {/* --- Content Grid --- */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <LuLoaderCircle className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Searching Archives...</p>
            </div>
          ) : blogPostList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPostList.map((post) => (
                <div 
                  key={post._id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300"
                >
                  <BlogPostSummaryCard
                    title={post.title}
                    content={post.content}
                    coverImageUrl={post.coverImageUrl}
                    author={post.author}
                    date={post.createdAt}
                    slug={post.slug}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* --- Empty State --- */
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <LuInbox size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No Stories Found</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                We couldn't find any published articles tagged with <span className="text-blue-600 font-bold">#{tagName}</span> yet.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="text-[11px] font-black bg-slate-900 text-white px-8 py-3.5 rounded-full hover:bg-blue-600 transition-all tracking-widest"
              >
                RETURN TO HOME
              </button>
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  )
}

export default PostByTags