const checkToken = (req, res, next) => {
  var token = req.headers.cookie;
  if(token!=null){
    req.loggedIn = true;
  }else req.loggedIn=false
  next();
};

module.exports = checkToken;