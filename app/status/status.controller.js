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
	let correct = false
	const { answer } = req.body
	const { correctAnswer } = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		},
		select: {
			correctAnswer: true
		}
	})
	if (answer === correctAnswer) {
		correct = true
	} else correct = false

	const updateStatus = await prisma.userTaskStatus.update({
		where: {
			userId_taskId: {
				userId: +req.user.userId,
				taskId: +req.params.id
			}
		},
		data: {
			answer: answer,
			status: correct
		}
	})

	res.json(updateStatus)
})
