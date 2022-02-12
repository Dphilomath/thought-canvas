const router = require('express').Router(),
    User = require("./../models/user"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken")

router.get('/', async (req, res)=>{
    if(res.locals.loggedIn==true) return res.redirect("/")
    return res.render("login")
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
  
      if(user!=null && !user.active) return res.status(403).render("message",{message: "Please verify your email!"})
      
      if ( user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );
  
        // save user token
        user.token = token
        await user.save()
  
        // user
        res.cookie('authorization', token, {
            expires: new Date(Date.now + 3600000),
            secure: true
          });
        // return res.status(200).json(user);
        return res.status(200).redirect("/")
      }
      res.status(403).render("message",{message: "Invalid Credentials"});
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = router