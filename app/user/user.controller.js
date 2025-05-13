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

export const updateUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { login, password } = req.body

	const dataToUpdate = {}

	if (login) {
		// Проверка, что login уникален
		const existingUser = await prisma.user.findUnique({
			where: { login }
		})

		if (existingUser && existingUser.id !== id) {
			res.status(400)
			throw new Error('Пользователь с таким логином уже существует')
		}

		dataToUpdate.login = login
	}

	if (password) {
		dataToUpdate.password = await hash(password)
	}

	if (Object.keys(dataToUpdate).length === 0) {
		return
	}

	const user = await prisma.user.update({
		where: { id: +id },
		data: dataToUpdate
	})

	res.json({ user })
})
export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params

	const user = await prisma.user.delete({
		where: { id: +id }
	})

	res.json({ user })
})
