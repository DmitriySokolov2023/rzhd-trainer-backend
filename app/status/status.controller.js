import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const getUserTasksWithStatus = asyncHandler(async (req, res) => {
	const tasksWithStatus = await prisma.task.findMany({
		include: {
			userTaskStatus: {
				where: { userId: +req.params.id }
			}
		}
	})

	res.json(tasksWithStatus)
})

export const updateUserTaskStatus = asyncHandler(async (req, res) => {
	const { answer } = req.body
	const createAnswer = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		},
		select: {
			correctAnswer: true
		}
	})
	if (answer === createAnswer.correctAnswer) {
		console.log(req.user)
		const updateStatus = await prisma.userTaskStatus.update({
			where: {
				userId_taskId: {
					userId: +req.user.userId,
					taskId: +req.params.id
				}
			},
			data: {
				answer: createAnswer.correctAnswer,
				status: true
			}
		})
		res.json(updateStatus)
	} else {
		res.json({
			message: 'Ответ неверный'
		})
	}
})
