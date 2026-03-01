import { Router } from 'express'
import pool from '../db/connection.js'
import {
  authenticateToken,
  authorizeRoles,
  optionalAuthenticateToken,
} from '../middleware/auth.js'
import { AppError } from '../utils/appError.js'

const router = Router()

// GET /api/jobs - list all jobs
router.get('/', authenticateToken, authorizeRoles('student', 'company', 'tpo', 'admin'), async (req, res, next) => {
  try {
    let rows
    if (req.user?.role === 'company') {
      ;[rows] = await pool.execute(
        `SELECT j.id, j.title, j.company, j.ctc, j.location, j.status, j.created_at
         FROM jobs j
         WHERE j.created_by = ?
         ORDER BY j.created_at DESC`,
        [req.user.id]
      )
    } else {
      ;[rows] = await pool.execute(
        `SELECT j.id, j.title, j.company, j.ctc, j.location, j.status, j.created_at
         FROM jobs j ORDER BY j.created_at DESC`
      )
    }
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// GET /api/jobs/:id - get single job
router.get('/:id', optionalAuthenticateToken, async (req, res, next) => {
  try {
    let rows
    if (req.user?.role === 'company') {
      ;[rows] = await pool.execute(
        'SELECT * FROM jobs WHERE id = ? AND created_by = ?',
        [req.params.id, req.user.id]
      )
    } else {
      ;[rows] = await pool.execute(
        'SELECT * FROM jobs WHERE id = ?',
        [req.params.id]
      )
    }

    if (!rows.length) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')
    }
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// POST /api/jobs - create job (admin/company)
router.post('/', authenticateToken, authorizeRoles('admin', 'company'), async (req, res, next) => {
  try {
    const { title, company, ctc, location, description, requirements } = req.body
    if (!title || !company) {
      throw new AppError('Title and company required', 400, 'VALIDATION_ERROR')
    }
    const [result] = await pool.execute(
      `INSERT INTO jobs (title, company, ctc, location, description, requirements, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 'open', ?)`,
      [
        title,
        company,
        ctc || null,
        location || null,
        description || null,
        requirements || null,
        req.user.id,
      ]
    )
    res.status(201).json({ id: result.insertId, title, company, status: 'open' })
  } catch (err) {
    next(err)
  }
})

// PUT /api/jobs/:id - update job
router.put('/:id', authenticateToken, authorizeRoles('admin', 'company'), async (req, res, next) => {
  try {
    const { title, company, ctc, location, description, requirements, status } = req.body
    const params = [title, company, ctc, location, description, requirements, status || 'open', req.params.id]
    let sql =
      `UPDATE jobs SET title=?, company=?, ctc=?, location=?, description=?, requirements=?, status=?
       WHERE id=?`
    if (req.user.role === 'company') {
      sql += ' AND created_by = ?'
      params.push(req.user.id)
    }
    const [result] = await pool.execute(sql, params)
    if (result.affectedRows === 0) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')
    }
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/jobs/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'company'), async (req, res, next) => {
  try {
    let result
    if (req.user.role === 'company') {
      ;[result] = await pool.execute(
        'DELETE FROM jobs WHERE id = ? AND created_by = ?',
        [req.params.id, req.user.id]
      )
    } else {
      ;[result] = await pool.execute(
        'DELETE FROM jobs WHERE id = ?',
        [req.params.id]
      )
    }
    if (result.affectedRows === 0) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')
    }
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
