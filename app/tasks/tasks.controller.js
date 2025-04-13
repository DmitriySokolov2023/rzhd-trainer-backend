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
	const task = await prisma.task.create({
		data: {
			title: req.body.title,
			body: req.body.body,
			imageUrl: req.body.imageUrl,
			durationMin: req.body.durationMin,
			correctAnswer: req.body.correctAnswer
		}
	})

	res.json(task)
})

export const updateTask = asyncHandler(async (req, res) => {
	const task = await prisma.task.update({
		where: {
			id: +req.params.id
		},
		data: {
			title: req.body.title,
			body: req.body.body,
			imageUrl: req.body.imageUrl,
			durationMin: req.body.durationMin,
			correctAnswer: req.body.correctAnswer
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
