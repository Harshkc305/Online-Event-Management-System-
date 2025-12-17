require("dotenv").config();
const nodemailer = require("nodemailer");


// create a test account or replica with real credintial
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST|| "smtp.ethereal.email",
  port: process.env.EMAIL_PORT||587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
module.exports=transporter;