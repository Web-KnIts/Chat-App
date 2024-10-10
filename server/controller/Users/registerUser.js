const bcryptjs = require("bcryptjs");
const User = require("../../model/userSchema");



const registerUser = async(req,res)=>{
    const {firstname,lastname,gender,email,password,confirmPassword} = req.body;

    let {profile_picture} = req.body
        
    profile_picture = profile_picture || `https://api.dicebear.com/5.x/initials/svg?seed=${firstname[0]}${lastname[0]}`

    if(!firstname && firstname.length < 3)
    {
        return res.status(400).json({
            success:false,
            message:"Firstname field is missing or less then 3 characters"
        })
    }
    if(!lastname && lastname.length < 3)
    {
        return res.status(400).json({
            success:false,
            message:"Lastname field is missing or less then 3 characters"
        })
    }
    if(!gender)
    {
        return res.status(400).json({
            success:false,
            message:"Gender field is missing or less then 3 characters"
        })
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    {
        return res.status(400).json({
            success:false,
            message:"email field is missing or invalid"
        })
    }
    if(!password && !confirmPassword)
    {
        return res.status(400).json({
            success:false,
            message:"password field or confirm password is misssing"
        })
    }
    if(password !== confirmPassword)
    {
        return res.status(400).json({
            success:false,
            message:"confirm password & password field doesn't match"
        })
    }
    try
    {
        const isUser = await User.countDocuments({email:email})
        if(isUser > 0)
        {
            return res.status(400).json({
                success:false,
                message:"User already Exists in the database"
            })
        }
        const hashPassword = await bcryptjs.hash(password,10)  
        console.log(hashPassword)
        const createUser = await User.create({
            firstname,lastname,gender,email,password:hashPassword,profile_picture
        })
        createUser.password = undefined
        return res.status(200).json({
            success:true,
            message:"User created successfully",
            data:createUser
        })
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Unable to create user at the movement , Try again later",
            error:err.message
        })
    }

}

module.exports = registerUser