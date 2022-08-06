/* DEPENDENCIES */
const express = require('express')
const { graphqlHTTP } = require('express-graphql') // to create an Express server that runs a GQL API
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
require('dotenv').config()

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

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    type Query {
        hello: String      
    }
`)

// The root provides a resolver function for each API endpoint
const root = {
    hello: () => {
        return 'Hello World!'
    }
}

// Create Express server
const app = express()

// Create GQL API on top of Express
// Constructs an Express application based on a GraphQL schema
// graphqlHTTP middleware function parses, validates, and executes a GQL request
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Running a GraphQL API server at http://localhost:4000/graphql')
})