const BlogPost = require('../models/BlogPost');
const mongoose=require('mongoose');


// Create new blog post
// method = post , /api/posts
// access = private(admin only)
const  createPost=async(req ,res)=>{
    try {
        
        const {title,content , coverImageUrl , tags , isDraft , generatedByAI}=req.body;
        const slug=title.toLowerCase().replace(/ /g,"-").replace(/[^\w-]+/g , "");

        const newPost = new BlogPost({
            title , slug,content , coverImageUrl ,tags,author:req.user._id , isDraft , generatedByAI,
        });

        await newPost.save();
        res.status(201).json({newPost , message:'Post successful'}) 
    } catch (error) {
        res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}

// Update existing post
// method = put , /api/posts/:id
// access = private(admin  or author)
const  updatePost=async(req ,res)=>{
    try {
         const post = await BlogPost.findById(req.params.id);
         if(!post){
            return res.status(404).json({
                message:'Post not found'
            })
         }

         if(post.author.toString() !== req.user._id.toString() && !req.user.isAdmin){
            return res.status(403).json({
                message:'You are not authorized to update'
            })
         }


         const updatedData = req.body;
         if(updatedData.title){
            updatedData.slug=updatedData.title.toLowerCase().replace(/ /g,"-").replace(/[^\w-]+/g , "");
         }

         const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id , updatedData,{new:true});

         return res.status(200).json({
            message:'Updated post',
            updatedPost
         })

    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}

// Delete existing post
// method = delete , /api/posts/:id
// access =public
const  deletePost=async(req ,res)=>{
    try {
        const id=req.params.id;
        const post = await BlogPost.findById(id);
        if(!post){
            return  res.status(400).json({
                message:"Post doesn't exist"
            })
        }
      await BlogPost.findByIdAndDelete(id);
      
            return res.json({message:'Post deleted'})
      
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}

// Get blog posts by status
// method = get , /api/posts?status=published|draft|all&page=1
// access = public
const  getAllPosts=async(req ,res)=>{
    try {
        const status = req.query.status || 'published';
        const page=parseInt(req.query.page || 1);
        const limit=5;
        const skip = (page-1)*limit;


        let filter={};
        if(status=='published') filter.isDraft=false;
        else if(status=='draft') filter.isDraft=true;

        const posts = await BlogPost.find(filter)
        .populate('author' , 'name profileUrl')
        .sort({updatedAt:-1})
        .skip(skip)
        .limit(limit);

        const [totalCount , allCount , publishedCount , draftCount] = await Promise.all([
            BlogPost.countDocuments(filter),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({isDraft:false}),
            BlogPost.countDocuments({isDraft:false})
        ]);


        res.json({
            posts,
            page ,
            totalPages:Math.ceil(totalCount/limit),
            totalCount,
            counts:{
                all:allCount,
                published:publishedCount,
                draft:draftCount
            }
        });

         
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}



// Get a single blog post by slug
// method = get , /api/posts/:slug
// access = public
const  getPostBySlug=async(req ,res)=>{
    try {
        const post = await BlogPost.findOne({slug:req.params.slug}).populate(
            'author',
            'name profileImageUrl'
        )
        if(!post) return res.staatus(404).json({message:'Post not found'});
        res.json(post)
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}



// Get   blog posts by tag
// method = get , /api/posts/tag/:tag
// access = public
const  getPostsByTag=async(req ,res)=>{
    try {
        const posts = await BlogPost.find({
            tags:req.params.tag,
            isDraft:false
        }).populate('author' , 'name profileImageUrl')

        if(!posts){
            return res.status(404).json({
                message:'No post found with this tag'
            })
        }
        return res.json(posts);
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


// search post by title or content
// method = get , /api/posts/search?q=keyword
// access = public
const  searchPosts=async(req ,res)=>{
    try {
        const q = req.query.q;
        const posts = await BlogPost.find({
            isDraft:false,
            $or:[
                {title:{$regex:q , $options:'i'}},
                {content:{$regex:q , $options:'i'}}, 
            ],
        }).populate('author' , 'name profileImageUrl');
        res.json(posts);
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


// Increment post view count
// method = put , /api/posts/:id/view
// access = public
const  incrementReview=async(req ,res)=>{
    try {
        await BlogPost.findByIdAndUpdate(req.params.id , {
            $inc:{views:1}
        });
        res.json({message:'View count incremented'})
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


// Like a post
// method = put , /api/posts/:id/like
// access = public
const  likePost=async(req ,res)=>{
    try {
        await BlogPost.findByIdAndUpdate(req.params.id , {
            $inc:{likes:1}
        });
        res.json({message:'Like added'})
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}

//get posts of logged-in users
// method = get , /api/posts/trending
// access = private
const  getTopPosts=async(req ,res)=>{
    try {
        const posts = await BlogPost.find({
            isDraft:false
        }).sort({
            views:-1 , likes:-1
        }).limit(5);

        res.json(posts);
    } catch (error) {
         res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}


module.exports={
    createPost,updatePost,deletePost,getAllPosts,getPostBySlug,getPostsByTag,searchPosts,incrementReview,likePost,getTopPosts
}