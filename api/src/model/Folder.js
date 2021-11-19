const mongoose=require("mongoose")

const FolderSchema=new mongoose.Schema({
    foldername:{
        type:String,
        required:true,
        trim:true,
    },
    userId:{
        type:String,
        required:true,
    },
    images:[
        {
           name:{
               type:String,
              
           },
           path:{
               type:String,
              
           }, 
           time: {
               type:Date,
               default: Date.now() 
           },
           like:{
               type:Boolean,
               default:false
           } 

        }
    ]
})

const Folder=new mongoose.model("Folder",FolderSchema);


module.exports=Folder