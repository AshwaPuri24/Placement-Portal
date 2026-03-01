import { Router } from 'express'
import pool from '../db/connection.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'
import { AppError } from '../utils/appError.js'

const router = Router()

// GET /api/users?role=student|company|tpo&q=search
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'tpo'),
  async (req, res, next) => {
    try {
      const { role, q } = req.query
      const where = []
      const params = []

      if (role) {
        where.push('role = ?')
        params.push(role)
      }
      if (q) {
        where.push('(name LIKE ? OR email LIKE ?)')
        params.push(`%${q}%`, `%${q}%`)
      }

      const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
      const [rows] = await pool.execute(
        `SELECT id, name, email, role, created_at AS createdAt
         FROM users
         ${whereClause}
         ORDER BY created_at DESC`,
        params
      )
      res.json(rows)
    } catch (err) {
      next(err)
    }
  }
)

export default router
