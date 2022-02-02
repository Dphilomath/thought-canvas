var bodyParser = require("body-parser");
var methodOverride = require("method-override"),
  express = require("express"),
  dbConnection = require("./dbConnection");
  app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.use("/blogs", require('./controller/router'))
app.use("/register", require('./controller/register'))
app.use("/login", require('./controller/login'))
app.use("/logout", require('./controller/logout'))
app.listen(process.env.PORT, function () {
  console.log(`Blog app is running on Port: ${process.env.PORT}`);
});
