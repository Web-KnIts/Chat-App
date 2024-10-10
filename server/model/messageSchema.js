const mongoose = require('mongoose');

const messageSchema =new mongoose.Schema({
    text:{
        type:String,
        default:'',
    },
    imageUrl:{
        type:String,
        default: '',
    },
    videoUrl:{
        type:String,
        default:''
    },
    messgByUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    seen:{
        type:Boolean,
        default:false,
    }
},{
timestamps:true
})

module.exports = mongoose.model('Message',messageSchema);