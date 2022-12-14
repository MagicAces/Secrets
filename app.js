//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String    
});


const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(err => {
            if(err) 
                console.log(err);
            else 
                res.render("secrets");
        });
    });
});

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email: email}, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            bcrypt.compare(password, user.password).then(function(result) {
                if(result)
                    res.render("secrets");
                else
                    res.send("User not found");
            }).catch(err => {
                res.send(err);
            });
        }
    })
})

app.listen(3000, (req, res) => {
    console.log("Server listening on port 3000");
});

