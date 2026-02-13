# Dashboard Routes Documentation

## Overview
The Dashboard module provides administrative analytics and insights for blog platform management. It offers a comprehensive summary of platform metrics including post statistics, engagement metrics, content trends, and recent activity. This endpoint is restricted to admin users and provides real-time data for monitoring blog performance.

---

## Module Structure

### File: `dashboardRoute.js`
Defines the dashboard API endpoint with role-based access control for admin users only.

### File: `dashboardController.js`
Contains aggregation pipelines and database queries to compile comprehensive platform statistics and analytics data.

---

## Key Concepts

### Parallel Query Execution
Uses `Promise.all()` to execute multiple independent database queries simultaneously for performance:

```javascript
const [totalPosts, drafts, published, totalComments, aiGenerated] = await Promise.all([
    BlogPost.countDocuments(),
    BlogPost.countDocuments({isDraft:true}),
    BlogPost.countDocuments({isDraft:false}),
    Comment.countDocuments(),
    BlogPost.countDocuments({generatedByAI:true}),
]);
```

**Benefit:** Reduces total query time from sum of all queries to time of slowest query.

### MongoDB Aggregation Pipeline
Uses `$aggregate()` for efficient server-side calculations:
```javascript
BlogPost.aggregate([
    {$group: {_id: null, total: {$sum: '$views'}}}
])
```

**Benefit:** Computation happens in database, reducing data transfer and app processing.

### Tag Analysis
Uses `$unwind` and `$group` to analyze tag usage patterns:
```javascript
{$unwind: '$tags'},                    // Expand array elements
{$group: {_id: '$tags', count: {$sum: 1}}},  // Count per tag
{$sort: {count: -1}}                   // Sort by frequency
```

---

## API Endpoints

### 1. **Get Dashboard Summary**
**Route:** `GET /dashboard`  
**Access Level:** ⚠️ **PROTECTED & ADMIN ONLY**

#### Purpose
Provides comprehensive analytics and statistics about the blog platform including post metrics, engagement data, content analytics, and recent activity.

#### Request Headers
```
Authorization: Bearer {token}
```
*Token must belong to user with role: "admin"*

#### Response (Success - 200)
```json
{
  "stats": {
    "totalPosts": "number - All posts (draft & published)",
    "drafts": "number - Posts in draft status",
    "published": "number - Published/live posts",
    "totalViews": "number - Accumulated views across all posts",
    "totalLikes": "number - Accumulated likes across all posts",
    "totalComments": "number - Total comments across all posts",
    "aiGenerated": "number - Posts created using AI"
  },
  "topPosts": [
    {
      "_id": "ObjectId",
      "title": "string",
      "coverImageUrl": "string",
      "views": "number",
      "likes": "number"
    }
  ],
  "recentComments": [
    {
      "_id": "ObjectId",
      "content": "string",
      "author": {
        "_id": "ObjectId",
        "name": "string",
        "profileImageUrl": "string"
      },
      "post": {
        "_id": "ObjectId",
        "title": "string",
        "coverImageUrl": "string"
      },
      "createdAt": "ISO timestamp"
    }
  ],
  "tagUsage": [
    {
      "tag": "string",
      "count": "number"
    }
  ]
}
```

#### How It Works

##### Step 1: Parallel Statistical Queries
```javascript
const [totalPosts, drafts, published, totalComments, aiGenerated] = await Promise.all([
    BlogPost.countDocuments(),                    // All posts
    BlogPost.countDocuments({isDraft:true}),     // Draft posts
    BlogPost.countDocuments({isDraft:false}),    // Published posts
    Comment.countDocuments(),                    // All comments
    BlogPost.countDocuments({generatedByAI:true}) // AI-generated posts
]);
```

**Execution:** All 5 queries run simultaneously, significantly faster than sequential calls.

##### Step 2: View Count Aggregation
```javascript
const totalViewsAgg = await BlogPost.aggregate([
    {$group: {_id: null, total: {$sum: '$views'}}}
])
const totalViews = totalViewsAgg[0]?.total || 0;
```

**Process:**
- `$group`: Groups all documents together (`_id: null`)
- `$sum: '$views'`: Sums all view counts
- Optional chaining: Returns 0 if no results

**Why Aggregation?** More efficient than fetching all posts and summing in application code.

##### Step 3: Like Count Aggregation
```javascript
const totalLikesAgg = await BlogPost.aggregate([
    {$group: {_id: null, total: {$sum: '$likes'}}}
])
const totalLikes = totalLikesAgg[0]?.total || 0;
```

Similar to views aggregation using server-side computation.

##### Step 4: Top Posts Retrieval
```javascript
const topPosts = await BlogPost.find({isDraft:false})
    .select('title coverImageUrl views likes')
    .sort({likes:-1, views:-1})
    .limit(5);
```

**Process:**
1. **Filter:** Only published posts
2. **Select:** Project specific fields (excludes content for performance)
3. **Sort:** Primary by likes (desc), secondary by views (desc)
4. **Limit:** Return only top 5

**Use Case:** Identify most popular/engaging content.

##### Step 5: Recent Comments Retrieval
```javascript
const recentComments = await Comment.find()
    .sort({createdAt: -1})
    .limit(5)
    .populate('author', 'name profileImageUrl')
    .populate('post', 'title coverImageUrl');
```

**Process:**
1. **Find:** Get all comments
2. **Sort:** Newest first (`createdAt: -1`)
3. **Limit:** Last 5 comments
4. **Populate:** Include author and post details

**Use Case:** Monitor latest community engagement.

##### Step 6: Tag Usage Analysis
```javascript
const tagUsage = await BlogPost.aggregate([
    {$unwind: '$tags'},                           // Expand array elements into documents
    {$group: {_id: '$tags', count: {$sum:1}}},  // Count occurrences per tag
    {$project: {tag: '$_id', count:1, _id:0}},  // Rename field and exclude _id
    {$sort: {count:-1}}                          // Sort by frequency descending
])
```

**Detailed Pipeline:**

| Stage | Input | Operation | Output |
|-------|-------|-----------|--------|
| Input | `{tags: [react, nodejs]}` | Start | - |
| `$unwind` | Document with array | Create document per array element | Two documents: {tag: react}, {tag: nodejs} |
| `$group` | Two documents | Group by tag, count each | {_id: react, count: N}, {_id: nodejs, count: M} |
| `$project` | Grouped data | Rename _id to tag | {tag: react, count: N} |
| `$sort` | Transformed data | Order by count desc | [react:10, nodejs:8, ...] |

**Use Case:** Identify trending topics and content categories.

#### Error Handling
- **401 Unauthorized:** User not authenticated (no JWT token)
- **403 Forbidden:** User authenticated but not admin
- **500 Internal Server Error:** Database query error

#### Access Control
```javascript
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role == 'admin'){
        next();
    }
    else res.status(403).json({message: 'Admin access only'})
}
```

**Check Points:**
1. `req.user` must exist (verified by `protect` middleware)
2. `req.user.role` must equal `"admin"`

#### Example Usage

```javascript
// Request
GET /dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (Success - 200)
{
  "stats": {
    "totalPosts": 47,
    "drafts": 5,
    "published": 42,
    "totalViews": 15823,
    "totalLikes": 1247,
    "totalComments": 892,
    "aiGenerated": 12
  },
  "topPosts": [
    {
      "_id": "65post001",
      "title": "Node.js Best Practices 2024",
      "coverImageUrl": "https://example.com/nodejs.jpg",
      "views": 1245,
      "likes": 189
    },
    {
      "_id": "65post002",
      "title": "React Performance Optimization",
      "coverImageUrl": "https://example.com/react.jpg",
      "views": 987,
      "likes": 156
    },
    {
      "_id": "65post003",
      "title": "MongoDB Advanced Queries",
      "coverImageUrl": "https://example.com/mongodb.jpg",
      "views": 756,
      "likes": 142
    },
    {
      "_id": "65post004",
      "title": "Express.js API Design",
      "coverImageUrl": "https://example.com/express.jpg",
      "views": 654,
      "likes": 128
    },
    {
      "_id": "65post005",
      "title": "JavaScript ES6+ Features",
      "coverImageUrl": "https://example.com/js.jpg",
      "views": 523,
      "likes": 95
    }
  ],
  "recentComments": [
    {
      "_id": "65comment001",
      "content": "This article really helped me!",
      "author": {
        "_id": "65user001",
        "name": "Alice Johnson",
        "profileImageUrl": "https://example.com/alice.jpg"
      },
      "post": {
        "_id": "65post001",
        "title": "Node.js Best Practices 2024",
        "coverImageUrl": "https://example.com/nodejs.jpg"
      },
      "createdAt": "2024-02-08T14:30:00Z"
    },
    {
      "_id": "65comment002",
      "content": "Great explanation of async/await!",
      "author": {
        "_id": "65user002",
        "name": "Bob Smith",
        "profileImageUrl": "https://example.com/bob.jpg"
      },
      "post": {
        "_id": "65post001",
        "title": "Node.js Best Practices 2024",
        "coverImageUrl": "https://example.com/nodejs.jpg"
      },
      "createdAt": "2024-02-08T14:15:00Z"
    },
    {
      "_id": "65comment003",
      "content": "Can you elaborate on hooks?",
      "author": {
        "_id": "65user003",
        "name": "Charlie Brown",
        "profileImageUrl": "https://example.com/charlie.jpg"
      },
      "post": {
        "_id": "65post002",
        "title": "React Performance Optimization",
        "coverImageUrl": "https://example.com/react.jpg"
      },
      "createdAt": "2024-02-08T14:00:00Z"
    },
    {
      "_id": "65comment004",
      "content": "Very useful information",
      "author": {
        "_id": "65user004",
        "name": "Diana Prince",
        "profileImageUrl": "https://example.com/diana.jpg"
      },
      "post": {
        "_id": "65post003",
        "title": "MongoDB Advanced Queries",
        "coverImageUrl": "https://example.com/mongodb.jpg"
      },
      "createdAt": "2024-02-08T13:45:00Z"
    },
    {
      "_id": "65comment005",
      "content": "Thanks for sharing this knowledge!",
      "author": {
        "_id": "65user005",
        "name": "Evan Davis",
        "profileImageUrl": "https://example.com/evan.jpg"
      },
      "post": {
        "_id": "65post004",
        "title": "Express.js API Design",
        "coverImageUrl": "https://example.com/express.jpg"
      },
      "createdAt": "2024-02-08T13:30:00Z"
    }
  ],
  "tagUsage": [
    {
      "tag": "nodejs",
      "count": 12
    },
    {
      "tag": "react",
      "count": 10
    },
    {
      "tag": "javascript",
      "count": 9
    },
    {
      "tag": "mongodb",
      "count": 7
    },
    {
      "tag": "backend",
      "count": 6
    },
    {
      "tag": "frontend",
      "count": 5
    }
  ]
}
```

#### Frontend Implementation

```javascript
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Line, Bar, Pie} from 'react-chartjs-2';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('/dashboard', {
          headers: {Authorization: `Bearer ${token}`}
        });
        setDashboard(response.data);
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading Dashboard...</div>;
  if (!dashboard) return <div>Failed to load dashboard</div>;

  const {stats, topPosts, recentComments, tagUsage} = dashboard;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard title="Total Posts" value={stats.totalPosts} />
        <StatCard title="Published" value={stats.published} />
        <StatCard title="Drafts" value={stats.drafts} />
        <StatCard title="Total Views" value={stats.totalViews} />
        <StatCard title="Total Likes" value={stats.totalLikes} />
        <StatCard title="Total Comments" value={stats.totalComments} />
        <StatCard title="AI Generated" value={stats.aiGenerated} />
      </div>

      {/* Top Posts Section */}
      <section className="top-posts">
        <h2>Top Performing Posts</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
            {topPosts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Recent Comments Section */}
      <section className="recent-comments">
        <h2>Recent Comments</h2>
        {recentComments.map(comment => (
          <div key={comment._id} className="comment-item">
            <img src={comment.author.profileImageUrl} alt={comment.author.name} />
            <div>
              <strong>{comment.author.name}</strong>
              <p>{comment.content}</p>
              <small>On: {comment.post.title}</small>
            </div>
          </div>
        ))}
      </section>

      {/* Tag Usage Chart */}
      <section className="tag-usage">
        <h2>Tag Usage</h2>
        <BarChart 
          labels={tagUsage.map(t => t.tag)}
          data={tagUsage.map(t => t.count)}
        />
      </section>
    </div>
  );
};

const StatCard = ({title, value}) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

export default AdminDashboard;
```

#### Frontend - Styled Component Example
```javascript
import styled from 'styled-components';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    opacity: 0.9;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: bold;
    margin: 0;
  }
`;
```

---

## Data Insights & Metrics Explained

### Statistics (Stats)

| Metric | Purpose | Use Case |
|--------|---------|----------|
| `totalPosts` | Count of all posts | Overall platform size |
| `published` | Count of live posts | Content availability |
| `drafts` | Count of draft posts | Content pipeline |
| `totalViews` | Sum of all post views | Platform traffic |
| `totalLikes` | Sum of all post likes | Content engagement |
| `totalComments` | Count of all comments | Community involvement |
| `aiGenerated` | Posts created via AI | AI usage tracking |

### Key Metrics Calculation

**Draft Rate:**
```
draftRate = (drafts / totalPosts) * 100
```
If high, indicates slow publishing or high content review needs.

**Engagement Rate:**
```
engagementRate = (totalLikes + totalComments) / totalViews * 100
```
Percentage of viewers who engage with content.

**Average Views per Post:**
```
avgViewsPerPost = totalViews / published
```
Average reach of each published post.

**AI Adoption:**
```
aiAdoption = (aiGenerated / totalPosts) * 100
```
Percentage of posts created using AI assistance.

---

## Database Schema Requirements

### BlogPost Model Fields Used
```javascript
{
  isDraft: Boolean,
  views: Number,
  likes: Number,
  generatedByAI: Boolean,
  tags: [String],
  title: String,
  coverImageUrl: String
}
```

### Comment Model Fields Used
```javascript
{
  content: String,
  author: ObjectId (references User),
  post: ObjectId (references BlogPost),
  createdAt: Date
}
```

---

## Middleware & Security

### Protected Access
```javascript
router.get('/', protect, adminOnly, getDashboardSummary)
```

**Two-layer security:**
1. **`protect` middleware** - Validates JWT token
2. **`adminOnly` middleware** - Checks user role

### Authorization Flow
```
Request with JWT Token
    ↓
Middleware: JWT Validation (protect)
    ↓
Middleware: Admin Role Check (adminOnly)
    ↓
If both pass: Execute getDashboardSummary
    ↓
If auth fails: Return 401
    ↓
If not admin: Return 403
```

---

## Performance Optimization Tips

### 1. Query Parallelization
✅ **Currently Implemented:** Uses `Promise.all()` for count queries
- Reduces query time significantly
- Executes 5 queries simultaneously instead of sequentially

### 2. Aggregation Pipeline
✅ **Currently Implemented:** Uses `$aggregate()` for views and likes
- Server-side computation is more efficient
- Reduces data transfer

### 3. Field Projection
✅ **Currently Implemented:** `.select()` on top posts
- Returns only needed fields (title, views, likes, image)
- Excludes large content field

### 4. Index Recommendations
```javascript
// BlogPost schema
blogPostSchema.index({isDraft: 1});
blogPostSchema.index({generatedByAI: 1});
blogPostSchema.index({views: -1});
blogPostSchema.index({likes: -1});

// Comment schema
commentSchema.index({createdAt: -1});
```

### 5. Caching Strategy
Consider implementing Redis caching for dashboard:
```javascript
// Cache dashboard for 5 minutes
const CACHE_KEY = 'dashboard_summary';
const CACHE_TTL = 300; // 5 minutes

// Check cache first
const cached = await redis.get(CACHE_KEY);
if(cached) return JSON.parse(cached);

// If not cached, fetch and cache
const dashboard = await getDashboardData();
await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(dashboard));

return dashboard;
```

### 6. Pagination for Large Datasets
Consider paginating top posts and recent comments:
```javascript
const topPosts = await BlogPost.find({isDraft:false})
    .select('title coverImageUrl views likes')
    .sort({likes:-1, views:-1})
    .limit(10)  // Increase from 5 if needed
    .skip((page - 1) * 10);
```

---

## Common Use Cases

### 1. KPI Monitoring
```javascript
// Admin monitors key metrics
- Total platform reach (totalViews)
- Content production rate (totalPosts)
- Community engagement (totalComments)
- AI adoption (aiGenerated)
```

### 2. Content Strategy
```javascript
// Identify what works
- Top posts identify popular topics
- Tag usage shows trending categories
- Views/likes indicate audience interests
```

### 3. Platform Health Check
```javascript
// Quick assessment
- Draft rate shows content pipeline health
- Comment activity shows community engagement
- Recent comments reveal discussion quality
```

### 4. AI Usage Tracking
```javascript
// Monitor AI feature adoption
- Track percentage of AI-generated posts
- Analyze performance of AI vs manual posts
- Measure user adoption rate
```

---

## Potential Enhancements

### 1. Date Range Filtering
```javascript
router.get('/', protect, adminOnly, async (req, res) => {
  const {startDate, endDate} = req.query;
  
  const dateFilter = startDate && endDate ? {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } : {};
  
  // Use dateFilter in queries
});
```

### 2. Author-Specific Analytics
```javascript
// Get stats for specific author
const authorStats = await BlogPost.aggregate([
  {$match: {author: userId}},
  {$group: {
    _id: null,
    posts: {$sum: 1},
    views: {$sum: '$views'},
    likes: {$sum: '$likes'}
  }}
]);
```

### 3. Time-Series Data
```javascript
// Track metrics over time
const viewsTrend = await BlogPost.aggregate([
  {$match: {createdAt: {$gte: thirtyDaysAgo}}},
  {$group: {
    _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
    views: {$sum: '$views'}
  }},
  {$sort: {_id: 1}}
]);
```

### 4. Engagement Breakdown
```javascript
// Detailed engagement metrics
const engagementMetrics = await Comment.aggregate([
  {$group: {
    _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
    comments: {$sum: 1},
    uniqueAuthors: {$addToSet: '$author'}
  }},
  {$project: {
    _id: 1,
    comments: 1,
    uniqueAuthors: {$size: '$uniqueAuthors'}
  }}
]);
```

### 5. Content Quality Scoring
```javascript
// Calculate engagement score per post
const posts = await BlogPost.find({isDraft: false})
  .addFields({
    engagementScore: {
      $add: [
        {$divide: ['$likes', {$max: [1, '$views']}]},
        {$divide: ['$comments', {$max: [1, '$views']}]}
      ]
    }
  })
  .sort({engagementScore: -1});
```

---

## Related Files
- Route Definition: `dashboardRoute.js`
- Controller Logic: `dashboardController.js`
- User Model: `models/User.js`
- Blog Post Model: `models/BlogPost.js`
- Comment Model: `models/Comment.js`
- Authentication Middleware: `middlewares/authMiddlewares.js`

---

## Environment & Dependencies

### Required Packages
- `express` - Web framework
- `mongoose` - MongoDB ODM with aggregation support
- JWT authentication (handled by `authMiddlewares`)

### Required Database Collections
- **BlogPost** - Must have views, likes, isDraft, tags, generatedByAI fields
- **Comment** - Must have author, post references and createdAt timestamp

### Required Indexes (Performance)
```javascript
// BlogPost indexes
db.blogposts.createIndex({isDraft: 1})
db.blogposts.createIndex({generatedByAI: 1})

// Comment indexes
db.comments.createIndex({createdAt: -1})
```

---

## Summary

The Dashboard module provides admin-only analytics featuring:

✅ **Comprehensive Statistics** - Posts, views, likes, comments, AI usage  
✅ **Performance Metrics** - Top posts by engagement  
✅ **Community Insights** - Recent comments and authors  
✅ **Content Analytics** - Tag usage and trending topics  
✅ **Efficient Queries** - Parallel execution and aggregation pipelines  
✅ **Secure Access** - JWT + admin role verification  

**Key Strengths:**
- Uses MongoDB aggregation for efficient computation
- Parallel queries via Promise.all() for performance
- Comprehensive data for strategic decisions
- Real-time statistics without caching overhead

**Recommended Improvements:**
- Add Redis caching for frequently accessed data
- Implement date range filtering for historical analysis
- Add time-series metrics for trend analysis
- Consider pagination for large datasets
- Add author-specific analytics
