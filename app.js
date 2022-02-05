var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  express = require("express"),
  dbConnection = require("./dbConnection"),
  checkToken = require("./middleware/check"),
  app = express(),
  router = require("./controller/router")


app.set("view engine", "ejs");
app.use(express.static('public'))

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(checkToken);

app.use(router)

app.listen(process.env.PORT, function () {
  console.log(`Blog app is running on Port: ${process.env.PORT}`);
});
