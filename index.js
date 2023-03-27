const express=require("express")
const { connection } = require("./db")
const { auth } = require("./middleware/authmiddleware")
const { postRouter } = require("./routes/post.routes")
const { userRouter } = require("./routes/user.routes")
const app=express()

require("dotenv").config()

app.use(express.json())

// app.get("/",(req,res)=>{
//     res.json("Home page")
// })
app.use("/users",userRouter)
app.use(auth)
app.use("/posts",postRouter)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("server connected to db");
    }catch(err){
        console.log(err);

    }
    console.log(`server running ${process.env.port}`);
})