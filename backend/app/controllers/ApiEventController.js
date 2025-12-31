const Event=require("../models/EventModel")
const cloudinary=require("../config/cloudinaryConfig")
const Category=require("../models/categoryModel")
const fs=require("fs");
const { rejects } = require("assert");
const { resolve } = require("path");


class apieventController{

   
   
    // all product----------------------------------------
    async getAllEvent(req,res){
        try{
            const events= await Event.find().populate("category","name")
           

        
            return res.status(200).json({
                message:"All events fetched successfully",
                data:events
            })

        }catch(error){
            console.log("error in getting Event",error);
        }
    }


}



module.exports= new apieventController()