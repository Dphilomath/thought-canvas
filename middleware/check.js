const checkToken = (req, res, next) => {
  var token = req.headers.cookie;
  if(token!=null){
    res.locals.loggedIn = true;
  }else res.locals.loggedIn=false
  next();
};

module.exports = checkToken;