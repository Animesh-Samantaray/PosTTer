const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

//Dashboard Summary
// post /api/dashboard-summary
// access private only by admin
const getDashboardSummary=async(req , res)=>{
    try {
        const [totalPosts , drafts , published , totalComments , aiGenerated] = await Promise.all([
                    BlogPost.countDocuments(),
                    BlogPost.countDocuments({isDraft:true}),
                    BlogPost.countDocuments({isDraft:false}),
                    Comment.countDocuments(),
                     BlogPost.countDocuments({generatedByAI:true}),
                ]);

                const totalViewsAgg = await BlogPost.aggregate([
                    {$group:{_id:null , total:{$sum:'$views'}}}
                ])

                const totalLikesAgg = await BlogPost.aggregate([
                    {$group:{_id:null , total:{$sum:'$likes'}}}
                ])

                const totalViews=totalViewsAgg[0]?.total||0;
                const totalLikes=totalLikesAgg[0]?.total||0;


                const topPosts = await BlogPost.find({isDraft:false})
                .select('title coverImageUrl views likes')
                .sort({likes:-1,views:-1}).limit(5);

                const recentComments = await Comment.find().
                sort({createdAt : -1})
                .limit(5)
                .populate('author' , 'name profileImageUrl')
                .populate('post' , 'title coverImageUrl');

                const tagUsage = await BlogPost.aggregate([
                    {$unwind:'$tags'},
                    {$group:{_id:'$tags' , count:{$sum:1}}},
                    {$project:{tag:'$_id',count:1 , _id:0}},
                    {$sort:{count:-1}},
                ])

                    return res.json({
                        stats:{
                            totalPosts,
                            drafts,
                            published,
                            totalViews,
                            totalLikes,
                            totalComments,
                            aiGenerated
                        },
                        topPosts,
                        recentComments,
                        tagUsage
                    });
    } catch (error) {
        res.status(500).json({
            message:error.message,
            error:error.message
        })
    }
}

module.exports={getDashboardSummary}