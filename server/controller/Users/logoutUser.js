const User = require('../../model/userSchema')

const logoutUser = async(req,res)=>{
    try
    {
        return res.cookies("token","",{
            httpOnly:true,
            secure:true
        }).status(200).json({
            success:true,
            message:""
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Logout faild due to some internal server error",
            error:err.message
        })
    }
}
module.exports = logoutUser