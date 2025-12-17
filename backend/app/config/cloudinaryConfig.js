const cloudinary= require("cloudinary").v2;
require("dotenv").config();


// cloudinary.config({
//     cloud_name:"dgrtmncsc",
//     api_key:"559544377615154",
//     api_secret:"W0rsQPLQcq0QgcodmWPp7tudFpk"

// });
cloudinary.config()

module.exports=cloudinary