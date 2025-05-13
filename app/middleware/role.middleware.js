import { prisma } from '../prisma.js'

export async function requireAdmin(req, res, next) {
	console.log(req.user)
	const user = await prisma.user.findUnique({
		where: {
			id: +req.user.userId
		}
	})
	if (user.role !== 'ADMIN') {
		return res.status(403).json({ error: 'Доступ запрещен' })
	}
	next()
}
