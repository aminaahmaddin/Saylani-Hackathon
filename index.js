const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = 3001
const app = express()
const userRoutes = require('./routes/userRoutes')
const noteRoutes = require('./routes/noteRoutes')

app.use(express.json())

app.use(cors({
    origin:true,
    credential:true
}))
 
app.get('/',(req,res)=>{
   res.send('server is running')
})
   
app.use("/user",userRoutes)
app.use("/note",noteRoutes)


mongoose.connect('mongodb://localhost:27017')
.then(()=>console.log('mongodb is connected'))
.catch((err)=>console.log('mongodb is not connected ', err))




app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    
})