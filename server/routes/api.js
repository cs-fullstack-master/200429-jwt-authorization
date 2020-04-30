// import express
let express = require('express');
// create router
let router = express.Router();
// json middleware
router.use(express.json());

// Sanity endpoint for testing
router.get('/', (req, res) => {
    res.send(`<h1>Success!</h1>`);
});

// create references for modules and key needed for authentication and encryption
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let secretKey = require("../config/keys").secretKey;

// mongo collection
let UserCollection = require('../models/UserSchema');

// Endpoint for registration
router.post('/register', (req, res) => {

    console.log(`Hit Register endpoint`); // sanity msg

    // check that email does not already exist in database
    UserCollection.findOne({ email: req.body.email })
        .then((user) => {
            // if email already exists in database
            if (user) {
                // send `already exists` message
                res.json({ error: `User with ${req.body.email} already exists` });
            }
            // if user does not already exist in database
            else {
                // define new user from User Model
                let newUser = new UserCollection(
                    {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                );
                // encrypt password
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        // If hash has errors send error message
                        if (error) {
                            console.log("Password has not been hashed")
                            res.status(500).json({ error: error });
                        }
                        // if hash does not have errors
                        else {
                            // set password of new user to hashed password
                            newUser.password = hash
                            // save new user
                            newUser.save()
                                // and send new user
                                .then(user => res.json(user));
                        }
                    });
                })
            }
        });
});

// Login user endpoint
router.post('/login', (req, res) => {
    console.log(`Hit Login Endpoint`); // sanity

    // check that email exists in the database
    UserCollection.findOne({ email: req.body.email })
        .then(user => {
            // if email does not exist send 403 message
            if (!user) {
                res.status(403).json({ error: `User with email ${req.body.email} not found` })
            }
            // if user does exist
            else {
                // compare password passed in request body with hashed password in database
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        // if passwords match
                        if (isMatch) {
                            // define payload with id and name properties from database
                            // Include ANYTHING we will need later to authorize access
                            // to features/endpoints in our application.
                            let payload = {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: "General User"
                            }

                            // create JWT using `sign()` method passing in payload
                            jwt.sign(payload, secretKey, { expiresIn: 3600 }, (error, token) => {
                                // if errors send errors, otherwise send token as object
                                error ? res.status(403).json({ error: error }) : res.json({ token: `Bearer ${token}` });
                            });
                        }
                        // if passwords don't match send 404 message
                        else {
                            res.status(403).json({ error: `User with email ${req.body.email} incorrect password` });
                        }
                    });
            }
        });
});

// Endpoints for Comments
let CommentsCollection = require('../models/CommentSchema');

// get all comments
router.get('/comment', authenticateToken, (req, res) => {
    CommentsCollection.find(
        {commentUser : req.user.email}, (error, result) => {
            error ? res.send(error) : res.send(result)
        }
    ).sort({date:-1}); // sort in descending order (newest first)
});

// create a comment
router.post('/comment', authenticateToken, (req, res) => {
    CommentsCollection.create(req.body, (error, results) => {
        error ? res.send(error) : res.send(results)
    });
});

// JWT Utility Method/endpoints

// Extract the payload from a token and return the payload
// FIXME Rename endpoint to something like /jwtpayload

router.post('/jwtpayload', verifyToken, (req, res) => {
    // res.send("Secret");
    jwt.verify(req.token, secretKey, (errors, results) => {
        errors ? res.status(500).json({ error: JSON.stringify(errors) }) : res.json({ message: results });
    })
});

// TODO Likely can be replaced by authenticateToken below
function verifyToken(req, res, next) {
    // console.log("verify token");
    let bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        req.token = bearerToken;
        console.log(req.token);
        next();
    } else {
        res.status(403).json({ error: "Forbidden" });
    }
}

////////////////// VERIFICATION MIDDLEWARE FOR ENDPOINTS ///////////////////

// Middleware function used by any endpoint that wants to require a verified user
// Authenticate Token is valid
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        return res.status(401);
    }
    else {
        // Now verify the token
        jwt.verify(token, secretKey, (errors, user) => {
            if (errors) {
                res.status(403).json({ error: "verification error" });
            }
            else {
                req.user = user; // Add to request header before returning
                next();
            }
        })
    }
}


module.exports = router;