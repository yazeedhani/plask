const express = require('express')

const router = express.Router()

const TaskList = require('../models/TaskList')

const authenticateToken = require('../util/authenticateToken')

router.get('/tasklists', authenticateToken, async (req, res, next) => {

    const AllTaskListsForUser = await TaskList.find({owner: req.user_id})

    const AllTaskListsForUserObjects = AllTaskListsForUser.map( taskList => taskList.toObject())

    res.status(200).json({AllTaskListsForUserObjects})
})

module.exports = router