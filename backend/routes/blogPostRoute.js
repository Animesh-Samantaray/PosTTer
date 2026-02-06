const express=require('express');


const {createPost , updatePost , deletePost , getAllPosts , getPostBySlug , getPostsByTag , searchPosts , incrementReview , likePost , getTopPosts} = require('../controllers/blogPostController');

const {protect} = require('../middlewares/authMiddlewares');

const router=express.Router();

const adminOnly=( req , res , next)=>{
    if(req.user && req.user.role=='admin'){
        next();
    }
    else return res.status(403).json({
        message:"Admin access only"
    })
}
router.post('/' , protect , adminOnly , createPost);
router.get('/',getAllPosts);
router.get('/slug/:slug' , getPostBySlug);
router.put('/:id' , protect , adminOnly , updatePost);
router.delete('/:id' , protect , adminOnly , deletePost);
router.get('/tag/:tag',getPostsByTag);
router.get('/search',searchPosts);
router.post('/:id/view',incrementReview);
router.post('/:id/like',protect,likePost);
router.get('/trending' , getTopPosts);


module.exports=router;