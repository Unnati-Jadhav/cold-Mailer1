import User from "../model/auth.model.js"
import moongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const registerUser = async (req, res) => {
    try {
        const {name, email, password, domain , skills} = req.body
        if(!name || !email || !password){
            return res.status(400).json({ sucess : false,
                message : "All fields are required"
            })
        }
        if(password.length < 8){
            return res.status(400).json({ sucess : false,
                message : "Password must be at least 8 characters long"
            })
        }
       const existuser = await User.findOne({email})
       if(existuser){
        return res.status(400).json({ sucess : false,
                message : "user already exists"
            })
       }
       const hashedPassword = await bcrypt.hash(password, 10)
       const user = await User.create({
        name,
        email,
        password : hashedPassword,
        domain,
        skills
       })
       return res.status(201).json({
        sucess : true,
        message : "User created successfully",
        user
       })
    }catch(e){
        console.log(e.message)
        return res.status(500
        
        ).json({
        sucess : false,
        message : "internal server error",
        })
    }
}
export const loginUser = async (req, res)=> {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select('+password')
        if(!user){
            return res.status(400).json({
                sucess : false,
                message : "Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                sucess : false,
                message : "Invalid password"
            })
        } 
        const token = jwt.sign({userId : user._id},process.env.JWT_SECRET)
        
        return res.status(200).json({
                sucess : true,
                message : "login successful",
                user,
                token
            })
    }
    catch(e){
        return res.status(500).json({
                sucess : false,
                message : "Internal server error"
            })
    }
}