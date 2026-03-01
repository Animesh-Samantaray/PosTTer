export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/image-upload",
  },
  DASHBOARD: {
    GET_DASHBOARD_DATA: "/api/dashboard-summary",
  },
  AI: {
    GENERATE_BLOG_POST: "/api/ai/generate",
    GENERATE_BLOG_POST_IDEAS: "/api/ai/generate-ideas",
    GENERATE_COMMENT_REPLY: "/api/ai/generate-reply",
    GENERATE_POST_SUMMARY: "/api/ai/generate-summary",
  },
  POSTS: {
    CREATE: "/api/posts",
    GET_ALL: "/api/posts",
    GET_TRENDING_POSTS: "/api/posts/trending",
    GET_BY_SLUG: (slug) => `/api/posts/slug/${slug}`,
    UPDATE: (id) => `/api/posts/${id}`,
    DELETE: (id) => `/api/posts/${id}`,
    GET_BY_TAG: (tag) => `/api/posts/tag/${tag}`,
    SEARCH: "/api/posts/search",
    INCREMENT_VIEW: (id) => `/api/posts/${id}/view`, // FIXED: backend uses /:id/view
  },
  COMMENT: {
    ADD: (postId) => `/api/comments/${postId}`,
    GET_ALL_BY_POST: (postId) => `/api/comments/${postId}`, // CHANGED NAME TO MATCH COMPONENT
    DELETE: (commentId) => `/api/comments/${commentId}`,
    GET_ALL: "/api/comments",
  },
};