import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const addAttempt = asyncHandler(async (req, res) => {
	const { userId, taskId, answer } = req.body
	let isCorrect = false
	// const isHaveAttempt = await prisma.attempt.findUnique({
	// 	where: {
	// 		answer: answer
	// 	}
	// })
	const correct = await prisma.task.findUnique({
		where: {
			id: taskId
		}
	})
	console.log(correct?.correctAnswer[0])
	// if (isHaveAttempt) {
	// 	throw new Error('Такой ответ уже есть')
	// }

	// if (correctAnswer == answer) {
	// 	isCorrect = true
	// }

	// const attempt = await prisma.attempt.create({
	// 	data: {
	// 		userId,
	// 		taskId,
	// 		answer,
	// 		isCorrect
	// 	}
	// })
	res.json(correct)
})
export const checkAnswer = asyncHandler(async (req, res) => {
	const task = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		}
	})
	res.json(task)
})
