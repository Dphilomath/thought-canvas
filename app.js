var bodyParser = require("body-parser");
var methodOverride = require("method-override"),
  express = require("express"),
  dbConnection = require("./dbConnection");
const checkToken = require("./middleware/check");
  app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.use(checkToken);
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.use("/blogs", require('./controller/router'))
app.use("/register", require('./controller/register'))
app.use("/login", require('./controller/login'))
app.use("/logout", require('./controller/logout'))

app.get("/err", (req, res)=>{
  res.render("error", {loggedIn: req.loggedIn, error: req.err })
})

app.use((req, res)=>{
   return res.render("404")
})
app.listen(process.env.PORT, function () {
  console.log(`Blog app is running on Port: ${process.env.PORT}`);
});
