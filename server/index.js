const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

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

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:5000",
			},
		],
	},
	apis: ["index.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of user
 *         password:
 *           type: string
 *           description: The password
 *         age:
 *           type: number
 *           description: Age of user
 * 
 *       example:
 *         username: Firas
 *         password: 1111
 *         age: 25
 */
//SIMPLE TEST
app.get("/", (req, res) => {
    res.json({
        message: "a simple api for test"
    })
})

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
//GET ALL USERS
app.get("/user", (req, res) => {
    res.send(users);
})

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

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

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * /user/{id}:
 *  patch:
 *    summary: Update the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

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