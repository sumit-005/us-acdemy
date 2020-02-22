const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect('mongodb+srv://sumit-005:Mtj7m6pZVyHK8OpR@cluster0-w7rcj.mongodb.net/us-academy?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
  console.log("Connected to Database...");

})
.catch(()=>{
  console.log("connection Fail...");

})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")));
app.use((req,res,next) =>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    next();
});



app.use("/posts", postsRoutes);
app.use("/user", userRoutes);
module.exports = app;
