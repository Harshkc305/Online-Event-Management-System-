const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cloudinary=require("../config/cloudinaryConfig")
const sendEmailVerificationOTP=require("../helper/sendEmail")
const EmailVerifyModule=require("../models/otpModule")
const transporter=require("../config/emailConfig")


class ejsAuthController{

async registerPage(req,res){
    try{
        res.render("register",{
            title:"Register Page",
            user:req.user
        })
    }catch(err){
        console.log("Error in rendering register page", err);
    }

}

async Register(req,res){
    try{
        console.log("BODY:", req.body);   // debug
        console.log("FILE:", req.file);

        
        let imageUrl="";
        let imageId="";

        if(req.file){
            const uploadResult=await new Promise((resolve, reject)=>{
                cloudinary.uploader.upload_stream(
                    {folder:"users"},
                    (error,result)=>{
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer)
            })
            imageUrl=uploadResult.secure_url;
            imageId=uploadResult.public_id
        }
        const user= new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            image:imageUrl,
            imageId:imageId
        })


        const result= await user.save();
        console.log("user registered successfully", result);

        // email send to user email
        sendEmailVerificationOTP(req,user)

        if(result){
            console.log("Redirecting to login page");
            // res.redirect("/login-page");
            res.redirect("/otp-page");
        }else{

           console.log("Error in registering user");
        }

    }catch(error){
        console.log("error in registering user",error);
    }
}
// otp page-----------------

async otpPage(req,res){
    try{
        res.render("otpPage",{
            title:"otp page",
            user:req.user
        })

    }catch(error){
        console.log("error in otp page",error);
    }
}

// verifyEmail-----------

async verifyEmail(req,res){
    try{
        const {email,otp}=req.body
        if(!email||!otp){
           console.log("error all field require",error);
        }

        const existinguser=await User.findOne({email})

        if(!existinguser){
           console.log("error user not found, register first",error);
        }

        const emailVerification=await EmailVerifyModule.findOne({userId:existinguser._id,otp})

        if(!emailVerification){
            if(!existinguser.is_verified){
                await sendEmailVerificationOTP(req,existinguser)
                console.log("invalid otp, new otp send in email")
            }
            console.log("invalid otp")
        }

        // check if otp is expired
        const currentTime=new Date();
        // 15*60*1000=15 minutes in millisecond
        const ExpirationTime=new Date(emailVerification.createdAt.getTime()+15*60*1000);
        if(currentTime>ExpirationTime){
            await sendEmailVerificationOTP(req,existinguser);
            console.log("otp expire, new otp send to your email")
        }

        // otp is valid or not expire ,mark email as verifyed
        existinguser.is_verified=true;
        await existinguser.save()
        

        // delete otp records
        await EmailVerifyModule.deleteMany({userId:existinguser._id})
        console.log("email verification succesfully")


        res.redirect("/login-page");



        

    }catch(error){
       console.log("error in otp verify",error);
    }
}

async LoginPage(req,res){
    try{
        res.render("login",{
            title:"Login Page",
            user:req.user
        })
    }catch(err){
        console.log("Error in rendering login page", err);
    }   
}



// login----------------------------------------------


async Login(req, res) {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.redirect("/login-page");
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.redirect("/login-page");
        }

        if (!user.is_verified) {
            sendEmailVerificationOTP(req, user);
            console.log("Email not verified");
            return res.redirect("/otp-page");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password");
            return res.redirect("/login-page");
        }

        const token = jwt.sign(
            {
                user_id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
             process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        if(token){
            res.cookie("userToken", token);
            return res.redirect("/adminDashboard");
        }else{
            console.log("login faield")
        }

        // res.cookie("userToken", token, {
        //     httpOnly: true
        // });

        // return res.redirect("/adminDashboard");

    } catch (error) {
        console.log("Login error", error);
        res.redirect("/login-page");
    }
}



// forget password link------------

async forgotPasswordPage(req,res){
    try{
        res.render("forgetPasswordPage",{
            title:"forget password page",
            user: req.user,
        
        })

    }catch(error){
        console.log("invalid cridential",(error))
    }
}


async sendResetPasswordLink(req,res){
    try{
        const {email}=req.body

        if(!email){
           console.log(error,"Email required")
        }

        const user=await User.findOne({email});

        if(!user){
           console.log(error,"Email does not exist",)
        }

        const secret=user._id + process.env.JWT_SECRET;
        const token=jwt.sign(
            {userID:user._id},
            secret,
            {expiresIn:"20m"}
        )

        const resetLink=`${process.env.BACKEND_HOST}/reset-password/${user._id}/${token}`;

        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to:user.email,
            subject:"Password Reset Link",
            html:`
                <p>Hello ${user.name},</p>
                <p>
                    Click <a href="${resetLink}">here</a> to reset your password.<br>
                    This link will expire in 20 minutes.
                </p>
            `
        })

        console.log("Reset password link sent to your email")

    }catch(error){
        console.log("invalid credential",error)
    }
}

async resetPasswordPage(req,res){
    try{
        const {id,token}=req.params;

        res.render("resetPassword",{
            title:"Reset Password",
            user: req.user,
            userId:id,
            token:token
        })

    }catch(error){
        console.log(error)
    }
}

async resetPassword(req,res){
    try{
        const {password,confirm_password}=req.body;
        const {id,token}=req.params;


        const user = await User.findById(id)

        if(!user){
           console.log(error,"user not found")
        }
    // token verify

        const secret= user._id + process.env.JWT_SECRET;
        jwt.verify(token,secret);

        if(!password||!confirm_password){
            console.log("all field required")
        }

        if(password!==confirm_password){
            console.log(error,"password and confirm password must be same")
        }

        const hashedPassword=await bcrypt.hash(password,10);

        await User.findByIdAndUpdate(id,{
            $set:{password:hashedPassword}
        })

        res.redirect("/login-page")



    }catch(error){
        console.log(error)
    }
}


async adminDashboard(req, res) {
    try {
        res.render("admin/adminDashboard", {
            title: "Admin Dashboard",
            user: req.user
        });
    } catch (err) {
        console.log("Error in rendering admin dashboard page", err);
    }
}

async Logout(req, res) {
    try{
        res.clearCookie("userToken");
        return res.redirect("/login-page");

    }catch(error){
        console.log("error in user logout",error);
    }
}

// --------------------user page---------------------

async userPage(req,res){
    try{
        const user=await User.find();
        res.render("user",{
            title:"user page",
            data:user,
            user:req.user
        })

    }catch(error){
        console.log("error in user reading user page",error);
    }
}

// async userEdit(req,res,){
//     try{
//         const id=req.params.id;
//         const user=await User.findById(id)
//         res.render("userEditPage",{
//             title:"user edit page",
//             data:user,
//             user:req.user
//         })

//     }catch(error){
//          console.log("error in user edit page",error);
//     }
// }
async userDelete(req,res,){
    try{
        const id=req.params.id;
        const user=await User.findById(id)
        if(!user){
            return res.redirect("/user-page");
        }

        if(user.imageId){
            await cloudinary.uploader.destroy(user.imageId);
        }

        await User.findByIdAndDelete(id);
        return res.redirect("/user-page");



    }catch(error){
         console.log("Error deleting user:", error);
        return res.redirect("/user-page");
    }
}









}
module.exports= new ejsAuthController();