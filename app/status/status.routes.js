import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import {
	getKey,
	getUserDeadlines,
	getUserTaskStatusById,
	getUserTasksWithStatus,
	getUserTasksWithStatusByLogin,
	updateAllDeadlines,
	updateUserTaskStatus
} from './status.controller.js'

const router = express.Router()

router.route('/').get(protect, getUserTasksWithStatus)
router.route('/:id').get(protect, getUserTaskStatusById)
router.route('/key/:id').get(protect, getKey)
router.route('/:id').put(protect, updateUserTaskStatus)
router.route('/deadline/:id').post(protect, updateAllDeadlines)
router.route('/deadline/:id').get(protect, getUserDeadlines)
router.route('/user').get(protect, requireAdmin, getUserTasksWithStatusByLogin)
export default router
