const { model, Schema } = require('mongoose')

const userSchema = new Schema({
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

module.exports = model('User', userSchema)