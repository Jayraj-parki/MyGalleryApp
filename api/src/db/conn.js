const mongoose=require("mongoose")
mongoose.connect(process.env.DB)
.then(()=>{
    console.log("connected successfully")
})
.catch(()=>{
    console.log(" No connection")
})