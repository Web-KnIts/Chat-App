const User = require('../model/userSchema')
const jwt = require('jsonwebtoken')


const getUserDetailFromToken = async(token)=>{
    if(!token)
    {
        return {
            message:" session out",
            logout:true
        }
    }
    const decode = await jwt.verify(token,process.env.JWT_SECERET)
    const userDetail = await User.findById(decode.id).select('-password')
    return userDetail;
}

module.exports = getUserDetailFromToken;