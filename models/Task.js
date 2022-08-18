const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskList',
        required: true,
    },
    startTime: {
        type: String,
        default: '-'
    },
    endTime: {
        type: String,
        default: '-'
    }
}, { timestamps: true,})

module.exports = mongoose.model('Task', taskSchema)