import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import {
	getUserTaskStatusById,
	getUserTasksWithStatus,
	getUserTasksWithStatusByLogin,
	updateAllDeadlines,
	updateUserTaskStatus
} from './status.controller.js'

const router = express.Router()

router.route('/').get(protect, getUserTasksWithStatus)
router.route('/:id').get(protect, getUserTaskStatusById)
router.route('/:id').put(protect, updateUserTaskStatus)
router.route('/deadline/:id').post(protect, updateAllDeadlines)
router.route('/user').get(protect, requireAdmin, getUserTasksWithStatusByLogin)
export default router
