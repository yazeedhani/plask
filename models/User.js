const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    accessToken: String,
    refreshToken: String
},
{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)