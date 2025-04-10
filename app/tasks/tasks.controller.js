import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const getAllTasks = asyncHandler(async (req, res) => {
	const tasks = await prisma.tasks.findMany({
		orderBy: {
			id: 'asc'
		}
	})

	res.json(tasks)
})
export const getTasksById = asyncHandler(async (req, res) => {
	const tasks = await prisma.tasks.findUnique({
		where: {
			id: +req.params.id
		}
	})

	res.json(tasks)
})
export const addTask = asyncHandler(async (req, res) => {
	const { task } = req.body
	const tasks = await prisma.tasks.create({
		data: {
			task
		}
	})

	res.json(tasks)
})

export const updateTasks = asyncHandler(async (req, res) => {
	const { task, status } = req.body
	const tasks = await prisma.tasks.update({
		where: {
			id: +req.params.id
		},
		data: {
			task,
			status
		}
	})

	res.json(tasks)
})

export const deleteTasks = asyncHandler(async (req, res) => {
	const tasks = await prisma.tasks.delete({
		where: {
			id: +req.params.id
		}
	})

	res.json(tasks)
})
