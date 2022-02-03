const jwt = require("jsonwebtoken");

const config = process.env;

const authorise = (req, res, next) => {
  var token = req.headers.cookie;
  if (!token) {
    req.authorised = false;
  } else {
    try {
      token = token.substring(14);
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      console.log(err);
      req.err = err
      return res.status(401).redirect("/err")
      // return res.status(401).send("Invalid Token");
    }
  }
  return next();
};

module.exports = authorise;
