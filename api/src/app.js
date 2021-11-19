const express=require("express")
const cookieparsor=require("cookie-parser")
require('dotenv').config({path:"./config.env"})
const PORT=process.env.PORT || 5000

const app=express()

app.use(express.json())
app.use(cookieparsor())

require("./db/conn")


const userRoute =require("./route/user")
const folderRoute =require("./route/folder")


app.use("/api/user",userRoute)
app.use("/api/folder",folderRoute)


app.listen(PORT,()=>{
    console.log("Listing at port ",PORT)
})