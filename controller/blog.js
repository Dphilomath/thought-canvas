const verifyToken = require("../middleware/auth"),
  authorise = require("../middleware/authorise"),
  methodOverride = require("method-override"),
  Blog = require("../models/blog"),
  User = require("../models/user"),
  express = require("express"),
  router = express.Router();

router.get("/", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

router.get("/new", verifyToken, function (req, res) {
  res.render("new");
});

router.post("/", verifyToken, function (req, res) {
  Blog.create(
    { ...req.body, author: req.user.user_id },
    function (err, createdBlog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs/" + createdBlog._id);
      }
    }
  );
});

router.get("/:id", authorise, async function (req, res) {
  try {
    const id = req.params.id;
    let authorised = false;
    let foundBlog = await Blog.findById(id).exec();
    if (foundBlog != null) {
      if (res.locals.loggedIn && req.user.user_id == foundBlog.author)
        authorised = true;
    } else return res.status(404).redirect("/404");

    let author = await User.findById(foundBlog.author).exec();

    return res.render("show", {
      blog: foundBlog,
      author: author.first_name,
      authorised: authorised,
    });
  } catch (err) {
    console.log("Error: " + err);
    res.redirect("/err");
  }
});

router.get("/:id/edit", verifyToken, function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      if (req.user.user_id == foundBlog.author)
        res.render("edit", { blog: foundBlog });
      else res.render("Unauthorized");
    }
  });
});

//update
router.put("/:id", verifyToken, function (req, res) {
  const id = req.params.id;
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
        res.render("message", {message : "Error: Could not be deleted"});
      } else {
        res.redirect("/blogs/");
      }
    });
  } else res.render("Unauthorized");
});

module.exports = router;
