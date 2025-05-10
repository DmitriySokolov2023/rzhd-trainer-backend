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
				take: 1 // Так как по схеме у тебя @@unique([userId, taskId])
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

	for (const key in correctAnswer) {
		if (
			(userAnswer[key] || '').trim().toLowerCase() !==
			correctAnswer[key].trim().toLowerCase()
		) {
			errors.push(key)
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
