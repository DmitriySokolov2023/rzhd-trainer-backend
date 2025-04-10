import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany()

	res.json(user)
})
