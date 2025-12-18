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
        type:Number,
        required:true
    },
    totalTickets: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    availableTickets: { 
        type: Number, 
        required: true, 
        default: 0 

    },
    date: { type: Date, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['upcoming', 'ongoing', 'completed'], 
        default: 'upcoming' 
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