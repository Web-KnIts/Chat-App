const express = require('express')
const {Server} = require('socket.io')
const http = require('http');
const getUserDetailFromToken = require('../helper/getUserDetailFromToken');
const Conversation = require('./../model/conversationSchema');
const Message  = require('./../model/messageSchema')
const User = require('./../model/userSchema');
const  mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
const app = express();

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:true,
        credentials: true
    }
})

const onlineStatus = new Set();

io.on('connection',async(socket)=>{
    console.log('User Connected with socket_id : ',socket.id);
    const token = socket.handshake.auth.token
    // (... sender ...) [Loged in user]
    const userDetail = await getUserDetailFromToken(token)

    if(!userDetail)
    {
        return null;
    }

    socket.join(userDetail?._id.toString())
    onlineStatus.add(userDetail?.id)
    
    socket.on('sidebar',async(currentUser)=>{
        // console.log(userDetail)
        const currentUserConversation = await Conversation.find({
            "$or": [
                { sender: userDetail._id },  
                { receiver: userDetail._id }
            ]
        }).sort({ updatedAt: -1 }).populate('message').populate('sender').populate('receiver').select('-password');
        const conversationMessages = currentUserConversation.map((conv)=>{
            const countUnseenMssg = conv.message.reduce((prev ,curr)=>prev + (curr.seen? 0:1),0)
            return {
                _id:conv?._id,
                sender:conv?.sender,
                receiver:conv?.receiver, 
                unseenMsg:countUnseenMssg,
                lastMsg:conv?.message[conv?.message.length - 1]
            }
        })

        socket.emit('conversation',conversationMessages)
    })

    socket.on('message-to-user',async(userId)=>{
        // (... reciver ...)[to whom message]
        console.log('userId ->',userId)
        const receiverDetails =  await User.findById(userId).select("-password");
        const payload = {
            firstname:receiverDetails.firstname,
            lastname:receiverDetails.lastname,
            email:receiverDetails.email,
            gender:receiverDetails.gender,
            profile_picture:receiverDetails.profile_picture,
            online:onlineStatus.has(userId)
        }
        socket.emit('receiver-details',payload)
    })
    io.emit('online-user-status',Array.from(onlineStatus))

    socket.on('load-message',async(data)=>{
        let conversationDetails = await Conversation.findOne({
            "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver,receiver:data?.sender}
            ]
        }).populate('message').sort({updatedAt:-1}).exec();
        if(conversationDetails === null)
        {
            io.to(data?.sender).emit('message',[])
            io.to(data?.receiver).emit('message',[])
        }
        else
        {
            io.to(data?.sender).emit('message',conversationDetails?.message)
            io.to(data?.receiver).emit('message',conversationDetails?.message) 
        }
    })

    //send-new-message
    socket.on('send-new-message',async(data)=>{
        console.log(data);
        let conversationDetails = await Conversation.findOne({
            "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver,receiver:data?.sender}
            ]
        })
        if(conversationDetails === null)
        {
            const createConverstaion = await Conversation({
                sender:data?.sender,
                receiver:data?.receiver,
            })
            conversationDetails = await createConverstaion.save();
        }   
        const messageDetails = await Message({
            text:data?.text,
            imageUrl:data?.imageUrl,
            videoUrl:data?.videoUrl,
            messgByUserId:data?.messgByUserId
        })

        const saveMessage = await messageDetails.save();
        const updatedConversation = await Conversation.updateOne({_id:conversationDetails?._id},{
            "$push":{message:saveMessage._id}
        })
        const getConversation = await Conversation.findOne({
            "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver,receiver:data?.sender}
            ]
        }).populate('message').sort({updatedAt:-1}).exec();
        console.log(getConversation)
      
        io.to(data?.sender).emit('message',getConversation.message)
        io.to(data?.receiver).emit('message',getConversation.message)    
    })

    socket.on('disconnect',(_)=>{
        console.log('User disconnected having socket_id : ',socket.id)
        onlineStatus.delete(userDetail.id)
        io.emit('online-user-status',Array.from(onlineStatus))
    })
})
module.exports = {
    app,
    server 
}
