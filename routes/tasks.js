const express = require('express')

const router = express.Router()

const Task = require('../models/Task')
const TaskList = require('../models/TaskList')

const { checkResourceOwner } = require('../util/checkOwnership')

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
    
    if(taskListID.length < 23) {
        console.log('TASKLISTID LENGTH: ', taskListID.length)
        res.status(400).send('Task list does not exist')
    }
    if(taskID.length < 23) {
        res.status(400).send('Task does not exist')
    }
    // First make sure taskList and task exists
    const checkTaskList = async (taskListID) => {
        // find task list
        const taskList = await TaskList.findById(taskListID).populate('owner')
        // if task list exists, return it
        if(taskList) {
            return taskList
        }
        // if not, return response
        else {
            res.status(404).send('Task list does not exist')
        }
    }

    const checkTask = async (taskID) => {

        // Find task
        const task = await Task.findById(taskID)
        console.log('TASK:', task)
        // If task exists, return it
        if(task) {
            return task
        }
        // If not, return response
        else {
            res.status(404).send('Task does not exist')
        }
    }

    // If task list exists, then find the task and delete it if it exists then delete it from task list
    // Check if task list exists
    const taskListExists = await checkTaskList(taskListID)
    checkResourceOwner(req, taskListExists)
    // Check if task exists
    const taskExists = await checkTask(taskID)
    
    // Delete task
    if(taskListExists && taskExists) {
        const deletedTask = await Task.findByIdAndDelete(taskID)
        // Delete task from task list
        const updateTaskList = await TaskList.findByIdAndUpdate(taskListID, { $pull: {tasks: taskID} })
        console.log('UPDATED TASK LIST')
        res.status(201).json({taskList: updateTaskList})
    }
})

module.exports = router