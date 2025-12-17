const mongoose=require("mongoose")

const eventSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    
    price:{
        type:String,
        required:true
    },
    
    image:{
        type:[String],  // for multiple images
        default:[]

        // default:""     this was for single image
    },
    imageIds:{             // to store cloudinary public ids of images
        type:[String],
        default:[]
    }
},{
    timestamps:true,
    versionKey:false
})
const EventModel=mongoose.model("event",eventSchema)
module.exports=EventModel