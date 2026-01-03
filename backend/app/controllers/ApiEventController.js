const Event=require("../models/EventModel")

// const Category=require("../models/categoryModel")



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