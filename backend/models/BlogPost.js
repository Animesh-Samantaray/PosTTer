const mongoose=require('mongoose')

const BlogPostSchema=new mongoose.Schema({
    title:{type:String,required:true},
    slug:{type:String , required:true , unique:true},
    content:{type:String,required:true},
    coverImageUrl:{
        type:String,
        default:"https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="
    },
    tags:[{type:String}],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isDraft:{
        type:Boolean,default:false
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    generatedByAI:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


module.exports = mongoose.model('BlogPost',BlogPostSchema);

