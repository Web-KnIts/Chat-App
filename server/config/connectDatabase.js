const mongoose = require('mongoose')

const connectWithDatabase = async()=>{
    try{
        await mongoose.connect(process.env.MONGODATABASE_URI);
        const connectionInstance = mongoose.connection;
        connectionInstance.on('connected',()=>{
            console.log('Database Connected Successfully')
        })
        connectionInstance.on('error',(err)=>{
            console.log('faild to connect with mongodatabase \nError :\n',err.message)
        })
    }catch(err)
    {
        console.log('error while connecting to database \nError :\n',err.message)
    }
}

module.exports = connectWithDatabase