// const jwt=require("jsonwebtoken");



// const AuthCheckEjs=(req,res,next)=>{
//     if(req.cookies && req.cookies.userToken){
//         jwt.verify(req.cookies.userToken,process.env.JWT_SECRET,(err,user)=>{

//             req.user=user;
//             console.log("auth",req.user)
            
//             next()

//         })
//     }else{
//         return res.redirect("/login-page");
//     }
// }

// module.exports=AuthCheckEjs



const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function AuthCheckEjs(req, res, next) {
    try {
        const token = req.cookies.userToken;

        if (!token) {
            return res.redirect("/login-page");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user_id).select("-password");

        if (!user) {
            return res.redirect("/login-page");
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Auth error", error);
        return res.redirect("/login-page");
    }
}

module.exports = AuthCheckEjs;
