const verifyToken = require("../middleware/auth"),
  authorise = require("../middleware/authorise"),
  checkToken = require("../middleware/check"),
  User = require("../models/user"),
  methodOverride = require("method-override"),
  express = require("express"),
  router = express.Router(),
  Blog = require("../models/blog");
  
router.get("/", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.render("index", { blogs: blogs, loggedIn: req.loggedIn });
    }
  });
});

router.get("/new", verifyToken, function (req, res) {
  res.render("new", { loggedIn: req.loggedIn });
});

router.post("/", verifyToken, function (req, res) {
  Blog.create(
    { ...req.body, author: req.user.user_id },
    function (err, createdBlog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs/"+createdBlog._id);
      }
    }
  );
});

router.get("/:id", authorise, function (req, res) {
  var id = req.params.id;
  let authorised = false;
  Blog.findById(id, function (err, foundBlog) {
    if (err) {
      return res.send("Blog not found");
    } else {
      if (req.loggedIn && req.user.user_id == foundBlog.author)
        authorised = true;
      User.findById(foundBlog.author, (err, found) => {
        if (err) {
          console.log(err);
          return res.status(400).send("Could not fetch author");
        } else {
          return res.render("show", {
            blog: foundBlog,
            loggedIn: req.loggedIn,
            author: found.first_name,
            authorised: authorised,
          });
        }
      });
    }
  });
});

router.get("/:id/edit", verifyToken, function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      if (req.user.user_id == foundBlog.author)
        res.render("edit", { blog: foundBlog, loggedIn: req.loggedIn });
      else res.render("Unauthorized", { loggedIn: req.loggedIn });
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
router.delete("/:id", verifyToken, async function (req, res) {
  let foundBlog = await Blog.findById(req.params.id);
  if (req.user.user_id == foundBlog.author) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
      if (err) {
        res.send("Error: Could not be deleted");
      } else {
        res.redirect("/blogs/");
      }
    });
  } else res.render("Unauthorized", { loggedIn: req.loggedIn });
});

module.exports = router;
