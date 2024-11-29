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
    let decode;
    try
    {
        decode = await jwt.verify(token,process.env.JWT_SECERET)
    }
    catch(err){
        console.log(err)
    }
    if(!decode)
    {
        return null;
    }
    const userDetail = await User.findById(decode.id).select('-password')
    return userDetail;
}

module.exports = getUserDetailFromToken;