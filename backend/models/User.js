const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,required:true
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        default:"https://i.pinimg.com/236x/d6/5c/fa/d65cfa8b47227df12fb97217e8f940e3.jpg"
    },
    bio:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:['admin' , 'member'] ,
        default:'member'
    }
},{timestamps:true})

module.exports = mongoose.model("User" , UserSchema);