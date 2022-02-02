var bodyParser = require("body-parser");
const verifyToken = require("../middleware/auth");
const checkToken = require("../middleware/check");
const User = require("../models/User");
var methodOverride = require("method-override"),
  express = require("express"),
  router = express.Router(),
  Blog = require("../models/Blog"),
  app = express();


router.get("/", checkToken, function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
      res.json(err)
    } else {
      res.render("index", { blogs: blogs, loggedIn : req.loggedIn });
    }
  });
});

router.get("/new", checkToken, function (req, res) {
  res.render("new", {loggedIn : req.loggedIn});
});

router.post("/",verifyToken, function (req, res) {
  Blog.create({...req.body, author: req.user.user_id}, function (err, createdBlog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

router.get("/:id", checkToken, function (req, res) {
  var id = req.params.id;

  Blog.findById(id, function (err, foundBlog) {
    if (err) {
      res.send("Blog not found");
    } else {
        User.findById(foundBlog.author, (err, found)=>{
          if(err){
            console.log(err)
            return res.status(400).redirect("/new")
          }else{
            return res.render("show", { blog: foundBlog, loggedIn:req.loggedIn, author: found.first_name });
          }
        })
    }
  });
});

router.get("/:id/edit", checkToken, verifyToken,  function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { blog: foundBlog, loggedIn: req.loggedIn });
    }
  });
});

//update
router.put("/:id", verifyToken, function (req, res) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, req.body, function (err, updatedBlog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs/" + id);
    }
  });
});

//delete
router.delete("/:id",verifyToken, function (req, res) {
  Blog.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.send("Error: Could not be deleted");
    } else {
      res.redirect("/blogs/");
    }
  });
});

module.exports = router;
