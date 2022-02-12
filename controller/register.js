const checkToken = require("../middleware/check"),
  mongoose = require("mongoose"),
  sendMail = require("./../util/nodemailer");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const router = require("express").Router(),
  User = require("../models/user"),
  Hash = require("../models/hash"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  crypto = require("crypto");

router.get("/", async (req, res) => {
  if (res.locals.loggedIn == true) return res.redirect("/");
  res.render("register");
});

router.post("/", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    await user.save();

    const hashString = crypto.randomBytes(20).toString("hex");
    // console.log(hashSTring)
    const hash = new Hash({
      hash: hashString,
      user: user._id,
    });
    await hash.save();
    sendMail(email, hashString);

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    // res.status(201).json(user);
    // return res.status(201).redirect("/login")

    return res
      .status(201)
      .render("message", {
        message: "Success !! Just one more step, verify your email to login"
      });
  } catch (err) {
    console.log(err);
    await User.deleteOne({ email: email });
    return res.status(400).json(err);
  }
});

module.exports = router;
