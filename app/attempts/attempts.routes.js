import express from 'express'

import { addAttempt } from './attempts.controller.js'

const router = express.Router()

router.route('/').post(addAttempt)

export default router
