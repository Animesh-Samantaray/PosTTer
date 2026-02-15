import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../components/Modal";
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/Tabs";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";
const BlogPosts = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const getAllPosts = async (pageNumber = 1) => {

    try {
      setIsLoading(true);
      const response = await  axiosInstance.get(API_PATHS.POSTS.GET_ALL , {
        params:{
          status:filterStatus.toLowerCase(),
          page:pageNumber
        },
      });

      const {posts , totalPages , counts} = response.data;
console.log(posts)
      setBlogPostList((prevPosts)=>pageNumber===1 ? posts:[...prevPosts , ...posts]);

      setTotalPages(totalPages);
      setPage(pageNumber);

      const statusSummary= counts || {}

      const statusArray=[
        {label:'All',count:statusSummary.all||0},
        {label:'Published',count:statusSummary.published||0},
        {label:'Draft',count:statusSummary.draft || 0}

      ]
      setTabs(statusArray);

    } catch (error) {
      console.log('Err fetching data : ',error.message)
    }finally{
      setIsLoading(false);
    }
  };

  const deletePost = async (postId) => {

  };

  const handleLoadMore = () => {};

  useEffect(() => {
    getAllPosts();
    
    return () => {};
  }, [filterStatus]);

  return (
    <>
      <DashboardLayout activeMenu="Blog Posts">
        
        <div className="w-auto sm:max-w-[900px] mx-auto">
          
          <div className="flex items-center justify-between">
            
            <h2 className=" text-2xl font-semibold mt-5 mb-5">Posts</h2>
            <button className="flex" onClick={() => navigate("/admin/create")}>
              
              <LuPlus className=" text-18px" /> Create New
            </button>
          </div>

          <Tabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus}/>
          <div className="mt-5">
            {
              blogPostList.map((post)=>{
                return (
                  <BlogPostSummaryCard
                  key={post._id}
                  title={post.title}
                  imgUrl={post.coverImageUrl}
                  updatedOn={
                    post.updatedAt?moment(post.updatedAt).format('Do MMM YYYY') : "--"
                  }
                  tags={post.tags}
                  likes={post.likes}
                  views={post.views}
                  onClick={()=>{
                    navigate('/admin/edit/'+post.slug)
                  }}
                  onDelete={()=>{
                    setOpenDeleteAlert({open:true , data:post._id})
                  }}
                  />
                )
              })
            }
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default BlogPosts;
