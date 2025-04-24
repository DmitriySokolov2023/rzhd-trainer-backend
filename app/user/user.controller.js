import { hash } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const getAllUser = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany({
		where: {
			role: 'STUDENT'
		}
	})

	res.json(users)
})

export const getUserById = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: +req.params.id
		}
	})

	res.json(user)
})

export const updateUserById = asyncHandler(async (req, res) => {
	const { login, password } = req.body
	const user = await prisma.user.update({
		where: {
			id: +req.params.id
		},
		data: {
			login,
			password: await hash(password)
		}
	})

	res.json(user)
})

export const removeUserById = asyncHandler(async (req, res) => {
	const user = await prisma.user.delete({
		where: {
			id: +req.params.id
		}
	})

	res.json(user)
})
