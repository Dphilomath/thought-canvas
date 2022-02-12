
  const router = require("express").Router();

  router.get("/", (req, res)=> res.redirect("/blogs"))
  router.use("/blogs", require("./blog"));
  router.use("/register", require("./register"));
  router.use("/login", require("./login"));
  router.use("/logout", require("./logout"));
  router.use("/verify", require('./verify'))
  router.get("/err", (req, res) => {
    res.render("error");
  });

  router.use((req, res) => {
    return res.render("404");
  });
  module.exports = router;
