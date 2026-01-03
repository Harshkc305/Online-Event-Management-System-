require("dotenv").config();

const express=require("express");
const dbcon=require("./app/config/dbcon")
const cors=require("cors");

const cookieParser=require("cookie-parser");
const app=express();
const path=require("path");

dbcon()

// cors middlewere
app.use(cors({
  origin: process.env.FRONTEND_HOST || 'http://localhost:3001',
  credentials: true
}));
// app.use(helmet());

app.use(cookieParser());

// setup ejs
app.set("view engine","ejs");
app.set("views","views");

// middlewares

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({extended:true}));
app.use(express.json())

// static public folder 
app.use(express.static("public"));

// static folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.use(express.static(path.join(__dirname, "public")));

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

const ApiEventController=require("./app/router/apiEventRoute")
app.use("/api",ApiEventController)

const PORT=process.env.PORT || 1226;
app.listen(PORT,()=>{
    console.log(`aerver is running on port @http://localhost:${PORT}`)
}) 


