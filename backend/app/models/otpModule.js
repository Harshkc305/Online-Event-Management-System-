const mongoose=require("mongoose")

const emailOtpSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        red:"user",
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:"15m"
    }
},{versionKey:false})

const EmailotpModule=mongoose.model("Otp",emailOtpSchema)

module.exports=EmailotpModule

