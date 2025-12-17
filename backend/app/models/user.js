const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""  
    },
    imageId:{
        type:String,
        default:""
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    is_verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true,
    versionKey:false
})

const UserModule=mongoose.model("user",userSchema);
module.exports=UserModule