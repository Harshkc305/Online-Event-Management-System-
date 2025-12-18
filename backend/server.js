require("dotenv").config();

const express=require("express");
const dbcon=require("./app/config/dbcon")
const cors=require("cors");
const cookieParser=require("cookie-parser");
const app=express();
const Path=require("path");

dbcon()

// cors middlewere
app.use(cors())

app.use(cookieParser());

// setup ejs
app.set("view engine","ejs");
app.set("views","views");

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json())

// static public folder 
app.use(express.static("public"));

// static folder
app.use("/uploads",express.static(Path.join(__dirname,"uploads")));
app.use("/uploads",express.static("uploads"));

// api


// routes
const ejsRouter=require("./app/router/ejsRoute");
app.use(ejsRouter)

const productRoute=require("./app/router/eventRoute");
app.use(productRoute)

const ejsAuthRoute=require("./app/router/ejsAuthRoute");
app.use(ejsAuthRoute)

const ApiAuthController=require("./app/router/apiAuthRoute")
app.use("/api",ApiAuthController)

const PORT=process.env.PORT || 1226;
app.listen(PORT,()=>{
    console.log(`aerver is running on port @http://localhost:${PORT}`)
}) 


