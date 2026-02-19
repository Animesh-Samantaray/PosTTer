import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { LuSave, LuSend, LuSparkles, LuTrash2 } from "react-icons/lu";

import CoverImageSelector from "../../components/Inputs/CoverImageSelector";
import TagInput from "../../components/Inputs/TagInput";
import Modal from "../../components/Modal";
import GeneratedBlogPostForm from "./components/GeneratedBlogPostForm";

import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const BlogPostEditor = ({ isEdit }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverPreview: "",
    tags: [],
    isDraft: false,
    generatedByAI: false,
  });

  const [loading, setLoading] = useState(false);
  const [openGenForm, setOpenGenForm] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  };

  // ===== IMAGE UPLOAD HELPER =====
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
  };

  // ===== CREATE / UPDATE POST =====
  const handlePublish = async (isDraft) => {
    if (loading) return;

    // ----- validation -----
    if (!postData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!postData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!isDraft) {
      if (!postData.coverImageUrl && !postData.coverPreview) {
        toast.error("Cover image required");
        return;
      }
      if (!postData.tags.length) {
        toast.error("Add at least one tag");
        return;
      }
    }

    setLoading(true);

    try {
      let finalCoverUrl = "";

      // ----- image resolution -----
      if (postData.coverImageUrl instanceof File) {
        const imgRes = await uploadImage(postData.coverImageUrl);
        finalCoverUrl = imgRes.imageUrl || "";
      } else {
        finalCoverUrl =
          postData.coverImageUrl || postData.coverPreview || "";
      }

      const payload = {
        title: postData.title,
        content: postData.content,
        coverImageUrl: finalCoverUrl,
        tags: postData.tags,
        isDraft: !!isDraft,
        generatedByAI: postData.generatedByAI,
      };

      // ----- create vs update -----
      const response = isEdit
        ? await axiosInstance.put(
            API_PATHS.POSTS.UPDATE(postData.id),
            payload
          )
        : await axiosInstance.post(
            API_PATHS.POSTS.CREATE,
            payload
          );

      if (response?.data) {
        toast.success(
          isEdit ? "Post updated successfully" : "Post created successfully"
        );
        navigate("/admin/posts");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to save post"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== KEEP BLANK (as requested) =====
const fetchPostDetailsBySlug = async () => {
  try {
    if (!slug) return;

    const response = await axiosInstance.get(
      API_PATHS.POSTS.GET_BY_SLUG(slug)
    );

    if (response?.data) {
      const data = response?.data;

      setPostData((prev) => ({
        ...prev,
        id: data._id,
        title: data.title,
        content: data.content,
        coverPreview: data.coverImageUrl,
        coverImageUrl: data.coverImageUrl,
        tags: data.tags || [],
        isDraft: data.isDraft,
        generatedByAI: data.generatedByAI || false,
      }));
    }

  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Failed to load post");
  }
};

  const deletePost = async () => {};

  useEffect(() => {
    if (isEdit) fetchPostDetailsBySlug();
  }, [isEdit]);

  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-5">

          {/* HEADER */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {isEdit ? "Edit Post" : "Create New Post"}
              </h2>
              <p className="text-sm text-slate-500">
                Write and publish content
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">

              {!isEdit && (
                <button
                  onClick={() => setOpenGenForm(true)}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  <LuSparkles />
                  AI Generate
                </button>
              )}

              {isEdit && (
                <button
                  onClick={deletePost}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium px-4 py-2 rounded-lg border"
                >
                  <LuTrash2 />
                  Delete
                </button>
              )}

              <button
                onClick={() => handlePublish(true)}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm font-medium px-4 py-2 rounded-lg border"
              >
                <LuSave />
                Draft
              </button>

              <button
                onClick={() => handlePublish(false)}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                <LuSend />
                Publish
              </button>
            </div>
          </div>

          {/* TITLE */}
          <input
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Post title..."
            value={postData.title}
            onChange={(e) => handleValueChange("title", e.target.value)}
          />

          {/* COVER */}
          <CoverImageSelector
            image={postData.coverImageUrl}
            setImage={(v) => handleValueChange("coverImageUrl", v)}
            preview={postData.coverPreview}
            setPriview={(v) => handleValueChange("coverPreview", v)}
          />

          {/* EDITOR */}
          <div data-color-mode="light" className="border rounded-xl overflow-hidden">
            <MDEditor
              value={postData.content}
              onChange={(v) => handleValueChange("content", v || "")}
              height={480}
              preview="edit"
              visibleDragbar={false}
              commands={[
                commands.bold,
                commands.italic,
                commands.hr,
                commands.group(
                  [commands.title1, commands.title2, commands.title3],
                  { name: "title", groupName: "title" }
                ),
                commands.divider,
                commands.link,
                commands.quote,
                commands.codeBlock,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.preview,
                commands.fullscreen,
              ]}
            />
          </div>

          {/* TAGS */}
          <TagInput
            tags={postData.tags}
            setTags={(t) => handleValueChange("tags", t)}
          />
        </div>
      </div>

      {/* AI MODAL */}
      <Modal isOpen={openGenForm} onClose={() => setOpenGenForm(false)} hideHeader>
        <GeneratedBlogPostForm
          setPostContent={(title, content) => {
            setPostData((prev) => ({
              ...prev,
              title: title || prev.title,
              content,
              generatedByAI: true,
            }));
          }}
          handleCloseForm={() => setOpenGenForm(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPostEditor;
