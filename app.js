//jshint esversion:6
const express = require("express");
const bP = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();

// using ejs for templating our app, must have ejs files in views folder
app.set("view engine", "ejs");

// using body-parser to parse our request coming from forms, buttons ... etc
app.use(bP.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (!err) {
      res.send(
        "New user of email " +
          req.body.username +
          " is registered successfully!"
      );
    } else {
      res.send(err);
    }
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = md5(req.body.password);
  User.findOne({ email: userName }, (err, foundUser) => {
    if (err) {
      console.log(err);
    }
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.send("Email or password is wrong!");
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server has started on port 3000 sucessfully!");
});
