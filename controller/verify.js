const router = require("express").Router(),
  Hash = require("./../models/hash"),
  User = require("./../models/user");

router.get("/:id", async (req, res) => {
  try {
    console.log(req.params);
    let hash = req.params.id;
    let found = await Hash.findOne({ hash: hash });
    if (found != null) {
      let user = await User.findOneAndUpdate(
        { _id: found.user },
        { active: true }
      );
      res
        .status(200)
        .render("message", {
          message: "Success!! the account has been verified. you can now login",
        });
      await Hash.deleteOne({ hash: hash });
    } else {
      return res.render("message", {
        message: "the account has already been activated",
      });
    }
  } catch (err) {
    res
      .status(400)
      .render("message", {
        message: "Failed to activate account!",
      });
  }
});

module.exports = router;
