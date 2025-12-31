const express = require("express");
const eventController = require("../controllers/eventController");
const AdminAuthCheck=require("../middleware/adminAuthCheck")
const productImageUpload = require("../helper/productimage");
const AuthCheckEjs = require("../middleware/authCheck");
const router=express.Router();

// create productpage route
router.get("/event-page",AuthCheckEjs,eventController.eventPage)
// router.get("/edit-page",eventController.editPage)

// category page route
router.get("/category-page",AuthCheckEjs,AdminAuthCheck,eventController.categoryPage)
router.post("/createcategory",AuthCheckEjs,AdminAuthCheck,eventController.addcategory);


router.post("/createEvent",AuthCheckEjs,AdminAuthCheck,productImageUpload.array("image",5),eventController.createEvent);
router.get("/getAllEvent",AuthCheckEjs,eventController.getAllEvent);
router.get("/singleEvent/:id",AuthCheckEjs,eventController.singleEvent);
router.get("/editEvent/:id",AuthCheckEjs,eventController.editEvent);
router.post("/updateEvent/:id",productImageUpload.array("image",5),AuthCheckEjs,eventController.updateEvent);
router.get("/deleteEvent/:id",AuthCheckEjs,eventController.deleteEvent);

module.exports=router;