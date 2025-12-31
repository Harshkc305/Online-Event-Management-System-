const express = require("express");
const router = express.Router();
const apieventController=require("../controllers/ApiEventController")

// all event
router.get("/all-events",apieventController.getAllEvent);



module.exports = router;