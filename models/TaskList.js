const { model, Schema } = require('mongoose')

const taskListSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = model('TaskList', taskListSchema)