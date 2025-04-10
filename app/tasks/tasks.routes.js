import express from 'express'

import {
	addTask,
	deleteTasks,
	getAllTasks,
	getTasksById,
	updateTasks
} from './tasks.controller.js'

const router = express.Router()

router.route('/').get(getAllTasks)
router.route('/:id').get(getTasksById)
router.route('/').post(addTask)
router.route('/:id').put(updateTasks)
router.route('/:id').delete(deleteTasks)

export default router
