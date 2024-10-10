const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        trim:true,
        lowercase:true,
        required:[true ,"Provide First name "]
    },
    lastname:{
        type:String,
        trim:true,
        lowercase:true,
        // required:[true ,"Provide last name "]
    },
    gender:{
        type:String,
        enum:['male','female','others'],
        required:[true,"gender is missing"]
    },
    bio:{
        type:String,
        maxLength:200,
        default:"gigga nigga member"
    },
    email:{
        type:String,
        trim:true,
        required:[true,"Email not found"],
        lowercase:true,
        unique:true
    },
    password:
    {
        type:String,
        required:[true,"Password is missing"]
    },
    profile_picture:{
        type:String,
        required:true,
    }

},{
timestamps:true
});

userSchema.index({email:1});
module.exports = mongoose.model('User',userSchema);