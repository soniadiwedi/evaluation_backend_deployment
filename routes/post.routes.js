const express=require("express")
const { PostModel } = require("../models/post.model")
const postRouter=express.Router()
const jwt =require("jsonwebtoken")

postRouter.post("/add",async(req,res)=>{
    const data=req.body
    try{
        const newpost=new PostModel(data)
        await newpost.save()
        res.status(200).json(newpost)
    }catch(err){
        res.status(400).json({"msg":err.message})
    }
})

postRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"mona")
    try{
        if(decoded){
            const userID=decoded.userID
            const q={userID}
            const device=req.query.device
            if(device){
                q.device=device
            }
        const data=await PostModel.find(q)
        res.status(200).json(data)
        }
        
    }catch(err){

        res.status(400).json({"msg":err.message})

    }
})

postRouter.get("/top",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"mona")
    try{
        if(decoded){
            const filter={userID:decoded.userID}
            const device=req.query.device
            if(device){
                filter.device=req.query.device
            }
            let post=await PostModel.find(filter).sort({no_of_comments:-1}).limit(3)
            res.status(200).json(post)
        }
    }catch(err){
        res.status(400).json({"msg":err.message})
    }
})

postRouter.patch("/update/:id",async(req,res)=>{
    const id=req.params.id
    const payload=req.body
    const userid=req.body.userID
    try{
        let data=await PostModel.findByIdAndUpdate({_id:id,userID:userid},{$set:payload})
        res.status(200).json(data)
    }catch(err){
        res.status(400).json({"msg":err.message})

    }
})

postRouter.delete("/delete/:id",async(req,res)=>{
    const id=req.params.id
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"mona")
    try{
        if(decoded){
            await PostModel.findByIdAndDelete({_id:id})
            res.status(200).json({"msg":"post has been deleted"})

        }
    }catch(err){
        res.status(400).json({"msg":err.message})

    }

})
module.exports={postRouter}

// "title" : "mi",
// "body" : "smart led",
// "device" : "Mobile",
// "no_of_comments" : 5