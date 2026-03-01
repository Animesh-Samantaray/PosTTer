import React, { useState } from 'react'
import BlogLayout from '../../components/Layouts/BlogLayout/BlogLayout' 
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useNavigate, useSearchParams } from "react-router-dom";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";
import moment from "moment";

const SearchPosts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });
      if (response.data) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error
    }
  }

  useEffect(() => {
    handleSearch();
  }, [query]);
  return (
    <BlogLayout>        
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <div className="max-w-4xl mx-auto px-6 py-6">
                <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                    Search Results for "{query}"
                </h1>
            </div>
            <div className="max-w-4xl mx-auto px-6 py-6">
                {searchResults.map((post) => (
                    <BlogPostSummaryCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    </BlogLayout>
  )
}

export default SearchPosts