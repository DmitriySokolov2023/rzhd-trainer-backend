import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'

import { protect } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/role.middleware.js'

import {
	addTask,
	deleteTask,
	getAllTasks,
	getTasksById,
	updateTask
} from './tasks.controller.js'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)

		const originalName = path.basename(file.originalname, ext)

		const filePath = path.join('uploads', file.originalname)

		fs.access(filePath, fs.constants.F_OK, err => {
			if (!err) {
				return cb(new Error('Файл с таким именем уже существует!'), false)
			}
			cb(null, file.originalname)
		})
	}
})

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Только изображения!'), false)
		}
		cb(null, true)
	}
})

const router = express.Router()

router.route('/').get(protect, getAllTasks)
router.route('/:id').get(protect, getTasksById)
router.route('/').post(upload.single('file'), protect, requireAdmin, addTask)
router
	.route('/:id')
	.put(upload.single('file'), protect, requireAdmin, updateTask)
router.route('/:id').delete(protect, requireAdmin, deleteTask)

export default router
