const User=require("../models/user")

const Event=require("../models/EventModel")

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cloudinary=require("../config/cloudinaryConfig")
const sendEmailVerificationOTP=require("../helper/sendEmail")
const EmailVerifyModule=require("../models/otpModule")
const transporter=require("../config/emailConfig")


class apiAuthController{

    async apiRegister(req,res){
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

        return res.status(201).json({
            message:"user register successfully",
            data:result
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"error in registering user",
            
        })
       
    }
}

async verifyEmail(req,res){
    try{
        const {email,otp}=req.body
        if(!email||!otp){
           
           return res.status(400).json({
            message:"error all field require",
            
        })
        }

        const existinguser=await User.findOne({email})

        if(!existinguser){
           
            return res.status(400).json({
            status:"fail",
            message:"error user not found, register first",
            })
        }

        if(existinguser.is_verified){
                return res.status(400).json({
                    status:false,
                    message:"user already verifyed, please login"
                })
            }

        const emailVerification=await EmailVerifyModule.findOne({userId:existinguser._id,otp})

        if(!emailVerification){
            if(!existinguser.is_verified){
                await sendEmailVerificationOTP(req,existinguser)
                return res.status(400).json({
                        status:false,
                        message:"invalid otp, new otp send email"
                })
            }
            return res.status(400).json({
                    status:false,
                    message:"invalid otp"
            })
        }

        // check if otp is expired
        const currentTime=new Date();
        // 15*60*1000=15 minutes in millisecond
        const ExpirationTime=new Date(emailVerification.createdAt.getTime()+15*60*1000);
        if(currentTime>ExpirationTime){
            await sendEmailVerificationOTP(req,existinguser);
            return res.status(400).json({
                    status:"fail",
                    message:"otp expire, new otp send to your email"
            })
        }

        // otp is valid or not expire ,mark email as verifyed
        existinguser.is_verified=true;
        await existinguser.save()
        

        // delete otp records
        await EmailVerifyModule.deleteMany({userId:existinguser._id})
         return res.status(200).json({
                status:true,
                message:"email verifyed successfully, your can now login"
        })


        



        

    }catch(error){
       console.log(error.message);
        res.status(500).json({
            massage:"unable to verify this email try again later"
        })
    }
}



// login----------------------------------------------

async apiLogin(req,res){
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({
                    message:"all fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            
             return res.status(400).json({
                    message:"user not found, please register"
            })
        }

        if (!user.is_verified) {
            sendEmailVerificationOTP(req, user);
             return res.status(400).json({
                    message:"please verify your email to login "
             })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
           return res.status(400).json({
                message:"invalid cridencial"
            })
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

        return res.status(200).json({
            message: "login successful",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });


       

    } catch (error) {
        return res.status(500).json({
             message:"internal server error"
        })
    }

}

async sendResetPasswordLink(req,res){
    try{
        const {email}=req.body

        if(!email){
           return res.status(400).json({
                massage:"email is required"
            })
        }

        const user=await User.findOne({email});

        if(!user){
           return res.status(400).json({
                message:"email doesnot exjist"
            })
        }

        const secret=user._id + process.env.JWT_SECRET;
        const token=jwt.sign(
            {userID:user._id},
            secret,
            {expiresIn:"20m"}
        )

        const resetLink=`${process.env.FRONTEND_HOST}/reset-password/${user._id}/${token}`;

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

        return res.status(200).json({
            status:true,
            message:"password reset link send to your email"
        })

    }catch(error){
        console.log("RESET PASSWORD ERROR 👉", error);
        return res.status(500).json({
        status:false,
        message:error.message
    })
    }
}

async resetPassword(req,res){
    try{
        const {password,confirm_password}=req.body;
        const {id,token}=req.params;


        const user = await User.findById(id)

        if(!user){
            return res.status(400).json({
                massage:"user not found"
            })
        }
    // token verify

        const secret= user._id + process.env.JWT_SECRET;
        jwt.verify(token,secret);

        if(!password||!confirm_password){
            return res.status(400).json({
                status:false,
                massage:"all field is required"
            })
        }

        if(password!==confirm_password){
            return res.status(400).json({
                status:false,
                message:"password are confirm password must be same"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        await User.findByIdAndUpdate(id,{
            $set:{password:hashedPassword}
        })

        res.status(200).json({
            status:"succes",
            message:"password reset successfully, you can now login with new password"
        })



    }catch(error){
         return res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}


async Dashboard(req, res) {
    try{
        return res.status(200).json({
            message:"welcome to dashboard"
        })
    }catch(error){
        throw error
    }
}

async getAllEvent(req, res) {
   try{
        const event= await Event.find()
        return res.status(200).json({
            message:"successful getEvent data ",
            data:event,
            user:req.user
        })
        

    }catch(error){
        console.log("error in getting Event",error);
    }

}
}


module.exports=new apiAuthController();