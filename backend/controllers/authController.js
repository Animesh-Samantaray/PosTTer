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
            console.log("ADMIN ENV:", process.env.ADMIN_ACCESS_TOKEN);
            console.log("TOKEN FROM BODY:", adminAccessToken);

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

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        // ✅ Safe validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        email = email.trim().toLowerCase();
        password = password.trim();

        if (email.length === 0 || password.length === 0) {
            return res.status(400).json({
                message: "Email and password cannot be empty"
            });
        }

        // ✅ Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User doesn't exist. Please register."
            });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // ✅ Success
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            bio: user.bio,
            token: generateToken(user._id),
            message: `Welcome back ${user.name}`
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



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