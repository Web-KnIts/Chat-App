const getUserDetailFromToken = require('../../helper/getUserDetailFromToken');
const User = require('../../model/userSchema')


const userDetails = async(req,res)=>{
    try
    {
        const token = req.cookies.token || " ";
        const userDetail = await getUserDetailFromToken(token);
        return res.status(200).json({
            success:true,
            message:"User fecthed successfully",
            data:userDetail
        });
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"faild to fetch User",
            error:err.message
        })
    }
}
module.exports = userDetails;