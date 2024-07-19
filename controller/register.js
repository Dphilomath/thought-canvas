const checkToken = require('../middleware/check');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const router = require('express').Router(),
User = require('../models/user'),
bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken')


router.get('/', checkToken,  async(req, res)=>{

  if(req.loggedIn==true) return res.redirect("/")
  res.render("register", {loggedIn: req.loggedIn})
} )

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
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
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
      return res.status(201).redirect("/login")
    } catch (err) {
      console.log(err);
      return res.status(400).json(err)
    }
  });

  module.exports = router
  