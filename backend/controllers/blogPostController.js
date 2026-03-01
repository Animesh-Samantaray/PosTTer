const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment'); // Added for cascade delete

// Helper for slug generation
const generateSlug = (title) => title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

// Create new blog post
const createPost = async (req, res) => {
    try {
        const { title, content, coverImageUrl, tags, isDraft, generatedByAI } = req.body;
        const slug = generateSlug(title);

        const newPost = new BlogPost({
            title, slug, content, coverImageUrl, tags,
            author: req.user._id,
            isDraft,
            generatedByAI,
        });

        await newPost.save();
        res.status(201).json({ newPost, message: 'Post successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update existing post
const updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Auth check
        if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedData = req.body;
        if (updatedData.title) {
            updatedData.slug = generateSlug(updatedData.title);
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ message: 'Updated post', updatedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post + Associated Comments
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findById(id);
        
        if (!post) return res.status(404).json({ message: "Post doesn't exist" });

        await BlogPost.findByIdAndDelete(id);
        // Cascade delete: Remove all comments linked to this post
        await Comment.deleteMany({ post: id });

        res.json({ message: 'Post and associated comments deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts (with pagination and filtering)
const getAllPosts = async (req, res) => {
    try {
        const status = req.query.status || 'published';
        const page = parseInt(req.query.page || 1);
        const limit = 6; // Adjusted for better grid layout
        const skip = (page - 1) * limit;

        let filter = {};
        if (status === 'published') filter.isDraft = false;
        else if (status === 'draft') filter.isDraft = true;

        const posts = await BlogPost.find(filter)
            .populate('author', 'name profileImageUrl') // Match frontend field name
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
            BlogPost.countDocuments(filter),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({ isDraft: false }),
            BlogPost.countDocuments({ isDraft: true })
        ]);

        res.json({
            posts,
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            counts: { all: allCount, published: publishedCount, draft: draftCount }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single post by slug
const getPostBySlug = async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug })
            .populate('author', 'name profileImageUrl');

        if (!post) return res.status(404).json({ message: 'Post not found' }); // Fixed typo 'staatus'
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment view count
const incrementPostView = async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ message: 'View count incremented' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like a post (Fix: Increments likes, not views)
const likePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } }, // Changed from views to likes
            { new: true }
        );
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: 'Post liked', likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get trending posts
const getTopPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({ isDraft: false })
            .sort({ views: -1, likes: -1 })
            .limit(5);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get posts by tag
const getPostsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const posts = await BlogPost.find({ 
            tags: { $in: [tag] },
            isDraft: false 
        })
        .sort({ createdAt: -1 })
        .limit(10);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search posts
const searchPosts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const posts = await BlogPost.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } },
                { tags: { $in: [q] } }
            ],
            isDraft: false
        })
        .sort({ createdAt: -1 })
        .limit(20);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost, updatePost, deletePost, getAllPosts,
    getPostBySlug, getPostsByTag, searchPosts,
    incrementPostView, likePost, getTopPosts
};