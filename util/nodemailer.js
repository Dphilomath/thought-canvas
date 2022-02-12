"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
module.exports = async function sendmail(email, id) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.user, // generated ethereal user
      pass: process.env.key, // generated ethereal password
    },
  });
  // transporter.verify( (error, success)=> {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });
  let url = `${process.env.site}/verify/${id}`;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"BlogUpp 👻" <daniyalmahmood1@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Activate your account", // Subject line
    text: "open this link in a window\n" + url, // plain text body
    html: `<div><h3>Hello there!</h3><b>Click <a href=${url}>here</a> to activate your blogUpp account</b></div>`, // html body
  });
};
