const express = require("express");
const bcyrpt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcyrpt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          mesage: "User created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser   ;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;

      return bcyrpt.compare(req.body.password, user.password);
      
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          mesage: "Auth Failed]"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email,
        name : fetchedUser.name },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      
      res.status(200).json({
        token: token,
        expiresIn: 3600,
       
      });
    })
    .catch(err => {
      res.status(500).json({
        mesage: "Auth Failed"
      });
    });
});

module.exports = router;
