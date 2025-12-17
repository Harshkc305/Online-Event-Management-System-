const transporter=require("../config/emailConfig");

const EmailotpModule=require("../models/otpModule")

const sendEmailVerificationOTP=async(req,user)=>{
    const otp=Math.floor(100000 + Math.random()*900000);
    console.log("otp",otp);

    const data=await new EmailotpModule({
        userId:user._id,
        otp:otp
    }).save();

    console.log("otp data",data)
    await transporter.sendMail({
        from:process.env.EMAIL_FROM||"harshraz0009@gmail.com",
        to:user.email,
        subject:"email Verification OTP",
        text:`your OTP is ${otp}.its valid for 15 minuits`,
        html:`<b>your OTP is is ${otp},its valid for 15 mintes<b/>`,

    })
    return otp
}
module.exports=sendEmailVerificationOTP;