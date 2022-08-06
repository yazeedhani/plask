/* All authentication happens here */
// Operations handled here:
// - Register
// - Login
// - Logout
// - Refresh Token

// Why do we need a Refresh Token?
// An Access Token with no expiration date is a vulnerability because if anyone has access to that token,
// then an unathorized user can continuously make requests to the API and have access to its resources (data) from that user's account,
// since a user's info is stored in the JWT. They are able to make constant API requests as the original user.
// To secure your Access Token, set an expiration date on it. If you are still using the application and 
// your Access Token expires, then you can use a Refresh Token to generate a new Access Token so you could 
// still use the program without having to log back in.
// So, if a malicious user get a hold of the Access Token, then they only have access until it expires and access gets revoked
// and now needs to use the Refresh Token to get a new Access Token.
// However, if a malicious user has access to the Refresh Token, then they can use it to constantly generate a new Access Token.
// So to solve this issue, delete the Refresh Token when you logout
// NOTE: the main reason to use Refresh Tokens is to invalidate access to users who shouldn't have access.

// Import express to create a web server using routes
const express = require('express')
// Import bcrypt to hash user passwords and salts
const bcrypt = require('bcrypt')
// Create express server and call it app
const app = express()

require('dotenv').config()

// Import jsonwebtoken to be able to generate JWTs
const jwt = require('jsonwebtoken')

const { validateRegisterInput, validateLoginInput } = require('./util/validators')

// Store this in DB in real scenario
const users = []

// Function that generates an Access JWT
function generateAccessToken(user) {
    // user - payload
    // process.env.ACCESS_TOKEN_SECRET - Secret Key
    // This will create a token signature that will be a part of the JWT
    // User can now access REST endpoints since user info is stored in the JWT
   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1min" })
}

// Store Refresh Tokens here.
// NOTE: Normally, you should store these Refresh Tokens in a database
let refreshTokens = []

// This will allow our express web server to accept JSON
// add `express.json` Express-provided middleware which will parse JSON requests into
// JS objects before they reach the route files.
// To use the JSON data passed into a request body by parsing it into a JS object.
// Alternative 3rd-party bodyparser package is 'app.use(body-parser.urlencoded({ : false}))'
// The method `.use` sets up middleware for the Express application
app.use(express.json())


// Generates a new ACCESS JWT
// How to use this on the front-end: store the token in local storage.
//  The token is set to expire in a certain amount of time.
//  Set a timer on the front-end that checks local storage for a token.
//  If there is no token, request token with refreshToken in authorization header
app.post('/token', (req, res, next) => {
    // Check to see if you already have a Refresh Token
    // Check the refreshTokens[] above, but normally you would check your DB.
    const refreshToken = req.body.token
    console.log('REFRESH TOKEN: ', refreshToken)
    // If no Refresh Token was sent in request body
    if(refreshToken === null) return res.sendStatus(401)
    // Does this refreshToken still exist/valid or has it been removed
    // If the refreshToken is not valid, user is not authorized at this point
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    // At this point, all the checks were passed meaning the refreshToken exists and is valid
    // Verify the refreshToken to ensure it hasn't been tampered with
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) {return res.sendStatus(403)}
        // Generate a new Access JWT
        else {
            // We only want the 'name' property from the 'user' object
            const accessToken = generateAccessToken({ name: user.name})
            res.json({accessToken: accessToken})
        }

    })
})

// Async b/c bcrypt is an async library
app.post('/register', async (req, res) => {
    console.log("REQ.BODY: ", req.body)
    // Middleware that checks if the username exists, validate username, email and password formats
    const {valid, errors} = validateRegisterInput(req.body.username, req.body.email, req.body.password, req.body.confirmPassword)

    // Checks if register input is valid
    if(!valid)
    {
        // throw new Error('Errors', { errors })
        return res.status(400).send({errors})
    }

    // Make sure user does not already exist
    const userSearched = users.find( user => user.username === req.body.username)
    // If user is null or undefined
    if(userSearched) {
        errors.usernameNotExists = 'Username already exists'
        return res.status(400).send({errors})
    }

    // At this point, user does not exist

    try {
        // Hash the password/ 2 steps:
        // 1 - Create salt: without a salt, if all users have the same password,
        //      then the hashed password will be the same, and if one hashed password
        //      gets cracked, then all passwords that look the same will be cracked too.
        //      A salt is a unique sequence of random characters added to the beginning of a password
        //      before the password gets hashed. This means that users can have the same 
        //      password, but each user will have a different salt. Therefore, if one
        //      hashed password gets cracked, the other same passwords won't because of the salt.
        // Ex. $2b$10$JNP6YQF/iERnGyj1e0Wixu
        const salt = await bcrypt.genSalt() // 10 rounds by default
        // 2 - Use salt and password to create hashed password
        // Salt will be stored in hashedPassword. No need to store it anywhere else.
        // Ex. $2b$10$JNP6YQF/iERnGyj1e0WixuOnIRHd8eszdu3S6lq7rs9V51sx7WzIm
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log('SALT: ', salt)
        console.log('HASHED PASSWORD: ', hashedPassword)
        // Create the user
        const user = { username: req.body.username, password: hashedPassword, email: req.body.email }
        // Save in 'users' array
        users.push(user)
        // console.log('REQ.BODY: ', req.body)
        res.status(201).send('User registered successfully')
    }
    catch {
        res.status(500).send()
    }
})

// Async b/c bcrypt is an async library
app.post('/login', async (req, res) => {
    console.log('REQ.BODY: ', req.body)
    // Create middleware that validates user login input; empty username and/or password
    const { valid, errors } = validateLoginInput(req.body.username, req.body.password)

    // Check if username and/or password fields are empty
    if(!valid)
    {
        return res.status(400).send({errors})
    }

    /* Authenticate User */
    // Find and check username
    const userSearched = users.find( user => user.username === req.body.username)
    console.log('USER: ', userSearched)
    // If user is null or undefined
    if(!userSearched) {
        errors.userNotFound = 'User not found'
        return res.status(400).send({errors})
    }
    // At this point, user exists
    // Compare typed password with stored password using bcrypt
    try {
        // This will get the salt out of the stored and fetched userSearched.password.
        // It will take the salt and hash req.body.password with it
        // and make sure they both have matching hashed passwords.
        // This is why the salt is important.
        if(await bcrypt.compare(req.body.password, userSearched.password)) {
            console.log('User successfully authenticated.')
        }
        // User typed in incorrect password
        else {
            res.send('Not allowed')
        }
    }
    // This will throw an error if for example we get undefined or whatever
    catch {
        res.status(500).send()
    }

    // The user has been authenticated at this point
    
    /* Now, authenticate and serialize this user with a JWT */
    const username = req.body.username
    
    const email = req.body.email
    // Maybe add the token to 'user' object to be able to overwrite it when user signs out???????
    // Dummy ID. This will be retrieved from DB
    const user = { id: 22, name: username} 

    /* Create ACCESS JWT */
    const accessToken = generateAccessToken(user)
    /* Create REFRESH JWT */
    // This is used to create a new ACCESS JWT
    // We use the same 'user' object because when we generate a new Access JWT, we want the same user stored in it.
    // No expiration data for this token since we will manually expire it when the user logs out.
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    // Store refreshToken in refreshTokens[] above
    refreshTokens.push(refreshToken)
    // Add accessToken and refreshToken to user object
    user.accessToken = accessToken
    user.refreshToken = refreshToken
    console.log('USER: ', user)
    // Return access and refresh JWTs to the user (Send this to the front-end)
    res.status(200).send({user})
    // res.json(user)
})

// Logs user out and deletes the user's Refresh JWT
app.delete('/logout', (req, res, next) => {
    // Normally, delete from DB
    // This deletes the user's Refresh JWT so that when they logout, no new Access JWTs can be created
    refreshTokens = refreshTokens.filter( token => token !== req.body.token)
    res.sendStatus(204)
})

// authServer listening for requests on port 4000
app.listen(6000, () => {
    console.log('Auth Server running on port 6000')
})