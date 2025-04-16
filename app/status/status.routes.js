import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	getUserTasksWithStatus,
	updateUserTaskStatus
} from './status.controller.js'

const router = express.Router()

router.route('/:id').get(protect, getUserTasksWithStatus)
router.route('/:id').put(protect, updateUserTaskStatus)
export default router
