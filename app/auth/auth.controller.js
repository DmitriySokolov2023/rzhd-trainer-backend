import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

import { generateToken } from './generate-token.js'

export const registerUser = asyncHandler(async (req, res) => {
	const { login, password, role, deadline } = req.body
	console.log(req.body)
	const isHaveUser = await prisma.user.findUnique({
		where: {
			login
		}
	})
	if (isHaveUser) {
		res.status(400)
		throw new Error('Пользователь существует')
	}

	const user = await prisma.user.create({
		data: {
			login,
			password: await hash(password),
			role
		}
	})
	const token = generateToken(user.id)

	const tasks = await prisma.task.findMany()

	const userTaskStatuses = tasks.map(task => ({
		userId: user.id,
		taskId: task.id,
		status: false,
		answer: '',
		deadline: deadline ? deadline : null
	}))

	await prisma.userTaskStatus.createMany({
		data: userTaskStatuses
	})
	res.json({ user, token })
})

export const loginUser = asyncHandler(async (req, res) => {
	const { login, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			login
		}
	})

	const isValidPassword = await verify(user.password, password)

	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({ user, token })
	} else {
		res.status(401)
		throw new Error('Email and password are not correct')
	}
})
