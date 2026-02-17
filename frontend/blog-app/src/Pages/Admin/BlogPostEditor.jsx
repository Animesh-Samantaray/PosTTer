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
import CoverImageSelector from '../../components/Inputs/CoverImageSelector';
import TagInput from '../../components/Inputs/TagInput';
import SkeletonLoader from '../../components/Cards/SkeletonLoader';
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
  setIdeaLoading(true);
  try {
    const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_BLOG_POST , {
      topics:'AI , GEN AI , This Generation , Ai era , python , docker '
    })
    const generatedIdeas = aiResponse.data;
    if(generatePostIdeas?.length>0){
      setPostIdeas(generatedIdeas)
    }
  } catch (error) {
    console.log('Something went wrong')
    toast.error('SOmething went wrong')
  }finally{
    setIdeaLoading(false);
  }
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
                  <CoverImageSelector
                  image={postData.coverImageUrl}
                  setImage={(value)=>handleValueChange("coverImageUrl",value)}

                  preview={postData.coverPreview}

                  setPriview={(value)=>handleValueChange('coverPreview',value)} />
            </div>

<div className="mt-6">
  {/* HEADER ROW */}
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-semibold text-slate-700">
      Content
    </label>

    <span className="text-xs text-slate-400">
      Markdown supported
    </span>
  </div>

  {/* EDITOR CARD */}
  <div
    data-color-mode="light"
    className="
      rounded-2xl
      border border-slate-200
      bg-white
      shadow-sm
      overflow-hidden
      transition
      hover:shadow-md
      focus-within:ring-2 focus-within:ring-indigo-500/60
    "
  >
    <MDEditor
      value={postData.content}
      onChange={(val) => handleValueChange("content", val || "")}
      height={440}
      preview="edit"
      visibleDragbar={false}
      textareaProps={{
        placeholder:
          "Write your blog content here… headings, code, lists — ship something awesome.",
      }}
      commands={[
        commands.bold,
        commands.italic,
        commands.strikethrough,
        commands.hr,

        commands.group(
          [commands.title1, commands.title2, commands.title3],
          {
            name: "title",
            groupName: "title",
            buttonProps: { "aria-label": "Insert heading" },
          }
        ),

        commands.divider,
        commands.link,
        commands.quote,
        commands.code,
        commands.codeBlock,
        commands.image,

        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.checkedListCommand,

        commands.divider,
        commands.preview,
        commands.fullscreen,
      ]}
    />
  </div>

  {/* FOOTNOTE */}
  <p className="text-xs text-slate-500 mt-3">
    Tip: Use headings + lists for better readability and SEO.
  </p>
</div>




            <div>

              <label className='text-xs font-medium text-slate-500'>Tags</label>

              <TagInput
                tags={postData?.tags || []}
                setTags = {(data)=>{
                  handleValueChange('tags',data);
                }}
              />
            </div>

            

          </div>

{!isEdit && (
  <div className="form-card col-span-12 md:col-span-9 xl:col-span-10 p-0 overflow-hidden w-full group">

    {/* HEADER */}
    <div
      className="
        flex items-center justify-between
        px-7 pt-7 pb-5
        border-b border-slate-100
        bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          className="
            w-11 h-11
            flex items-center justify-center
            rounded-2xl
            bg-white
            shadow-sm
            group-hover:shadow-md
            transition
          "
        >
          <LuSparkles className="text-indigo-600 text-xl" />
        </div>

        <div>
          <h4 className="text-base font-semibold text-indigo-700">
            Ideas for your post
          </h4>
          <p className="text-xs text-indigo-500 mt-0.5">
            AI-powered topic brainstorming
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() =>
          setOpenBlogPostGenForm({ open: true, data: null })
        }
        className="
          text-sm font-semibold
          px-5 py-2.5
          rounded-xl
          bg-indigo-600
          text-white
          shadow-sm
          hover:bg-indigo-700
          hover:shadow-lg
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all duration-200
        "
      >
        Generate New
      </button>
    </div>

   <div>
    {
      ideaLoading ? (
        <div>
          <SkeletonLoader />
        </div>
      ):(
        postIdeas.map((idea,index)=>(
          <BlogPostIdeaCard 
          key={`idea_${index}`}
          title={idea.title || ""}
          description = {idea.description||""}
          tags={idea.tags || ""}
          tone={idea.tone || ""}
          onSelect={()=>setOpenBlogPostGenForm({open:true,data:idea})}
          />
        ))
      )
    }
   </div>
  </div>
)}





        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogPostEditor 