import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/Layouts/BlogLayout/BlogLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { 
  LuLoaderCircle, 
  LuGalleryVerticalEnd, 
  LuClock, 
  LuArrowRight 
} from "react-icons/lu";
import moment from "moment";

const BlogLandingPage = () => {
  const navigate = useNavigate();
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: { status: "published", page: pageNumber, limit: 10 },
      });

      const { posts, totalPages: total } = response.data;
      setBlogPostList(prev => (pageNumber === 1 ? posts : [...prev, ...posts]));
      setTotalPages(total);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) getAllPosts(page + 1);
  };

  const featuredPost = blogPostList[0];
  const sidebarPosts = blogPostList.slice(1, 6);
  const gridPosts = blogPostList.slice(1);

  return (
    <BlogLayout>
      {/* Tight UI: Using a cool-gray background for maximum card contrast */}
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-[1240px] mx-auto px-6 py-12">
          <div className="grid grid-cols-12 gap-8">
            
            {/* --- MAIN FEED (9 Columns) --- */}
            <div className="col-span-12 lg:col-span-9">
              
              {/* HERO CARD: Ultra-tight focus with a heavy bottom shadow */}
              {featuredPost && (
                <div 
                  onClick={() => navigate(`/${featuredPost.slug}`)}
                  className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer group mb-12"
                >
                  <div className="md:w-[45%] h-64 md:h-[380px] overflow-hidden">
                    <img 
                      src={featuredPost.coverImageUrl} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt="" 
                    />
                  </div>
                  <div className="md:w-[55%] p-8 md:p-12 flex flex-col">
                    <div className="flex gap-3 mb-4">
                      {featuredPost.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="text-blue-600 text-[11px] font-black uppercase tracking-[0.2em]">
                          Featured • {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-[1.2] mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h1>
                    <p className="text-slate-500 text-[13px] leading-relaxed mb-8 line-clamp-3">
                      {featuredPost.summary}
                    </p>

                    <div className="flex items-center gap-3 mt-auto border-t border-slate-50 pt-6">
                      <img src={featuredPost.author?.profileImageUrl} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" alt="" />
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 leading-none mb-1">{featuredPost.author?.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{moment(featuredPost.createdAt).format("MMM DD, YYYY")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GRID: Compact cards with subtle borders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {gridPosts.map((post) => (
                  <div 
                    key={post._id}
                    onClick={() => navigate(`/${post.slug}`)}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="h-52 overflow-hidden border-b border-slate-100">
                      <img src={post.coverImageUrl} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" alt="" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-blue-600 line-clamp-2 leading-snug tracking-tight">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                          <LuClock size={12} className="text-blue-500" /> {moment(post.createdAt).fromNow()}
                        </span>
                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-3 transition-all">
                          View <LuArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {page < totalPages && (
                <div className="flex items-center justify-center mt-16">
                  <button
                    className="flex items-center gap-3 text-[11px] text-white font-black bg-slate-900 px-10 py-4 rounded-full hover:bg-blue-600 shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 tracking-[0.2em]"
                    disabled={isLoading}
                    onClick={handleLoadMore}
                  >
                    {isLoading ? <LuLoaderCircle className="animate-spin" /> : <LuGalleryVerticalEnd />}
                    {isLoading ? "FETCHING..." : "LOAD MORE STORIES"}
                  </button>
                </div>
              )}
            </div>

            {/* --- SIDEBAR --- */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-12">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-200 pb-2">
                  Top Stories
                </h2>
                <div className="space-y-8">
                  {sidebarPosts.map(post => (
                    <div 
                      key={post._id} 
                      onClick={() => navigate(`/${post.slug}`)}
                      className="flex gap-4 group cursor-pointer"
                    >
                      <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img src={post.coverImageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-black text-blue-500 uppercase mb-1 tracking-tighter opacity-80">
                          {post.tags?.[0] || "Blog"}
                        </span>
                        <h4 className="text-[12px] font-bold text-slate-700 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;