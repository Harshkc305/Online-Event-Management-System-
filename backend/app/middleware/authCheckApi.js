
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// async function AuthCheckApi(req, res, next) {
//     try {
//         const token = req.cookies.userToken;

//         if (!token) {
//             return res.status(401).json({
//             message:"access denied. no token provided"
//         })
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.user_id).select("-password");

//         if (!user) {
//             return res.status(401).json({
//             message:"access denied. no user found"
//         })
//         }

//         req.user = user;
//         next();

//     } catch (error) {
//         console.log("api Auth error", error);
//         return res.status(500).json({
//             message:"access denied. no token provided"
//         })
//     }
// }

// module.exports = AuthCheckApi;




// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// async function AuthCheckApi(req, res, next) {
//     try {
//         // 1️⃣ Token cookie ya header se uthao
//         let token = null;

//         // Cookie se
//         if (req.cookies && req.cookies.userToken) {
//             token = req.cookies.userToken;
//             console.log("Token from COOKIE");
//         }

//         // Header se
//         if (
//             !token &&
//             req.headers.authorization &&
//             req.headers.authorization.startsWith("Bearer ")
//         ) {
//             token = req.headers.authorization.split(" ")[1];
//             console.log("Token from HEADER");
//         }

//         if (!token) {
//             return res.status(401).json({
//                 message: "Access denied. Token not found"
//             });
//         }

//         // 2️⃣ Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 3️⃣ Find user
//         const user = await User.findById(decoded.user_id).select("-password");

//         if (!user) {
//             return res.status(401).json({
//                 message: "Access denied. User not found"
//             });
//         }

//         req.user = user;
//         next();

//     } catch (error) {
//         console.log("API Auth error 👉", error.message);
//         return res.status(401).json({
//             message: "Invalid or expired token"
//         });
//     }
// }

// module.exports = AuthCheckApi;

const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function AuthCheckApi(req, res, next) {
    
    const token = req?.body?.token||req?.query?.token||req?.headers["authorization"]||req?.headers["x-access-token"]
    
    if (!token) {
        return res.status(401).json({
            message: "Access denied. Token not found"
        });
    }
    try {
        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3️⃣ Find user
        const user = await User.findById(decoded.user_id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Access denied. User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("API Auth error 👉", error.message);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = AuthCheckApi;

