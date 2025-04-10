import 'colors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import { prisma } from './app/prisma.js'
import tasksRoutes from './app/tasks/tasks.routes.js'
import userRoutes from './app/user/user.routes.js'

dotenv.config()

const app = express()

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(express.json())
	// app.use('/api/auth', authRoutes)
	app.use('/api/tasks', tasksRoutes)
	app.use('/api/user', userRoutes)

	const PORT = process.env.PORT || 5000

	app.listen(
		PORT,
		console.log(
			`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
				.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
