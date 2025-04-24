import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import { getAllUser } from './user.controller.js'

const router = express.Router()

router.route('/').get(protect, requireAdmin, getAllUser)

export default router
