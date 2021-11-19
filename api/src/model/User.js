const mongoose=require("mongoose")
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    profileImg:{
        type:String
    },
    tokens:[
        {
           token:String,
        }
    ]

})


userSchema.pre('save',async function(next){
    try{
        if(this.isModified('password')){
            this.password=await bcrypt.hash(this.password,10)
        }
        next();
    }
    catch(err){
        console.log("Error in hashing password")
    }
})

userSchema.methods.generateTokenId=async function(){
    try{
        const token=jwt.sign({_id:this.id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token;
    }
    catch(err){
        console.log("error in generateTokenId")
    }
}
const User=new mongoose.model("user",userSchema);


module.exports=User