const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    var token = req.headers.cookie;
  if (!token) {
    return res.status(403).redirect("/login");
  }
  try {
    token = token.substring(14)
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
      return res.status(401).redirect("/login")
    // return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;