var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({
    name: "Dennis",
    age: 26,
    likes: "coding",
    simpleMessage: "this is awesome hosting",
  });
});

module.exports = router;
