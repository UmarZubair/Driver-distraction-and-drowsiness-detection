var express = require('express');
var router = express.Router();
var ride = require('../db/ride');
var driver = require('../db/driver');

var loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
      next()
    }
    else {
      res.redirect('/')
    }
  }

  router.get('/ride_route',loggedin, (req, res) => {
        res.send("hello world");
  })
  


module.exports = router;