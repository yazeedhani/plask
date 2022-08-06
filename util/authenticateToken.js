// Import jsonwebtoken to be able to verify JWTs
const jwt = require('jsonwebtoken')

require('dotenv').config()

// MIDDLEWARE to verify JWT and return the JWT's user stored inside it when sent with request to access an endpoint.
const authenticateToken = (req, res, next) => {
    // Get the JWT sent by the user from the request authorization header
    // Token stored in auth header as 'Bearer TOKEN'
    console.log('REQ.HEADERS: ', req.headers)
    const authHeader = req.headers['authorization']
    // Gets the token portion after Bearer
    // Verify we have a header first. If we do, return the token, otherwise, return null
    const token = authHeader && authHeader.split(' ')[1]
    console.log('TOKEN: ', token)
    if(token === null) {
        return res.sendStatus(401)
    }
    // Verify token and that this is the correct user
    // This is where the JWT signature is verified
    // It takes the JWT header and payload and hashes it with secret key using the crypto algorithm
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // 403 Unauthorized (Forbidden) - meaning we see you have a JWT, but it is no longer valid.
        if(err) {
            return res.sendStatus(403)
        }
        // This means you are authorized and set user in req to be able to access it in the REST endpoint
        // user object here is brought in from the /login route where we serialzed user object (user) whenever a user logs in
        // Then return that user to the GET /posts endpoint
        req.user = user
        // Once this middleware is done, move on to the next middleware function
        next()
    })
}

module.exports = authenticateToken