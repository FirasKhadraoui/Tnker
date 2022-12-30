const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { v4: uuidv4, stringify } = require('uuid');

const app = express();
const secretKey = "secretkey";
app.use(bodyParser.json());

let users = [];

//SIMPLE TEST
app.get("/", (req, res) => {
    res.json({
        message: "a simple api for test"
    })
})

//GET ALL USERS
app.get("/user", (req, res) => {
    res.send(users);
})

//ADD USER
app.post("/user", (req, res) => {
    if (req.body.age > 0 && req.body.username != "") {
        users.push({ ...req.body, id: uuidv4() });
        // res.send(req.body);
        jwt.sign((req.body), secretKey, {expiresIn:'3000s'}, (err, token)=>{
            res.json({
                success : true,
                message : "user created successfully",
                access_token : token
            })
        })
    }
    else {
        if (req.body.age <= 0) {
            res.json({
                success : false,
                message: "age must be > 0"
            })
        }
        else {
            res.json({
                success : false,
                message: "username is required"
            })
        }
    }
})

//GET USER BY ID
app.get("/user/:id", (req, res) => {
    let id = req.params.id;
    let user = users.find(user=>user.id == id);
    res.send(user);
})

//DELETE USER
app.delete("/user/:id", (req, res) => {
    let {id} = req.params;
    users = users.filter(user=>user.id != id);
    res.send(users);
})

//UPDATE USER
app.patch("/user/:id", (req, res) => {
    let {username,password,age} = req.body;
    let id = req.params.id;
    let user = users.find(user=>user.id == id);
    user.username = username;
    user.password = password;
    user.age = age;

    res.send(user);
})

app.post("/login", (req, res) => {
    const user = {
        id: 1,
        username: "test",
        email: ""
    }
})

app.listen(5000, () => {
    console.log("app is running on 5000 port");
})