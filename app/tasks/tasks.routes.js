import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import {
	addTask,
	deleteTask,
	getAllTasks,
	getTasksById,
	updateTask
} from './tasks.controller.js'

const router = express.Router()

router.route('/').get(protect, getAllTasks)
router.route('/:id').get(protect, getTasksById)
router.route('/').post(protect, requireAdmin, addTask)
router.route('/:id').put(protect, requireAdmin, updateTask)
router.route('/:id').delete(protect, requireAdmin, deleteTask)

export default router
