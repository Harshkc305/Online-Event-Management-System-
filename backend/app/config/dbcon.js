const mongoose=require("mongoose");

const dbconnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected successfully");

    }catch(error){
        console.log("error while connecting to db",error);
    }
}

module.exports=dbconnection