const User = require('../../model/userSchema')
const getAllUserDetails = async(req,res)=>{
    try
    {
        const { search } = req.body;
        const arr = search.split(' ');

        if(search == "")
        {
            const usersAll = await User.find().select('-password');
                return res.status(200).json({
                    success:true,
                    message:"All users Fetched",
                    data:usersAll,
            })
        }

        let query ={
            email:"",
            firstname:"",
            lastname:"",
        }
        if(arr.length == 1 && (search.includes("@")))
        {
           query.email = new RegExp(search,"i","g")
        }
        else
        {
            query.firstname = new RegExp(arr[0],"i","g")
            query.lastname = new RegExp(arr[1],"i","g") || ""
        }
        const AllUser = await User.find({
            "$or":[
                {firstname:query.firstname},
                {firstname:query.firstname,lastname:query.lastname},
                {email:query.email}
            ]
        }).select('-password')
        return res.status(200).json({   
            success:true,
            message:"users Fetched",
            data:AllUser,

        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"faild to fetch all user at the movement",
            error:err.message
        })
    }
}

module.exports = getAllUserDetails;