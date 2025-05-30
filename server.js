import 'colors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import { errorHandler, notFound } from './app/middleware/error.middleware.js'

import authRoutes from './app/auth/auth.routes.js'
import { prisma } from './app/prisma.js'
import statusRoutes from './app/status/status.routes.js'
import tasksRoutes from './app/tasks/tasks.routes.js'
import userRoutes from './app/user/user.routes.js'

dotenv.config()

const app = express()
const __dirname = path.resolve()

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(express.json())
	// app.use(
	// 	cors({
	// 		origin: 'http://109.184.79.10:5000', // в проде — укажи домен
	// 		credentials: true
	// 	})
	// )
	// app.use(cors({ origin: true, credentials: true }))
	app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
	app.use('/api/task', tasksRoutes)
	app.use('/api/auth', authRoutes)
	app.use('/api/status', statusRoutes)
	app.use('/api/user', userRoutes)

	// 👇 Фронтенд (React build)
	app.use(
		express.static(path.join(__dirname, '..', 'rzhd-trainer-frontend', 'dist'))
	) // или build
	app.get('*', (req, res) => {
		res.sendFile(
			path.join(__dirname, '..', 'rzhd-trainer-frontend', 'dist', 'index.html')
		) // или build
	})

	app.use(notFound)
	app.use(errorHandler)

	const PORT = process.env.PORT || 5000
	app.listen(PORT, '0.0.0.0', () => {
		console.log(
			`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
				.bold
		)
	})
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
