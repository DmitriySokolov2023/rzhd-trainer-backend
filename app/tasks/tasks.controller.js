import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const getAllTasks = asyncHandler(async (req, res) => {
	const tasks = await prisma.task.findMany({
		orderBy: {
			id: 'asc'
		}
	})

	res.json(tasks)
})
export const getTasksById = asyncHandler(async (req, res) => {
	const task = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		}
	})

	res.json(task)
})

export const checkAnswer = asyncHandler(async (req, res) => {
	const task = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		}
	})
	res.json(task)
})

export const addTask = asyncHandler(async (req, res) => {
	const { title, body, imageUrl } = req.body
	let correctAnswer = {}
	try {
		correctAnswer = JSON.parse(req.body.correctAnswer || '{}')
	} catch (error) {
		return res.status(400).json({ message: 'Неверный формат correctAnswer' })
	}
	const task = await prisma.task.create({
		data: {
			title,
			body,
			imageUrl: imageUrl === 'null' ? null : imageUrl,
			correctAnswer
		}
	})

	const users = await prisma.user.findMany({
		where: {
			role: 'STUDENT'
		}
	})

	const userTaskStatuses = users.map(user => ({
		userId: user.id,
		taskId: task.id,
		answer: '',
		status: false
	}))

	if (userTaskStatuses.length > 0) {
		await prisma.userTaskStatus.createMany({
			data: userTaskStatuses
		})
	}
	res.json(task)
})

export const updateTask = asyncHandler(async (req, res) => {
	const { title, body, imageUrl } = req.body
	let correctAnswer = {}
	try {
		correctAnswer = JSON.parse(req.body.correctAnswer || '{}')
	} catch (error) {
		return res.status(400).json({ message: 'Неверный формат correctAnswer' })
	}

	const task = await prisma.task.update({
		where: {
			id: +req.params.id
		},
		data: {
			title,
			body,
			imageUrl,
			correctAnswer
		}
	})

	res.json(task)
})

export const deleteTask = asyncHandler(async (req, res) => {
	const task = await prisma.task.delete({
		where: {
			id: +req.params.id
		}
	})

	res.json(task)
})
