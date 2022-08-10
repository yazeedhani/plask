/* DEPENDENCIES */
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


/******** CUSTOM MIDDLEWARE *********/
const requestLogger = require('./util/requestLogger')

/******** ROUTES *******/
const userRoutes = require('./routes/userRoutes')
// console.log('USERROUTES: ', userRoutes)
/* DATABASE CONNECTION */
// connect to the database
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
	useNewUrlParser: true,
})
    .then( () => console.log('MongoDB Connected.'))
    .catch( error => console.log(error))

// save the connection in a variable
const db = mongoose.connection

// create some notification
db.on('open', () => console.log(`Mongoose connected to ${mongoose.connection.host}:${mongoose.connection.port}`))
db.on('close', () => console.log(`You are disconnected from ${mongoose.connection.host}:${mongoose.connection.port}`))
db.on('error', (error) => console.log(error))
/***********************/

// Create Express server
const app = express()

// This will allow our express web server to accept JSON
// add `express.json` Express-provided middleware which will parse JSON requests into
// JS objects before they reach the route files.
// To use the JSON data passed into a request body by parsing it into a JS object.
// Alternative 3rd-party bodyparser package is 'app.use(body-parser.urlencoded({ : false}))'
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

app.use(requestLogger)

app.use(userRoutes)

app.listen(4000, () => {
    console.log('Server running on port 4000')
})