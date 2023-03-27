const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;

  try {
    const olduser=await UserModel.exists({email})
    if(olduser){
        res.status(200).json("User already exist, please login")
    }else{
        bcrypt.hash(password,4,async(err,hash)=>{
            const newuser=new UserModel({email,password:hash,name,gender,age,city,is_married})
            await newuser.save()
            res.status(200).json(newuser)
        })
    }
  } catch (err) {
    res.status(400).json({"msg":err.message})
  }
});


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    res.status(200).json({"msg":"Login Succesfull","token":jwt.sign({"userID":user._id},"mona")})
                }else{
                    res.status(400).json({"msg":"wrong password"})
                }
            })
        }
    }catch(err){
        res.status(400).json({"msg":err.message})
    }

})
module.exports={userRouter}

// "name": "aman",
// "email": "aman@gmail.com",
//   "gender": "male",
// "password": "123",
//   "age": 20,
// "city": "delhi",
// "is_married": false
