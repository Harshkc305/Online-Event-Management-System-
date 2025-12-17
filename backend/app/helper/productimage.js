// disk storage engine for multer
// const multer=require("multer");


// const FILE_TYPE_MAP={
//     "image/png":"png",
//     "image/jpg":"jpg",
//     "image/jpeg":"jpeg",
//     "image/gif":"gif"
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const isValid=FILE_TYPE_MAP[file.mimetype];
//     let uploadError=new Error("invalid image type");
//     if(isValid){
//         uploadError=null
//     }
//     cb(uploadError,"uploads")
//   },
//   filename: function (req, file, cb) {
//     const filename = file.originalname.split(' ').join('-');
//     const extension = FILE_TYPE_MAP[file.mimetype];
//     cb(null,`${filename}-${Date.now()}.${extension}`);

    
//   }
// })

// const productImageUpload= multer({ storage: storage })
// module.exports=productImageUpload



// ---------------------------------------------------------------
// cloudinary disk storage engine for multer

// const multer = require("multer");
// const path = require("path");

// // destination folder
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");   // temporary folder
//   },

//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + Date.now() + ext);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
// ---------------------------------------------------------------

// memory storage engine for multer with cloudinary

const multer = require("multer");
const storage= multer.memoryStorage();
const productImageUpload=multer({storage})

module.exports=productImageUpload;