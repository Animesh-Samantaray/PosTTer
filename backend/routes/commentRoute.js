const express=require('express');
const {addComment , getCommentsByPost,deleteComment,getAllComments} = require('../controllers/commentController');
const router=express.Router();
const {protect} = require('../middlewares/authMiddlewares');

router.post('/:postId' , protect , addComment);
router.get('/:postId'  , getCommentsByPost);
router.post('/'  , getAllComments);
router.delete('/:commentId' , protect , deleteComment);


module.exports=router;