const { model, Schema } = require('mongoose')

const taskSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true,})

module.exports = model('Task', taskSchema)