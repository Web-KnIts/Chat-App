const mongoose = require('mongoose');

const conversationSchema =new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"sender's schema id not provided"]
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"receiver's schema id not provided"]
    },
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
},{
timestamps:true
})

module.exports = mongoose.model('Conversation',conversationSchema);