const express=require('express');

const {registerUser , loginUser , getUserProfile}=require('../controllers/authController');

const {protect} = require('../middlewares/authMiddlewares')
const upload = require('../middlewares/uploadMiddlewares')
const router=express.Router();


router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/profile',protect,getUserProfile);
router.post('/image-upload',upload.single('image'),(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                image:'No file uploaded'
            })
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

        res.status(200).json({imageUrl})
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:error.message
        })
    }
})
module.exports=router;