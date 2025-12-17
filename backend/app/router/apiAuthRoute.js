const express =require("express")
const apiAuthController=require("../controllers/ApiAuthController")




const productImageUpload = require("../helper/productimage");
const AuthCheckApi=require("../middleware/authCheckApi");
const router=express.Router()

router.post("/Register",productImageUpload.single("image"),apiAuthController.apiRegister)
router.post("/verifyemail",apiAuthController.verifyEmail)
router.post("/Login",apiAuthController.apiLogin)
router.post("/forgot-password",apiAuthController.sendResetPasswordLink)
router.post("/reset-password/:id/:token",apiAuthController.resetPassword)
router.get("/dashboard",AuthCheckApi, apiAuthController.Dashboard)


// product----
router.get("/getAllEvent",AuthCheckApi,apiAuthController.getAllEvent);
module.exports=router