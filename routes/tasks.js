const express = require('express')

const router = express.Router()

const Task = require('../models/Task')
const TaskList = require('../models/TaskList')
const { findByIdAndUpdate } = require('../models/User')

const authenticateToken = require('../util/authenticateToken')

// CREATE a task
router.post('/task/:taskListID', authenticateToken, async (req, res, next) => {
    const taskListID = req.params.taskListID

    const newTask = await Task.create({body: req.body.body, startTime: req.body.startTime, endTime: req.body.endTime, taskList:taskListID, owner: req.user._id})
    const updateTaskList = await TaskList.findByIdAndUpdate(taskListID, { $push: {tasks: newTask} })

    res.status(201).json({ task: newTask.toObject() })
})

// UPDATE a task
router.patch('/task/:taskID', authenticateToken, async (req, res, next) => {
    const taskID = req.params.taskID

    // First make sure taskList and task exists

    // let task = await Task.findByIdAndUpdate(taskID,  {body: req.body.body, startTime: req.body.startTime, endTime: req.body.endTime})
    let task = await Task.findById(taskID)
    let reqBody = req.body
    let updatedTask = Object.assign(task, reqBody)
    console.log('REQ.BODY: ', reqBody)
    console.log('TASK FOUND FOR UPDATE: ', task)
    console.log('UPDATE TASK: ', updatedTask)
    task = updatedTask
    task.save()
    res.status(201).json({ updatedTask: task })
})

// DELETE a task
router.delete('/task/:taskListID/:taskID', authenticateToken, async (req, res, next) => {
    const taskListID = req.params.taskListID
    const taskID = req.params.taskID

    // First make sure taskList and task exists

    // Delete task
    const deletedTask = await Task.findByIdAndDelete(taskID)
    // Delete task from task list
    const updateTaskList = await TaskList.findByIdAndUpdate(taskListID, { $pull: {tasks: taskID} })
    console.log('UPDATED TASK LIST')
    res.status(201).json({taskList: updateTaskList})
})

module.exports = router