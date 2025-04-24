import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import {
	getUserTasksWithStatus,
	getUserTasksWithStatusByLogin,
	updateUserTaskStatus
} from './status.controller.js'

const router = express.Router()

router.route('/').get(protect, getUserTasksWithStatus)
router.route('/:id').put(protect, updateUserTaskStatus)
router.route('/user').get(protect, requireAdmin, getUserTasksWithStatusByLogin)
export default router
