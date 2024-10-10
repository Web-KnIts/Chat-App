const getUserDetailFromToken = require('../../helper/getUserDetailFromToken');
const User = require('../../model/userSchema');


const updateUser = async(req,res)=>{

    // validation need to be done

    try
    {
        const token = req.cookies.token || "";
        const userDetails = await getUserDetailFromToken(token);
        const {firstname,lastname,profile_picture,gender,bio} = req.body;
        await User.updateOne({_id:userDetails._id},{firstname,lastname,profile_picture,bio,gender}); 
        const user = await getUserDetailFromToken(token)
        return res.status(200).json({
            success:true,
            message:"user updated successfully",
            data:user
        })
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Faild to update user details",
            error:err.message
        })
    }
}

module.exports = updateUser