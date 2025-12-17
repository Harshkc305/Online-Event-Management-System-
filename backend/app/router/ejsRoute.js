const express=require("express");
const ejsController = require("../controllers/ejsController");


const router=express.Router();

router.get("/",ejsController.home)


module.exports=router