import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'
import { authenticateToken } from '../middleware/auth.js'
import { AppError } from '../utils/appError.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body
    if (!email || !password || !role) {
      throw new AppError(
        'Email, password and role required',
        400,
        'VALIDATION_ERROR'
      )
    }
    const hash = await bcrypt.hash(password, 10)
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
      [email, hash, role, name || email.split('@')[0]]
    )
    const userId = result.insertId
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      token,
      user: { id: userId, email, role, name: name || email.split('@')[0] },
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return next(new AppError('Email already registered', 409, 'EMAIL_TAKEN'))
    }
    return next(err)
  }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new AppError('Email and password required', 400, 'VALIDATION_ERROR')
    }
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, role, name FROM users WHERE email = ?',
      [email]
    )
    if (!rows.length) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }
    const user = rows[0]
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || user.email.split('@')[0],
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, role, name FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    }
    const user = rows[0]
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || user.email.split('@')[0],
    })
  } catch (err) {
    next(err)
  }
})

export default router
