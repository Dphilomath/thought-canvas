const jwt = require("jsonwebtoken");

const config = process.env;

const checkToken = (req, res, next) => {
  var token = req.headers.cookie;
  if(token){
    token = token.substring(14)
    req.loggedIn = true;
  }else req.loggedIn=false
  next();
};

module.exports = checkToken;