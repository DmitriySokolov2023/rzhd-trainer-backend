import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import { deleteUser, getAllUser, updateUser } from './user.controller.js'

const router = express.Router()

router.route('/').get(protect, requireAdmin, getAllUser)
router.route('/update/:id').put(protect, requireAdmin, updateUser)
router.route('/delete/:id').delete(protect, requireAdmin, deleteUser)
export default router
