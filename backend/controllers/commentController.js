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
        const {postId} = req.params;
        const comments = await Comment.find({
            post:postId
        }).populate('author' , 'name  profileImageUrl').populate('post' , 'title coverImageUrl').sort({createdAt:1});

        const commentMap={};

        comments.forEach(comment=>{
            comment=comment.toObject();
            comment.replies=[];
            commentMap[comment._id]=comment; 
        })

        const nestedComments=[];
        comments.forEach(comment=>{
            const mapped =commentMap[comment._id];
            if(comment.parentComment){
                const parent = commentMap[comment.parentComment];
                if(parent){
                    parent.replies.push(mapped);
                }else{
                    nestedComments.push(mapped);
                }
            }else{
                    nestedComments.push(mapped);
            }
        })
        res.json(nestedComments)
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
        const {commentId} = req.params;
        const comment=await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({message:'Comment not found'});
        }
        await Comment.findByIdAndDelete(commentId);
        await Comment.deleteMany({
            parentComment:commentId
        })
        res.json({message:'Comment Deleted'})
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
        const comments = await Comment.find()
        .populate('author' , 'name profileImageUrl')
        .populate('post' , 'title coverImageUrl')
        .sort({createdAt:1});

        const commentMap={};

        comments.forEach(comment=>{
            comment=comment.toObject();
            comment.replies=[];
            commentMap[comment._id]=comment;
        })


        const nestedComments=[];
        comments.forEach(comment=>{
            const mapped =commentMap[comment._id];
            if(comment.parentComment){
                const parent = commentMap[comment.parentComment];
                if(parent){
                    parent.replies.push(mapped);
                }else{
                    nestedComments.push(mapped);
                }
            }else{
                    nestedComments.push(mapped);
            }
        })

        res.json(nestedComments);
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}



module.exports={addComment , getCommentsByPost,deleteComment,getAllComments}