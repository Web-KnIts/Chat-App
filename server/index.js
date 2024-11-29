require("dotenv").config();

const express = require('express')
// const app = express();
const cors = require('cors');
const connectWithDatabase = require("./config/connectDatabase.js");
const router = require("./routes/index.js");
const cookieParser = require('cookie-parser')
const {app,server} = require('./socket/index.js')
// -------------- middleware -------------------------------------
app.use(express.json())
app.use(cors({
    origin:true,
    credentials: true 
}))
app.use(cookieParser())
app.use('/api',router)
// -------------- middleware end -------------------------------------

// -------------- Variable -------------------------------------http://localhost:5000/register
const PORT = process.env.PORT || 3000;

// -------------- Variable end -------------------------------------

app.get('/test',(req,res)=>{
    console.log('chala')
    res.json({
        test:"success"
    })
})

app.use((err,req,res,next)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        next();
    }
})

connectWithDatabase().then(()=>{
    server.listen(PORT , ()=>{
        console.log('server listened at port : ',PORT)
    })
})



