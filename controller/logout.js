const checkToken = require('../middleware/check')

const router = require('express').Router()

router.get("/",checkToken, (req, res) => {
    res.clearCookie('authorization');
    return res.redirect("/");
})
module.exports = router