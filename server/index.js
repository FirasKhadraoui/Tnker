const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const secretKey = "secretkey";
app.use(bodyParser.json());
app.use(cors());

let users = [
    {
        "id": "iEuOBYkU",
        "username": "user1",
        "password": "1111",
        "age": "11"
    },
    {
        "id": "ukjXyUuM",
        "username": "user2",
        "password": "0000",
        "age": "17"
    }
];

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
        jwt.sign((req.body), secretKey, { expiresIn: '3000s' }, (err, token) => {
            res.json({
                success: true,
                message: "user created successfully",
                access_token: token,
                user: req.body
            })
        })
    }
    else {
        if (req.body.age <= 0) {
            res.json({
                success: false,
                message: "age must be > 0"
            })
        }
        else {
            res.json({
                success: false,
                message: "username is required"
            })
        }
    }
})

//GET USER BY ID
app.get("/user/:id", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.json({
                success: false,
                message: "failed to fetch user with this token " + req.token
            })
        } else {
            let id = req.params.id;
            let user = users.find(user => user.id == id);
            if (user) {
                res.json({
                    success: true,
                    message: user
                })
            }
            else {
                res.json({
                    message: "user doesn't exist"
                })
            }
        }
    })
})

//DELETE USER
app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    users = users.filter(user => user.id != id);
    try {
        res.json({
            success: true,
            message: "user deleted successfully"
        })
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
})

//UPDATE USER
app.patch("/user/:id", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.json({
                success: false,
                message: "error message for example token is invalid"
            })
        } else {
            let { username, password, age } = req.body;
            let id = req.params.id;
            let user = users.find(user => user.id == id);
            user.username = username;
            user.password = password;
            user.age = age;
            res.json({
                success: true,
                message: "user updated successfully",
            })
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    }
    else {
        res.send({
            result: 'Token is not valid'
        })
    }
}

app.listen(5000, () => {
    console.log("app is running on 5000 port");
})