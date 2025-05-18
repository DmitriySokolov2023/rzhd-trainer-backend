import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const getUserTasksWithStatus = asyncHandler(async (req, res) => {
	const tasksWithStatus = await prisma.task.findMany({
		include: {
			userTaskStatus: {
				where: { userId: +req.user.userId }
			}
		}
	})

	res.json(tasksWithStatus)
})

export const updateAllDeadlines = asyncHandler(async (req, res) => {
	const userId = +req.params.id
	const { deadline } = req.body

	if (!deadline) {
		return res.status(400).json({ message: 'Deadline is required' })
	}

	try {
		await prisma.userTaskStatus.updateMany({
			where: { userId },
			data: { deadline: new Date(deadline) }
		})

		res.json({ message: 'Deadlines updated successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
})

export const getUserDeadlines = asyncHandler(async (req, res) => {
	const userId = +req.params.id

	try {
		const deadlines = await prisma.userTaskStatus.findMany({
			where: {
				userId,
				deadline: {
					not: null
				}
			},
			select: {
				deadline: true
			}
		})

		if (!deadlines?.length) {
			return res.json({ deadline: null })
		}

		res.json(deadlines[0])
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: error })
	}
})

export const getUserTaskStatusById = asyncHandler(async (req, res) => {
	const userId = +req.user.userId // замените на актуальный userId
	const taskId = +req.params.id

	const { userTaskStatus } = await prisma.task.findUnique({
		where: {
			id: taskId
		},
		include: {
			userTaskStatus: {
				where: {
					userId: userId
				},
				take: 1
			}
		}
	})

	res.json(userTaskStatus)
})
export const getUserTasksWithStatusByLogin = asyncHandler(async (req, res) => {
	const { id } = await prisma.user.findUnique({
		where: {
			login: req.body.login
		}
	})

	const tasksWithStatus = await prisma.task.findMany({
		include: {
			userTaskStatus: {
				where: { userId: +id }
			}
		}
	})

	res.json(tasksWithStatus)
})
export const updateUserTaskStatus = asyncHandler(async (req, res) => {
	const errors = []
	const { userAnswer } = req.body
	const { correctAnswer } = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		},
		select: {
			correctAnswer: true
		}
	})
	console.log(userAnswer)
	console.log(correctAnswer)
	for (const key in correctAnswer) {
		if (
			(userAnswer[key] || '').toLowerCase().replace(/\s+/g, '') !==
			correctAnswer[key].toLowerCase().replace(/\s+/g, '')
		) {
			errors.push(key)
			console.log(errors)
		}
	}

	if (Object.keys(errors).length === 0) {
		const updateStatus = await prisma.userTaskStatus.update({
			where: {
				userId_taskId: {
					userId: +req.user.userId,
					taskId: +req.params.id
				}
			},
			data: {
				answer: userAnswer,
				status: Object.keys(errors).length === 0
			}
		})
		res.json(['Зачтено'])
	} else res.json(errors)
})

export const getKey = asyncHandler(async (req, res) => {
	const { correctAnswer } = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		},
		select: {
			correctAnswer: true
		}
	})
	res.json(Object.keys(correctAnswer))
})
