const express = require('express')

const router = express.Router()

const TaskList = require('../models/TaskList')

const authenticateToken = require('../util/authenticateToken')

// GET all task lists
router.get('/tasklists', authenticateToken, async (req, res, next) => {

    const AllTaskListsForUser = await TaskList.find({owner: req.user._id}).populate('tasks')

    const AllTaskListsForUserObjects = AllTaskListsForUser.map( taskList => taskList.toObject())

    res.status(200).json({AllTaskListsForUserObjects})
})

// CREATE a task list
router.post('/tasklists', authenticateToken, (req, res, next) => {
    req.body.owner = req.user._id
    TaskList.create(req.body)

    res.status(201).json({taskList: req.body})
})

// UPDATE a task list
router.patch('/taskLists/:taskListID', authenticateToken, async (req, res, next) => {
    const taskListID = req.params.taskListID

    const taskList = await TaskList.findById(taskListID)
    console.log('TASKLIST: ', taskListID)

    taskList.date = req.body.date
    taskList.save()

    res.status(201).json({ taskList: taskList})
})

// DELETE a task list
router.delete('/tasklists/:id', authenticateToken, async (req, res, next) => {
    const taskListID = req.params.id

    const deleteTaskList = await TaskList.findByIdAndDelete(taskListID)

    res.status(201).send('Task list deleted')
})

module.exports = router