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
import DeleteAlertContent from "../../components/DeleteAlertContent";
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
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postId))
      toast.success('Post Deleted')

      setOpenDeleteAlert({
        open:false,data:null
      });
      getAllPosts();
    } catch (error) {
      console.error('Error on deleting :',error.message)
      toast.error(error.message)
    }
  };

  const handleLoadMore = () => {

    if(page<totalPages){
      getAllPosts(page+1);
    }
  };

  useEffect(() => {
    getAllPosts();
    
    return () => {};
  }, [filterStatus]);

  return (
    <>
      <DashboardLayout activeMenu="Blog Posts">
        
        <div className="w-auto sm:max-w-[900px] mx-auto">
          
          <div className="flex items-center justify-between mt-6 mb-6">
  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
    Posts
  </h2>

  <button
    onClick={() => navigate("/admin/create")}
    className="
      flex items-center gap-2
      bg-indigo-600 hover:bg-indigo-700
      text-white font-medium
      px-5 py-2.5
      rounded-xl
      shadow-md hover:shadow-lg
      transition-all duration-200
      active:scale-95
    "
  >
    <LuPlus className="text-lg" />
    Create New
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

            {page < totalPages && (<div className="flex items-center justify-center mb-8">
              <button
              className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 rounded-full  text-nowrap hover:scale-105 transition-all cursor-pointer"
              disabled={isLoading}
              onClick={handleLoadMore}
              >
                {
                  isLoading ? (
                    <LuLoaderCircle className=" animate-spin text-[15px]" />
                  ):(
                    <LuGalleryVerticalEnd className="text-lg"/>
                  )
                }{" "}
                {isLoading ? 'Loading...' :'Load More'}


              </button>
            </div>)}
          </div>
        </div>

<Modal
  isOpen={Boolean(openDeleteAlert?.open)}
  onClose={() => setOpenDeleteAlert({ open: false, data: null })}
  title="Delete Post"
>
  <div className="w-full max-w-md sm:w-[30vw]" aria-live="polite">
    <DeleteAlertContent
      content="You want to delete this post?"
      onDelete={() =>
        openDeleteAlert?.data && deletePost(openDeleteAlert.data)
      }
    />
  </div>
</Modal>

      </DashboardLayout>
    </>
  );
};

export default BlogPosts;
