import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import MDEditor, { commands } from "@uiw/react-md-editor";

import {
  LuLoaderCircle,
  LuSave,
  LuSend,
  LuSparkles,
  LuTrash2,
} from "react-icons/lu";

import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useNavigate, useParams } from 'react-router-dom';
const BlogPostEditor = ({isEdit}) => {
  const navigate=useNavigate();

  const {postSlug=""}=useParams();

  const [postData,setPostData]=useState({
    id:"",
    title:"",
    content:"",
    coverImageUrl:"",
    coverPreview:"",
    tags:"",
    isDraft:"",
    generatedByAI:false
  })
const [postIdeas, setPostIdeas] = useState([]);

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
  open: false,
  data: null,
});

const [ideaLoading, setIdeaLoading] = useState(false);

const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

const handleValueChange=(key , value)=>{
setPostData((prevData)=>({...prevData,[key]:value}));
}

const generatePostIdeas=async()=>{
  
}
const handlePublish=async()=>{

}
const fetchPostDetailsBySlug=async()=>{

}
const deletePost=async()=>{

}


useEffect(()=>{
if(isEdit){
  fetchPostDetailsBySlug()
}else{
  generatePostIdeas();
}

return ()=>{}
},[])

  return (
    <DashboardLayout activeMenu='Blog Posts'>
      <div className='my-5'>
        <div className='grid grid-cols-1 mdgrid-cols-12 gap-5 my-4'>
          <div className='form-card p-6 col-span-12 md:col-span-8'>
            <div className='flex items-center justify-between'>
              <h2 className='text-base md:text-lg font-medium'>
                  {!isEdit ? "Add New Psot":"  Edit Post"}

              </h2>

              <div className='flex items-center gap-3'>
                {isEdit && (
                  <button className='flex items-center gap-2.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 rounded px=1.5 md:px-3 py-1 md:py-[3px] border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all' disabled={loading} onClick={()=>setOpenDeleteAlert(true)}>
                    <LuTrash2 className='text-sm'/> {" "}
                    <span className='hidden md:block'>Delete</span>

                  </button>
                )}


                 <button className='flex items-center gap-2.5 text-[13px] font-medium text-sky-500 bg-sky-50/60 px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02]' disabled={loading} onClick={()=>handlePublish(true)}>
                 <LuSave className='text-sm'/>{" "}
                 <span className='hidden md:block'> Save as Draft </span>
                </button>

                <button className='flex items-center gap-2.5 text-[13px] font-medium text-sky-500 bg-sky-50/60 px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02]' disabled={loading} onClick={()=>handlePublish(true)}>
                  {loading?(
                    <LuLoaderCircle className=''/>
                  ):(
                    <LuSend className='' />
                  )} {" "}
                  Publish
                </button>
              </div>
            </div>
            {error && <p className=''>{error}</p>}
            <div className='mt-4'>
              <label className="text-xs font-medium text-slate-600"> Post Title</label>
              <input placeholder='How to be Iron-Man '
              className='form-input'
              value={postData.title}
              onChange={({target})=>handleValueChange('title',target.value)}
              />
            </div>

            <div className='mt-4'>
                  <CoverImageSelectr 
                  image={postData.coverImageUrl}
                  setImage={(value)=>handleValueChange("coverImageUrl",value)}

                  preview={postData.coverPreview}

                  setPriview={(value)=>handleValueChange('coverPreview',value)} />
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogPostEditor 