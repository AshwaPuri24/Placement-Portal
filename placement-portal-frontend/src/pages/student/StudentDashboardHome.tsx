import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../api/jobs'
import { getMyApplications, type StudentApplication } from '../../api/applications'
import { generateInterviewQuestions, type InterviewQuestions } from '../../api/ai'
import '../dashboard/RoleDashboard.css'

const StudentDashboardHome = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openJobsCount, setOpenJobsCount] = useState(0)
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [aiRole, setAiRole] = useState('')
  const [aiSkills, setAiSkills] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<InterviewQuestions | null>(null)

  useEffect(() => {
    Promise.all([getJobs(), getMyApplications()])
      .then(([jobs, myApplications]) => {
        setOpenJobsCount(jobs.filter((job) => job.status === 'open').length)
        setApplications(myApplications)
      })
      .catch((err: unknown) => {
        const raw = err instanceof Error ? err.message : 'Failed to load dashboard data'
        const friendly =
          raw === 'Failed to fetch'
            ? 'Cannot reach placement API. Please check that the backend server is running on http://localhost:3000.'
            : raw
        setError(friendly)
      })
      .finally(() => setLoading(false))
  }, [])

  const shortlistedCount = useMemo(
    () =>
      applications.filter((item) =>
        ['shortlisted', 'test_scheduled', 'interview_scheduled', 'selected'].includes(item.status)
      ).length,
    [applications]
  )

  const recentItems = useMemo(() => applications.slice(0, 3), [applications])

  const runAiQuestions = async () => {
    setAiError(null)
    setAiResult(null)
    if (!aiRole.trim() || !aiSkills.trim()) {
      setAiError('Enter a target job role and a few key skills.')
      return
    }
    try {
      setAiLoading(true)
      const result = await generateInterviewQuestions({
        role: aiRole.trim(),
        skills: aiSkills.trim(),
      })
      setAiResult(result)
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Failed to generate questions'
      const msg =
        raw === 'Failed to fetch'
          ? 'Cannot reach AI service. Ensure the backend server is running and has internet access.'
          : raw
      setAiError(msg)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <section className="role-dashboard">
      <header className="role-dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Track applications, improve profile quality, and stay interview ready.</p>
      </header>

      {error && <div className="role-dashboard-alert">{error}</div>}

      <div className="role-kpi-grid">
        <article className="role-kpi-card">
          <span>Available Opportunities</span>
          <strong>{loading ? '...' : openJobsCount}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Applications Submitted</span>
          <strong>{loading ? '...' : applications.length}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Shortlisted</span>
          <strong>{loading ? '...' : shortlistedCount}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Profile Completion</span>
          <strong>82%</strong>
        </article>
      </div>

      <div className="role-dashboard-main">
        <article className="role-panel">
          <h2>Quick Actions</h2>
          <div className="role-action-grid">
            <Link className="role-action-card" to="/student/jobs">
              <h3>Browse Opportunities</h3>
              <p>Apply to jobs and internships based on your eligibility.</p>
            </Link>
            <Link className="role-action-card" to="/student/edit-profile">
              <h3>Update Profile</h3>
              <p>Keep academics, skills, and personal details updated.</p>
            </Link>
            <Link className="role-action-card" to="/student/upload-resume">
              <h3>Upload Resume</h3>
              <p>Upload your latest resume for recruiter visibility.</p>
            </Link>
            <Link className="role-action-card" to="/student/interview-schedule">
              <h3>Interview Schedule</h3>
              <p>Check upcoming tests and interviews with timings.</p>
            </Link>
          </div>
        </article>

        <article className="role-panel">
          <h2>Recent Activity</h2>
          <ul className="role-list">
            {recentItems.length === 0 ? (
              <li>
                <b>No recent applications</b>
                <br />
                <span>Start by browsing available opportunities.</span>
              </li>
            ) : (
              recentItems.map((item) => (
                <li key={item.id}>
                  <b>
                    {item.jobTitle} - {item.company}
                  </b>
                  <br />
                  <span>Status: {item.status}</span>
                </li>
              ))
            )}
          </ul>
        </article>

        <article className="role-panel">
          <h2>AI Interview Question Generator</h2>
          <p>Practice with questions tailored to your dream role and skillset.</p>
          <div className="role-action-grid">
            <div className="role-action-card" style={{ alignItems: 'stretch' }}>
              <label style={{ display: 'block', width: '100%' }}>
                Target Job Role
                <input
                  style={{ marginTop: '0.3rem', width: '100%' }}
                  value={aiRole}
                  onChange={(e) => setAiRole(e.target.value)}
                  placeholder="e.g. SDE Intern, Data Analyst"
                />
              </label>
              <label style={{ display: 'block', width: '100%', marginTop: '0.6rem' }}>
                Your Skills
                <textarea
                  style={{ marginTop: '0.3rem', width: '100%' }}
                  value={aiSkills}
                  onChange={(e) => setAiSkills(e.target.value)}
                  placeholder="e.g. DSA, OOPS, DBMS, React, SQL, Python"
                />
              </label>
              {aiError && <p className="role-dashboard-alert">{aiError}</p>}
              <button
                type="button"
                className="role-action-button"
                onClick={runAiQuestions}
                disabled={aiLoading}
              >
                {aiLoading ? 'Generating…' : 'Generate Questions'}
              </button>
            </div>

            {aiResult && (
              <div className="role-action-card" style={{ maxHeight: 320, overflow: 'auto' }}>
                <p className="work-muted">Overall difficulty: {aiResult.difficulty}</p>
                <h3>Technical (10)</h3>
                <ol>
                  {aiResult.technical.slice(0, 10).map((q, idx) => (
                    <li key={`${q.question}-${idx}`}>
                      {q.question}{' '}
                      <span className="work-muted">({q.difficulty})</span>
                    </li>
                  ))}
                </ol>
                <h3>Behavioral (5)</h3>
                <ol>
                  {aiResult.behavioral.slice(0, 5).map((q, idx) => (
                    <li key={`${q.question}-${idx}`}>{q.question}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

export default StudentDashboardHome
