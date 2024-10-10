const bcryptjs = require('bcryptjs');
const User = require('../../model/userSchema');
const jwt = require('jsonwebtoken')

const checkPassword = async(req,res)=>{

    const {password,userId} = req.body;
    if(!password)
    {
        return res.status(404).json({
            success:false,
            message:'Password field is missing'
        })
    }
    if(!userId)
    {
        return res.status(400).json({
            success:false,
            message:"User credentials are missing"
        })
    }
    try
    {
        const findUser = await User.findById(userId);
        const verifyPassword = await bcryptjs.compare(password,findUser.password)
        if(!verifyPassword)
        {
            return res.status(400).json({
                success:false,
                message:"incorrect password"
            })
        }

        const token = await jwt.sign({
            id:findUser._id,
            email:findUser.email
        },process.env.JWT_SECERET,{expiresIn:1*60*60*1000})

        const cookieOption = {
            httpOnly:true,
            secure:false
        }
        return res.cookie('token',token,cookieOption).status(200).json({
            success:true,
            message:"Login Successfull",
            accessToken:token
        })
    }catch(err)
    {
        console.log(err.message)
         return res.status(500).json({
            success:false,
            message:"error occured while validating password",
            error:err.message
         })
    }
}

module.exports = checkPassword;