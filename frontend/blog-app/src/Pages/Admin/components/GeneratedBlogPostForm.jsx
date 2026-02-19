import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import toast from "react-hot-toast";

const GeneratedBlogPostForm = ({
  setPostContent,
  handleCloseForm,
  contentParams,
}) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);

  // Prefill when idea clicked
  useEffect(() => {
    if (contentParams?.title) {
      setTopic(contentParams.title);
    }
  }, [contentParams]);

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast.error("Topic required");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST,
        {
          title: topic.trim(),
          tone,
        }
      );

      const { title, content } = res.data;

      setPostContent(title, content);
      toast.success("Blog generated ✨");
      handleCloseForm();
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-5 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-semibold">
          Generate AI Blog
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Give a topic + tone — AI handles the heavy lifting.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Topic */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Topic
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2.5 text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition"
            placeholder="e.g. Future of AI in Healthcare"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Tone */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Writing Tone
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2.5 text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition bg-white"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
            <option value="storytelling">Storytelling</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={generateBlog}
            disabled={loading}
            className={`w-full sm:flex-1 rounded-lg px-4 py-2.5 text-sm sm:text-base
              font-medium text-white transition
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]"
              }`}
          >
            {loading ? "Generating..." : "Generate Blog"}
          </button>

          <button
            onClick={handleCloseForm}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg px-4 py-2.5 text-sm sm:text-base
                       font-medium border hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedBlogPostForm;
