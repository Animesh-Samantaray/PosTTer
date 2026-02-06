const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const generateToken=(userId)=>{
    const token =  jwt.sign({id:userId},process.env.JWT_SECRET , {expiresIn:'7d'})
    return token
}

const registerUser=async( req , res)=>{
    try {
        const {name,email,password,profileImageUrl , bio , adminAccessToken} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                message:'User already exists .. Plz login'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password,salt);


        let role="member";

        if(adminAccessToken && adminAccessToken==process.env.ADMIN_ACCESS_TOKEN){
            role="admin"
        }

        const user = await User.create({
            name,email,password:pass,profileImageUrl,bio,role
        });

        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
           
            profileImageUrl:user.profileImageUrl,
            bio:user.bio,
            role,
            token:generateToken(user._id),
            message:'Register successful'
        })
    }catch (error) {
    console.error(error);
    return res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
}

const loginUser=async( req , res)=>{
    try {
        const {email,password} = req.body;
        if(email.trim().length==0 || password.trim().length==0){
            return res.status(400).json({
                message:"email and password are required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"User doesn't exist , Register plz..."
            })
        }

        const isMatch=bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            bio:user.bio,
            token:generateToken(user._id),
            message:`Welcome back ${user.name}`
        })
    }catch (error) {
    console.error(error);
    return res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
}


const getUserProfile=async( req , res)=>{
    try {
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({
                message:'User Not Authorized'
            })
        }
        const user = await User.findById(userId).select('-password');
        return res.status(200).json(user)
        
    }catch (error) {
    console.error(error);
    return res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
}


module.exports={registerUser,loginUser,getUserProfile};