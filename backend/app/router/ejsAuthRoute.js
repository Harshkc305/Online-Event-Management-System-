const express=require("express")
const ejsAuthController=require("../controllers/ejsAuthController");
const productImageUpload = require("../helper/productimage");
const AuthCheckEjs=require("../middleware/authCheck");
const AdminAuthCheck=require("../middleware/adminAuthCheck")
const router=express.Router()


// page route-----------------------
router.get("/register-page",ejsAuthController.registerPage)
router.get("/login-page",ejsAuthController.LoginPage)
router.get("/otp-page",ejsAuthController.otpPage)
router.get("/forget-page",AuthCheckEjs,ejsAuthController.forgotPasswordPage)
router.post("/forgot-password",ejsAuthController.sendResetPasswordLink)
router.get("/reset-password/:id/:token",ejsAuthController.resetPasswordPage);
router.post("/reset-password/:id/:token",ejsAuthController.resetPassword);

// user routes-----------------------
router.get("/user-page",AuthCheckEjs,ejsAuthController.userPage)
router.get("/delete-user/:id",AuthCheckEjs,ejsAuthController.userDelete)

// admin dash board and log out----------------
router.get("/adminDashboard", AuthCheckEjs,AdminAuthCheck, ejsAuthController.adminDashboard)
router.get("/logout", AuthCheckEjs,ejsAuthController.Logout)

// register and login route-------------
router.post("/register",productImageUpload.single("image"),ejsAuthController.Register)
router.post("/login",ejsAuthController.Login)
router.post("/verifyemail",ejsAuthController.verifyEmail)



module.exports=router;
