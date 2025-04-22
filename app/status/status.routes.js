import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import {
	getUserTasksWithStatus,
	updateUserTaskStatus
} from './status.controller.js'

const router = express.Router()

router.route('/').get(protect, getUserTasksWithStatus)
router.route('/:id').put(protect, updateUserTaskStatus)
router.route('/:login').put(protect, requireAdmin, updateUserTaskStatus)
export default router
