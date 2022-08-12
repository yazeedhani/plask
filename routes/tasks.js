const express = require('express')

const router = express.Router()

const Task = require('../models/Task')
const TaskList = require('../models/TaskList')

const authenticateToken = require('../util/authenticateToken')

router.post('/task/:taskListID', authenticateToken, async (req, res, next) => {
    const taskListID = req.params.taskListID

    const newTask = await Task.create({body: req.body.body, taskList:taskListID, owner: req.user._id})
    const updateTaskList = await TaskList.findByIdAndUpdate(taskListID, { $push: {tasks: newTask} })

    return res.status(201).json({ task: newTask.toObject() })
})

router.delete('/task/:taskListID/:taskID', authenticateToken, async (req, res, next) => {
    const taskListID = req.params.taskListID
    const taskID = req.params.taskID

    const deletedTask = await Task.findByIdAndDelete(taskID)
    const updateTaskList = await TaskList.findByIdAndUpdate(taskListID, { $pull: {tasks: taskID} })
    console.log('UPDATED TASK LIST')
    return res.status(201).json({taskList: updateTaskList})
})

module.exports = router