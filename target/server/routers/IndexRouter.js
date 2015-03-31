/*jslint node: true */
/*jshint esnext: true */
"use strict";

var express = require("express");
var router = express.Router();

// get index
router.get("/", function (req, res, next) {
  res.render("index", { title: "Packia" });
});

module.exports = router;