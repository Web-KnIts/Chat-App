const User = require('../../model/userSchema');


const checkUserEmail = async( req,res) =>{
    const {email} = req.body
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        {
            return res.status(400).json({
                success:false,
                message:"email field is missing or invalid"
            })
        }

    try
    {
        const checkUser = await User.findOne({email}).select('-password')
        if(!checkUser)
        {
            return res.status(400).json({
                success:false,
                message:'User not exist',
            })
        }
        return res.status(200).json({
            success:true,
            message:"email verified",
            data:checkUser
        })
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:err.message
        })
    }
}

module.exports = checkUserEmail;