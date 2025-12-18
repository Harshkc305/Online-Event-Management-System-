const mongoose=require("mongoose")

const bookingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"event",
        required:true,
    },
    tickets:{
        type:Number,
        required:true,
        min:1
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    ticketId:{
        typr:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled"],
        default:"pending"
    }
},{timestamps:true,
    versionKey:false
})
const bookingModel=mongoose("Booking",bookingSchema)
module.exports=bookingModel