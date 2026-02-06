const Comment=require('../models/Comment')
const BlogPost=require('../models/BlogPost')

// Add a comment
// post /api/comments/:postid
// private aaccess
const addComment=async(req ,res)=>{
    try {
        const {postId} = req.params;
        const {content,parentComment} = req.body;

        const post = await BlogPost.findById(postId);
        if(!post){
            return res.status(404).json({message:'Post not found'})
        }

        const comment=await Comment.create({
            post:postId,
            author:req.user._id,
            content,
            parentComment:parentComment || null
        })

        await comment.populate('author' , 'name profileImageUrl');

        res.status(201).json(comment);
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


// Get all comments for blog post 
// get /api/comments/:postid
// public aaccess
const getCommentsByPost=async(req ,res)=>{
    try {
        
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


// delete comment 
// delete /api/comments/:commentId
// private aaccess
const deleteComment=async(req ,res)=>{
    try {
        
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


// Get all comments
// get /api/comments/
// public aaccess
const getAllComments=async(req ,res)=>{
    try {
        
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}



module.exports={addComment , getCommentsByPost,deleteComment,getAllComments}