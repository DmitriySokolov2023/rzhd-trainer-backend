import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const protect = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization
	if (!authHeader) {
		return res.status(401).json({ error: 'No authorization header' })
	}

	const token = authHeader.split(' ')[1]
	if (!token) {
		return res.status(401).json({ error: 'No token provided' })
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		req.user = decoded
		next()
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expired' })
		}
		if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Invalid token' })
		}

		return res.status(401).json({ error: 'Authorization failed' })
	}
})
