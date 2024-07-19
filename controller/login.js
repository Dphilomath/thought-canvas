const checkToken = require('../middleware/check');

const router = require('express').Router(),
    User = require("./../models/user"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken")

router.get('/', checkToken, async (req, res)=>{
    if(req.loggedIn) return res.redirect("/")
    return res.render("login", {loggedIn:req.loggedIn})
})
router.post("/", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
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
  
        // user
        res.cookie('authorization', token, {
            maxAge: new Date() * 0.001 + 300,
            secure: true,
          });
        // return res.status(200).json(user);
        return res.status(200).redirect("/")
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = router