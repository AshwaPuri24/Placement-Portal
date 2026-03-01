import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getJobs } from '../../api/jobs'
import { applyToJob, getMyApplications } from '../../api/applications'
import './StudentDashboard.css'

interface JobItem {
  id: number
  title: string
  company: string
  ctc: string | null
  location: string | null
  status: string
}

const MOCK_JOBS: JobItem[] = [
  {
    id: 1,
    title: 'Software Engineer Intern',
    company: 'ABC Tech',
    ctc: '8 LPA',
    location: 'Remote',
    status: 'open',
  },
  {
    id: 2,
    title: 'Data Analyst',
    company: 'Insight Corp',
    ctc: '6 LPA',
    location: 'Bangalore',
    status: 'open',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'XYZ Labs',
    ctc: '10 LPA',
    location: 'Hyderabad',
    status: 'open',
  },
]

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [jobs, setJobs] = useState<JobItem[]>(MOCK_JOBS)
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set())
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getJobs(), getMyApplications()])
      .then(([jobsData, applicationsData]) => {
        setJobs(jobsData.map((j) => ({ ...j, status: j.status || 'open' })))
        setAppliedJobIds(new Set(applicationsData.map((a) => a.jobId)))
      })
      .catch(() => {
        // Keep mock jobs if API is unavailable.
      })
  }, [])

  const handleApply = async (jobId: number) => {
    setActionError(null)
    setActionMessage(null)
    try {
      setApplyingJobId(jobId)
      await applyToJob(jobId)
      setAppliedJobIds((prev) => {
        const next = new Set(prev)
        next.add(jobId)
        return next
      })
      setActionMessage('Applied successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply'
      setActionError(message)
    } finally {
      setApplyingJobId(null)
    }
  }

  const mockScores = [
    { test: 'Aptitude Test 1', score: 45, max: 50 },
    { test: 'Technical Round', score: 28, max: 32 },
  ]

  return (
    <div className="student-root">
      <header className="student-header">
        <div className="student-header-left">
          <div className="student-logo">JIMS</div>
          <span className="student-college">Placement Portal</span>
        </div>

        <div className="student-header-right">
          <div className="student-greeting">Hi, {user?.name ?? 'Student'}</div>
          <div className="student-menu-wrap">
            <button
              className="student-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            {menuOpen && (
              <div className="student-dropdown">
                <Link to="/student/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/student/change-password" onClick={() => setMenuOpen(false)}>
                  Change Password
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="logout-btn"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="student-main">
        <section className="student-section">
          <h2 className="section-title">Job Listings</h2>
          {actionError && <p className="job-form-error">{actionError}</p>}
          {actionMessage && <p className="job-form-success">{actionMessage}</p>}
          <div className="job-list">
            {jobs.map((job) => {
              const isApplied = appliedJobIds.has(job.id)
              const visualStatus = isApplied ? 'applied' : job.status
              return (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <h3>{job.title}</h3>
                    <span className={`job-badge ${visualStatus}`}>{visualStatus}</span>
                  </div>
                  <p className="job-company">{job.company}</p>
                  <div className="job-meta">
                    <span>{job.ctc ?? '--'}</span>
                    <span>{job.location ?? '--'}</span>
                  </div>
                  <div className="job-card-actions">
                    <button className="btn-outline">View JD</button>
                    <button
                      className="btn-primary"
                      disabled={isApplied || applyingJobId === job.id}
                      onClick={() => handleApply(job.id)}
                    >
                      {isApplied ? 'Applied' : applyingJobId === job.id ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="student-section">
          <h2 className="section-title">Preparation & Tools</h2>
          <div className="prep-grid">
            <div className="prep-tile">
              <span className="prep-tag">Aptitude</span>
              <h3>Job Prep</h3>
              <p>Practice aptitude tests and mock interviews</p>
              <button className="btn-outline">View</button>
            </div>
            <div className="prep-tile">
              <h3>Interview Prep</h3>
              <p>HR & technical interview tips</p>
              <button className="btn-outline">View</button>
            </div>
            <div className="prep-tile">
              <h3>Resume Builder</h3>
              <p>Create and update your resume</p>
              <button className="btn-primary">Build</button>
            </div>
            <div className="prep-tile score-tile">
              <h3>Score Board</h3>
              <div className="score-list">
                {mockScores.map((s, i) => (
                  <div key={i} className="score-row">
                    <span>{s.test}</span>
                    <span>
                      {s.score}/{s.max}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn-outline">View All</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default StudentDashboard
