// const  { AuthenticationError } = require('apollo-server')

// To decode the token we get in a request header
const jwt = require('jsonwebtoken')
// We need this to acces SECRET_KEY to decode the token since we used it to encode it
require('dotenv').config()


// This function checks if the user is logged in
// Basically, if the user is logged in, then they should have a token
// which authorizes them to create task lists and tasks, delete their own task lists and tasks.
module.exports = (context) => {
    // context = {...headers}

    // Get the header because this is where the token is
    const authHeader = context.req.headers.authorization
    console.log(authHeader)
    // Check to see if the header was sent with the request
    // If there is a header, get the token from it.
    if(authHeader)
    {
        // Get the token from the header.
        // Bearer [token]
        const token = authHeader.split('Bearer ')[1]
        console.log('TOKEN:', token)
        // Check to see if there is a token in the header.
        // If there is a token in the header, verify if it is still valid and not expired.
        if(token)
        {
            try {
                // jwt.verify returns a decoded object(the user object) that we stored the token in.
                // jwt.verify() takes the header and payload from token and hashed it with SECRE_KEY using crypto algo from header
                // to create a signature and compare it to the signature in token.
                // If both signatures match, then token has not been tampered with and payload will be returned, otherwise, token is invalid.
                const user = jwt.verify(token, process.env.SECRET_KEY)
                // return logged in user
                return user
            }
            catch (err) {
                throw new Error('Invalid/Expired token')
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authorization header must be provided')
}