# Blog Post Routes Documentation

## Overview
The Blog Post module manages the core blogging functionality including post creation, editing, deletion, and retrieval. It provides comprehensive features for content management, including search, filtering by status/tags, view tracking, and engagement metrics (likes, views). This module supports draft management and AI-generated content tracking.

---

## Module Structure

### File: `blogPostRoute.js`
Defines all blog post API endpoints and their routing with role-based access control.

### File: `blogPostController.js`
Contains the business logic for post operations, database queries, and response handling.

---

## Key Concepts

### Slug Generation
Slugs are URL-friendly versions of post titles used for accessing posts:
```javascript
const slug = title.toLowerCase()
  .replace(/ /g, "-")           // Replace spaces with hyphens
  .replace(/[^\w-]+/g, "");     // Remove special characters
```
**Example:** "My First Blog Post" → "my-first-blog-post"

### Role-Based Access Control
```javascript
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role == 'admin'){
        next();
    }
    else return res.status(403).json({
        message: "Admin access only"
    })
}
```
Inline middleware that restricts certain operations to admin users only.

### Post Status (Draft vs Published)
- **Draft:** `isDraft: true` - Not visible to public
- **Published:** `isDraft: false` - Visible to all users

---

## API Endpoints

### 1. **Create Blog Post**
**Route:** `POST /posts`  
**Access Level:** ⚠️ **PROTECTED & ADMIN ONLY**

#### Purpose
Creates a new blog post with metadata, content, and optional AI generation tracking.

#### Request Body
```json
{
  "title": "string (required) - Post title",
  "content": "string (required) - Post content in Markdown",
  "coverImageUrl": "string (optional) - Featured image URL",
  "tags": "array of strings (optional) - Post categories/tags",
  "isDraft": "boolean (default: false) - Draft status",
  "generatedByAI": "boolean (default: false) - AI generation flag"
}
```

#### Response (Success - 201)
```json
{
  "newPost": {
    "_id": "ObjectId",
    "title": "string",
    "slug": "string - Auto-generated from title",
    "content": "string",
    "coverImageUrl": "string",
    "tags": ["array"],
    "author": "ObjectId",
    "isDraft": "boolean",
    "generatedByAI": "boolean",
    "views": 0,
    "likes": 0,
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  },
  "message": "Post successful"
}
```

#### How It Works
1. **Input Validation:** Extracts title, content, and metadata from request
2. **Slug Generation:** Auto-generates SEO-friendly slug from title
3. **Author Assignment:** Sets author to authenticated user (`req.user._id`)
4. **Database Creation:** Creates new BlogPost document
5. **Response:** Returns created post with confirmation message

#### Error Handling
- **401 Unauthorized:** If user not authenticated
- **403 Forbidden:** If user is not an admin
- **500 Internal Server Error:** Database or validation error

#### Example Usage
```javascript
// Request
{
  "title": "Getting Started with Node.js",
  "content": "# Node.js Basics\n\nNode.js is...",
  "coverImageUrl": "https://example.com/nodejs.jpg",
  "tags": ["nodejs", "javascript", "backend"],
  "isDraft": false,
  "generatedByAI": true
}

// Response
{
  "newPost": {
    "_id": "65abc123def456",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "# Node.js Basics\n\nNode.js is...",
    "coverImageUrl": "https://example.com/nodejs.jpg",
    "tags": ["nodejs", "javascript", "backend"],
    "author": "65user123id456",
    "isDraft": false,
    "generatedByAI": true,
    "views": 0,
    "likes": 0,
    "createdAt": "2024-02-08T10:30:00Z",
    "updatedAt": "2024-02-08T10:30:00Z"
  },
  "message": "Post successful"
}
```

---

### 2. **Get All Posts**
**Route:** `GET /posts?status=published|draft|all&page=1`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Retrieves paginated list of blog posts with filtering by status and author information.

#### Query Parameters
```
status: 'published' | 'draft' | 'all' (default: 'published')
page: integer (default: 1)
```

#### Response (Success - 200)
```json
{
  "posts": [
    {
      "_id": "ObjectId",
      "title": "string",
      "slug": "string",
      "content": "string",
      "coverImageUrl": "string",
      "tags": ["array"],
      "author": {
        "_id": "ObjectId",
        "name": "string",
        "profileUrl": "string"
      },
      "isDraft": "boolean",
      "views": "number",
      "likes": "number",
      "createdAt": "ISO timestamp",
      "updatedAt": "ISO timestamp"
    }
  ],
  "page": "number - Current page",
  "totalPages": "number - Total pages available",
  "totalCount": "number - Total posts for current filter",
  "counts": {
    "all": "number - Total posts",
    "published": "number - Published posts",
    "draft": "number - Draft posts"
  }
}
```

#### How It Works
1. **Status Filter:** Applies filter based on status query parameter
   - `published`: Only `isDraft: false`
   - `draft`: Only `isDraft: true`
   - `all`: No filter
2. **Pagination:** Calculates skip/limit (5 posts per page)
3. **Population:** Includes author name and profile URL
4. **Sorting:** Orders by update date (newest first)
5. **Count Statistics:** Retrieves all count variations in parallel

#### Pagination Details
- **Items per page:** 5
- **Calculation:** `skip = (page - 1) × 5`
- **Example:** Page 2 starts at item 6

#### Error Handling
- **500 Internal Server Error:** Database query error

#### Example Usage
```javascript
// Request - Published posts, page 1
GET /posts?status=published&page=1

// Response
{
  "posts": [
    {
      "_id": "65post001",
      "title": "Node.js Best Practices",
      "slug": "nodejs-best-practices",
      "author": {
        "_id": "65user123",
        "name": "John Doe",
        "profileUrl": "https://example.com/users/john.jpg"
      },
      "views": 152,
      "likes": 23,
      "isDraft": false
    }
  ],
  "page": 1,
  "totalPages": 5,
  "totalCount": 23,
  "counts": {
    "all": 28,
    "published": 23,
    "draft": 5
  }
}
```

---

### 3. **Get Post by Slug**
**Route:** `GET /posts/slug/:slug`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Retrieves a single blog post by its URL-friendly slug.

#### Path Parameters
```
slug: string - URL-friendly post identifier
```

#### Response (Success - 200)
```json
{
  "_id": "ObjectId",
  "title": "string",
  "slug": "string",
  "content": "string - Full Markdown content",
  "coverImageUrl": "string",
  "tags": ["array"],
  "author": {
    "_id": "ObjectId",
    "name": "string",
    "profileImageUrl": "string"
  },
  "isDraft": "boolean",
  "generatedByAI": "boolean",
  "views": "number",
  "likes": "number",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

#### How It Works
1. **Query by Slug:** Finds post using slug parameter
2. **Author Lookup:** Populates author details
3. **Response:** Returns complete post object

#### Error Handling
- **404 Not Found:** Post with slug doesn't exist

#### Example Usage
```javascript
// Request
GET /posts/slug/getting-started-with-nodejs

// Response
{
  "_id": "65abc123def456",
  "title": "Getting Started with Node.js",
  "slug": "getting-started-with-nodejs",
  "content": "# Getting Started with Node.js\n\n...",
  "author": {
    "_id": "65user123",
    "name": "John Doe",
    "profileImageUrl": "https://example.com/user.jpg"
  },
  "views": 342,
  "likes": 45
}
```

#### Frontend Usage
```javascript
// Extract slug from URL and fetch post
const slug = window.location.pathname.split('/').pop();
const response = await axios.get(`/posts/slug/${slug}`);
const post = response.data;
```

---

### 4. **Update Blog Post**
**Route:** `PUT /posts/:id`  
**Access Level:** ⚠️ **PROTECTED & ADMIN ONLY** (or post author)

#### Purpose
Updates an existing blog post with new content or metadata.

#### Path Parameters
```
id: ObjectId - Post ID
```

#### Request Body
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "coverImageUrl": "string (optional)",
  "tags": "array (optional)",
  "isDraft": "boolean (optional)"
  // Any other fields to update
}
```

#### Response (Success - 200)
```json
{
  "message": "Updated post",
  "updatedPost": {
    "_id": "ObjectId",
    "title": "string - Updated",
    "slug": "string - Auto-regenerated if title changed",
    "content": "string - Updated",
    "coverImageUrl": "string - Updated",
    "tags": ["array - Updated"],
    "author": "ObjectId",
    "isDraft": "boolean - Updated",
    "updatedAt": "ISO timestamp - Current time"
  }
}
```

#### How It Works
1. **Post Lookup:** Finds post by ID
2. **Authorization Check:** 
   - Validates that user is post author OR admin
   - Returns 403 if unauthorized
3. **Slug Regeneration:** If title is updated, regenerates slug
4. **Database Update:** Updates post with new data
5. **Response:** Returns updated post object

#### Authorization Logic
```javascript
if(post.author.toString() !== req.user._id.toString() && !req.user.isAdmin){
    return 403 Forbidden
}
```
Allows update if:
- User is the original author, OR
- User is an admin

#### Error Handling
- **404 Not Found:** Post doesn't exist
- **403 Forbidden:** User not authorized to update
- **500 Internal Server Error:** Database error

#### Example Usage
```javascript
// Request - Update content
PUT /posts/65abc123def456
{
  "content": "Updated content here...",
  "isDraft": false
}

// Response
{
  "message": "Updated post",
  "updatedPost": {
    "_id": "65abc123def456",
    "title": "Getting Started with Node.js",
    "content": "Updated content here...",
    "isDraft": false,
    "updatedAt": "2024-02-08T15:45:00Z"
  }
}
```

---

### 5. **Delete Blog Post**
**Route:** `DELETE /posts/:id`  
**Access Level:** ⚠️ **PROTECTED & ADMIN ONLY**

#### Purpose
Permanently deletes a blog post from the database.

#### Path Parameters
```
id: ObjectId - Post ID
```

#### Response (Success - 200)
```json
{
  "message": "Post deleted"
}
```

#### How It Works
1. **Post Lookup:** Finds post by ID
2. **Existence Check:** Validates post exists
3. **Database Delete:** Removes post document
4. **Response:** Confirms deletion

#### Error Handling
- **400 Bad Request:** Post doesn't exist
- **403 Forbidden:** User is not admin
- **500 Internal Server Error:** Database error

#### ⚠️ Warning
Deletion is permanent and cannot be undone. Consider implementing soft delete instead:
```javascript
// Alternative: Soft delete
await BlogPost.findByIdAndUpdate(id, {deleted: true, deletedAt: new Date()})
```

#### Example Usage
```javascript
// Request
DELETE /posts/65abc123def456

// Response
{
  "message": "Post deleted"
}
```

---

### 6. **Get Posts by Tag**
**Route:** `GET /posts/tag/:tag`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Retrieves all published posts with a specific tag.

#### Path Parameters
```
tag: string - Tag name to filter by
```

#### Response (Success - 200)
```json
[
  {
    "_id": "ObjectId",
    "title": "string",
    "slug": "string",
    "content": "string",
    "coverImageUrl": "string",
    "tags": ["array"],
    "author": {
      "_id": "ObjectId",
      "name": "string",
      "profileImageUrl": "string"
    },
    "isDraft": false,
    "views": "number",
    "likes": "number"
  }
]
```

#### How It Works
1. **Tag Filter:** Searches for posts with matching tag
2. **Draft Filter:** Only shows published posts (`isDraft: false`)
3. **Author Population:** Includes author details
4. **Response:** Returns array of matching posts

#### Error Handling
- **404 Not Found:** No posts found with tag
- **500 Internal Server Error:** Database error

#### Example Usage
```javascript
// Request
GET /posts/tag/nodejs

// Response
[
  {
    "_id": "65post001",
    "title": "Node.js Beginner Guide",
    "slug": "nodejs-beginner-guide",
    "tags": ["nodejs", "javascript"],
    "views": 234
  },
  {
    "_id": "65post002",
    "title": "Node.js Performance Tips",
    "slug": "nodejs-performance-tips",
    "tags": ["nodejs", "performance"],
    "views": 456
  }
]
```

#### Tag Cloud Usage
```javascript
// Get posts for a specific category
const tag = 'React';
const posts = await axios.get(`/posts/tag/${tag}`);
```

---

### 7. **Search Posts**
**Route:** `GET /posts/search?q=keyword`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Searches blog posts by title or content using regex pattern matching.

#### Query Parameters
```
q: string (required) - Search keyword
```

#### Response (Success - 200)
```json
[
  {
    "_id": "ObjectId",
    "title": "string",
    "slug": "string",
    "content": "string",
    "author": {
      "_id": "ObjectId",
      "name": "string",
      "profileImageUrl": "string"
    },
    "views": "number",
    "likes": "number"
  }
]
```

#### How It Works
1. **Query Extraction:** Gets search keyword from query parameter
2. **Regex Search:** Uses MongoDB `$regex` with case-insensitive matching
3. **Dual Field Search:** Searches both title and content
4. **Draft Filter:** Only searches published posts
5. **Response:** Returns array of matching posts

#### Search Query Logic
```javascript
const posts = await BlogPost.find({
  isDraft: false,
  $or: [
    {title: {$regex: q, $options: 'i'}},     // Case-insensitive title match
    {content: {$regex: q, $options: 'i'}}    // Case-insensitive content match
  ]
})
```

#### Performance Note
- ⚠️ Full-text search on large databases may be slow
- Consider adding MongoDB text indexes for better performance:
```javascript
// In schema
postSchema.index({title: 'text', content: 'text'})

// Then use text search
BlogPost.find({$text: {$search: q}})
```

#### Error Handling
- **500 Internal Server Error:** Database error

#### Example Usage
```javascript
// Request - Search for "React hooks"
GET /posts/search?q=React%20hooks

// Response
[
  {
    "_id": "65post001",
    "title": "Understanding React Hooks",
    "slug": "understanding-react-hooks",
    "content": "React hooks allow you to use state...",
    "views": 789
  },
  {
    "_id": "65post002",
    "title": "Custom React Hooks Tutorial",
    "slug": "custom-react-hooks-tutorial",
    "content": "Creating custom hooks for reusable logic...",
    "views": 456
  }
]
```

#### Frontend Search Implementation
```javascript
const searchPosts = async (keyword) => {
  const response = await axios.get('/posts/search', {
    params: { q: keyword }
  });
  return response.data;
};
```

---

### 8. **Increment Post View Count**
**Route:** `POST /posts/:id/view`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Tracks post views by incrementing the view counter.

#### Path Parameters
```
id: ObjectId - Post ID
```

#### Response (Success - 200)
```json
{
  "message": "View count incremented"
}
```

#### How It Works
1. **View Increment:** Uses MongoDB `$inc` operator to add 1 to views
2. **No Response Data:** Returns confirmation only
3. **No Validation:** Doesn't check if post exists

#### Implementation Details
```javascript
await BlogPost.findByIdAndUpdate(req.params.id, {
  $inc: {views: 1}
});
```

#### ⚠️ Issues to Address
1. **No Validation:** Should check if post exists
2. **Duplicate Tracking:** Counts every request, no user session tracking
3. **Better Approach:** Track user views to avoid inflating counts

#### Suggested Improvement
```javascript
// Store view tracking separately
const updatedPost = await BlogPost.findByIdAndUpdate(
  req.params.id, 
  {$inc: {views: 1}},
  {new: true}
);

if(!updatedPost) {
  return res.status(404).json({message: 'Post not found'});
}

res.json({message: 'View count incremented'});
```

#### Example Usage
```javascript
// Request
POST /posts/65abc123def456/view

// Response
{
  "message": "View count incremented"
}

// Frontend - Track view when post loads
useEffect(() => {
  axios.post(`/posts/${postId}/view`);
}, [postId]);
```

---

### 9. **Like a Post**
**Route:** `POST /posts/:id/like`  
**Access Level:** ⚠️ **PROTECTED** (requires authentication)

#### Purpose
Records a like for a blog post, incrementing the like counter.

#### Path Parameters
```
id: ObjectId - Post ID
```

#### Response (Success - 200)
```json
{
  "message": "Like added"
}
```

#### How It Works
1. **Authentication Check:** Requires valid JWT token
2. **Like Increment:** Uses MongoDB `$inc` operator to add 1 to likes
3. **Response:** Confirms like added

#### Implementation Logic
```javascript
await BlogPost.findByIdAndUpdate(req.params.id, {
  $inc: {likes: 1}
});
```

#### ⚠️ Limitations
1. **Multiple Likes:** No prevention of duplicate likes from same user
2. **No Unlike:** No way to remove a like
3. **Better Implementation:** Track likes per user to prevent duplicates

#### Suggested Improvement
```javascript
// Track likes by user
const updatedPost = await BlogPost.findByIdAndUpdate(
  req.params.id,
  {
    $addToSet: {likedBy: req.user._id}  // Add user if not already liked
  },
  {new: true}
);

// Then use post.likedBy.length for like count
```

#### Error Handling
- **401 Unauthorized:** User not authenticated
- **500 Internal Server Error:** Database error

#### Example Usage
```javascript
// Request (with JWT token)
POST /posts/65abc123def456/like
Authorization: Bearer eyJhbGc...

// Response
{
  "message": "Like added"
}

// Frontend - Like button
const handleLike = async () => {
  await axios.post(`/posts/${postId}/like`, {}, {
    headers: {Authorization: `Bearer ${token}`}
  });
  setLikes(likes + 1);
};
```

---

### 10. **Get Top/Trending Posts**
**Route:** `GET /posts/trending`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Retrieves the top 5 most popular posts based on views and likes.

#### Query Parameters
None

#### Response (Success - 200)
```json
[
  {
    "_id": "ObjectId",
    "title": "string",
    "slug": "string",
    "content": "string",
    "coverImageUrl": "string",
    "tags": ["array"],
    "author": "ObjectId",
    "isDraft": false,
    "views": "number - High value",
    "likes": "number - High value",
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  }
]
```

#### How It Works
1. **Filter Published:** Only gets non-draft posts
2. **Multi-Sort:** Sorts by views (descending), then likes (descending)
3. **Limit:** Returns only top 5 posts
4. **Response:** Returns array of trending posts

#### Sorting Logic
```javascript
.sort({
  views: -1,  // Primary sort: highest views first
  likes: -1   // Secondary sort: highest likes second
})
.limit(5)
```

#### Example Usage
```javascript
// Request
GET /posts/trending

// Response
[
  {
    "_id": "65post001",
    "title": "Node.js Best Practices 2024",
    "slug": "nodejs-best-practices-2024",
    "views": 5432,
    "likes": 234
  },
  {
    "_id": "65post002",
    "title": "React Performance Optimization",
    "slug": "react-performance-optimization",
    "views": 3421,
    "likes": 189
  },
  // ... 3 more posts
]
```

#### Frontend - Sidebar Widget
```javascript
import {useEffect, useState} from 'react';

const TrendingPosts = () => {
  const [trending, setTrending] = useState([]);
  
  useEffect(() => {
    axios.get('/posts/trending')
      .then(res => setTrending(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="trending-sidebar">
      <h3>Trending Posts</h3>
      {trending.map(post => (
        <a key={post._id} href={`/blog/${post.slug}`}>
          {post.title}
        </a>
      ))}
    </div>
  );
};
```

#### Error Handling
- **500 Internal Server Error:** Database error

---

## Database Schema (BlogPost Model)

Expected fields on BlogPost schema:
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique),
  content: String (required),
  coverImageUrl: String,
  tags: [String],
  author: ObjectId (references User),
  isDraft: Boolean (default: false),
  generatedByAI: Boolean (default: false),
  views: Number (default: 0),
  likes: Number (default: 0),
  likedBy: [ObjectId],  // Recommended for preventing duplicate likes
  createdAt: Date,
  updatedAt: Date
}
```

---

## Middleware & Security

### Authentication Middleware (`protect`)
- Validates JWT token from Authorization header
- Attaches user object to `req.user`
- Required for: Create, Update, Delete, Like
- Returns 401 if token missing or invalid

### Admin-Only Middleware
```javascript
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role == 'admin'){
        next();
    }
    else return res.status(403).json({
        message: "Admin access only"
    })
}
```
- Checks if user has `role: "admin"`
- Required for: Create, Update, Delete
- Returns 403 if not admin

---

## Request & Response Flow

### Create Post Flow
```
Admin Request + JWT Token
    ↓
Middleware: Authentication Check
    ↓
Middleware: Admin Role Verification
    ↓
Controller: Validate Input
    ↓
Generate URL Slug
    ↓
Create Document in Database
    ↓
Return Created Post (201)
```

### Get Posts Flow
```
Public Request
    ↓
Extract Query Parameters (status, page)
    ↓
Build Filter Object
    ↓
Query Database with Pagination
    ↓
Populate Author Details
    ↓
Get Count Statistics
    ↓
Return Posts Array + Metadata
```

---

## Common Bugs & Issues Found

### 1. **View Count Endpoint Name**
**Bug:** Route is `/:id/view` but controller call is `incrementReview`
**Issue:** Function name is misleading; it tracks views, not reviews
**Fix:** Rename to `incrementViewCount`

### 2. **Missing Post Existence Check in View Count**
**Current:**
```javascript
const incrementReview = async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, {
        $inc: {views: 1}
    });
    res.json({message: 'View count incremented'})
}
```
**Issue:** Should check if post exists before updating
**Fix:**
```javascript
const incrementReview = async (req, res) => {
    const post = await BlogPost.findByIdAndUpdate(
        req.params.id, 
        {$inc: {views: 1}},
        {new: true}
    );
    if(!post) return res.status(404).json({message: 'Post not found'});
    res.json({message: 'View count incremented'});
}
```

### 3. **Duplicate Likes**
**Issue:** Users can like the same post multiple times
**Fix:** Use `$addToSet` or track liked users

### 4. **Typo in getPostBySlug**
**Bug:** `res.staatus(404)` instead of `res.status(404)`
**Fix:** Correct spelling to `status`

### 5. **Draft Count Bug in getAllPosts**
**Bug:** Both `draftCount` queries filter for `isDraft:false`
```javascript
BlogPost.countDocuments({isDraft:false}),  // Published count
BlogPost.countDocuments({isDraft:false})   // Should be isDraft:true for drafts
```
**Fix:**
```javascript
BlogPost.countDocuments({isDraft:true})   // Correct draft count
```

### 6. **Search Performance**
**Issue:** Using regex on large text fields is slow
**Better:** Use MongoDB text indexes for full-text search

---

## Best Practices for Implementation

### 1. URL Structure
```
/posts                           - List all posts
/posts?status=published&page=1   - Get published posts, page 1
/posts/:id                       - Get by ID (not recommended)
/posts/slug/:slug                - Get by slug (preferred)
/posts/tag/:tag                  - Get by tag
/posts/trending                  - Get trending posts
/posts/search?q=keyword          - Search posts
```

### 2. Draft Management Workflow
```javascript
// Save as draft
const saveDraft = async (postData) => {
  return axios.post('/posts', {
    ...postData,
    isDraft: true
  }, {headers: {Authorization: `Bearer ${token}`}});
};

// Publish draft
const publishPost = async (postId) => {
  return axios.put(`/posts/${postId}`, {
    isDraft: false
  }, {headers: {Authorization: `Bearer ${token}`}});
};
```

### 3. Tracking AI-Generated Content
```javascript
// When creating from AI
const createFromAI = async (aiContent) => {
  return axios.post('/posts', {
    ...aiContent,
    generatedByAI: true
  }, {headers: {Authorization: `Bearer ${token}`}});
};
```

### 4. Frontend Post Fetching
```javascript
// Get blog post for display
const getBlogPost = async (slug) => {
  const response = await axios.get(`/posts/slug/${slug}`);
  const post = response.data;
  
  // Track view
  axios.post(`/posts/${post._id}/view`);
  
  return post;
};
```

---

## Related Files
- Route Definition: `blogPostRoute.js`
- Controller Logic: `blogPostController.js`
- Post Model: `models/BlogPost.js`
- Authentication Middleware: `middlewares/authMiddlewares.js`

---

## Environment & Dependencies

### Required Database Indexes
```javascript
// In BlogPost schema
postSchema.index({slug: 1}, {unique: true});
postSchema.index({tags: 1});
postSchema.index({author: 1});
postSchema.index({isDraft: 1});

// Optional for better search performance
postSchema.index({title: 'text', content: 'text'});
```

### Required Packages
- `express` - Web framework
- `mongoose` - MongoDB ODM
- Authentication handled by `authMiddlewares`

---

## Summary

The Blog Post module provides comprehensive content management with:

✅ **CRUD Operations** - Create, read, update, delete posts  
✅ **Draft Management** - Save drafts and publish when ready  
✅ **Search & Filter** - By tag, status, keyword, or trending  
✅ **Engagement Tracking** - Views and likes  
✅ **AI Integration** - Track AI-generated content  
✅ **Role-Based Access** - Admin-only operations  
✅ **URL-Friendly Slugs** - SEO-optimized post URLs  

Recommended fixes include addressing found bugs, preventing duplicate likes, and improving search performance with text indexes.
