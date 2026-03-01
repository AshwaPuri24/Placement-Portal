import { Router } from 'express'
import pool from '../db/connection.js'
import { authenticateToken, authorizeRoles } from '../middleware/auth.js'
import { AppError } from '../utils/appError.js'

const router = Router()

function normaliseProfileRow(row) {
  return {
    tenthPercentage: row.tenth_percentage,
    twelfthPercentage: row.twelfth_percentage,
    backlogs: row.backlogs,
    graduationYear: row.graduation_year,
    programmingLanguages: row.programming_languages || '',
    frameworks: row.frameworks || '',
    tools: row.tools || '',
    certifications: row.certifications || '',
    projects: row.projects_json ? JSON.parse(row.projects_json) : [],
    internshipExperience: row.internship_experience || '',
    achievements: row.achievements || '',
    githubUrl: row.github_url || '',
    linkedinUrl: row.linkedin_url || '',
    portfolioUrl: row.portfolio_url || '',
  }
}

router.get(
  '/me',
  authenticateToken,
  authorizeRoles('student'),
  async (req, res, next) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM student_profiles WHERE student_id = ?',
        [req.user.id]
      )

      if (!rows.length) {
        return res.json({
          tenthPercentage: null,
          twelfthPercentage: null,
          backlogs: null,
          graduationYear: null,
          programmingLanguages: '',
          frameworks: '',
          tools: '',
          certifications: '',
          projects: [],
          internshipExperience: '',
          achievements: '',
          githubUrl: '',
          linkedinUrl: '',
          portfolioUrl: '',
        })
      }

      res.json(normaliseProfileRow(rows[0]))
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/me',
  authenticateToken,
  authorizeRoles('student'),
  async (req, res, next) => {
    try {
      const {
        tenthPercentage,
        twelfthPercentage,
        backlogs,
        graduationYear,
        programmingLanguages,
        frameworks,
        tools,
        certifications,
        projects,
        internshipExperience,
        achievements,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
      } = req.body ?? {}

      if (tenthPercentage !== undefined && (tenthPercentage < 0 || tenthPercentage > 100)) {
        throw new AppError('10th percentage must be between 0 and 100', 400, 'VALIDATION_ERROR')
      }
      if (twelfthPercentage !== undefined && (twelfthPercentage < 0 || twelfthPercentage > 100)) {
        throw new AppError('12th percentage must be between 0 and 100', 400, 'VALIDATION_ERROR')
      }

      const projectsJson = JSON.stringify(projects || [])

      await pool.execute(
        `INSERT INTO student_profiles (
           student_id,
           tenth_percentage,
           twelfth_percentage,
           backlogs,
           graduation_year,
           programming_languages,
           frameworks,
           tools,
           certifications,
           projects_json,
           internship_experience,
           achievements,
           github_url,
           linkedin_url,
           portfolio_url
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           tenth_percentage = VALUES(tenth_percentage),
           twelfth_percentage = VALUES(twelfth_percentage),
           backlogs = VALUES(backlogs),
           graduation_year = VALUES(graduation_year),
           programming_languages = VALUES(programming_languages),
           frameworks = VALUES(frameworks),
           tools = VALUES(tools),
           certifications = VALUES(certifications),
           projects_json = VALUES(projects_json),
           internship_experience = VALUES(internship_experience),
           achievements = VALUES(achievements),
           github_url = VALUES(github_url),
           linkedin_url = VALUES(linkedin_url),
           portfolio_url = VALUES(portfolio_url)`,
        [
          req.user.id,
          tenthPercentage ?? null,
          twelfthPercentage ?? null,
          backlogs ?? null,
          graduationYear ?? null,
          programmingLanguages ?? null,
          frameworks ?? null,
          tools ?? null,
          certifications ?? null,
          projectsJson,
          internshipExperience ?? null,
          achievements ?? null,
          githubUrl ?? null,
          linkedinUrl ?? null,
          portfolioUrl ?? null,
        ]
      )

      const [rows] = await pool.execute(
        'SELECT * FROM student_profiles WHERE student_id = ?',
        [req.user.id]
      )

      res.json(normaliseProfileRow(rows[0]))
    } catch (err) {
      next(err)
    }
  }
)

export default router

