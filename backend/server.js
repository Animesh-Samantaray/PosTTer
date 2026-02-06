const dotenv=require('dotenv')
const express=require('express')
const cors=require('cors')
const path=require('path')
const connectDB=require('./config/db');


dotenv.config();


const authRoute = require('./routes/authRoute')
const blogPostRoute = require('./routes/blogPostRoute')
const commentRoute = require('./routes/commentRoute')
const dashboardRoute = require('./routes/dashboardRoute')
const aiRoute = require('./routes/aiRoute')


const app= express();


app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}));


connectDB();

app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/posts',blogPostRoute);
app.use('/api/comments',commentRoute);
// app.use('/api/dashboard-summary',dashboardRoute)

app.use('/uploads',express.static(path.join(
    __dirname,"uploads"
),{}))

const port = process.env.PORT || 5000

app.listen(port , (req,res)=>{
    console.log('Backend server is runing at port '+port)
})