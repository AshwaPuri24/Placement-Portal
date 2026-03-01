import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../api/jobs'
import { getApplications, type PortalApplication } from '../../api/applications'
import '../dashboard/RoleDashboard.css'

const CompanyDashboardHome = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openings, setOpenings] = useState(0)
  const [applications, setApplications] = useState<PortalApplication[]>([])

  useEffect(() => {
    Promise.all([getJobs(), getApplications()])
      .then(([jobs, apps]) => {
        setOpenings(jobs.filter((job) => job.status === 'open').length)
        setApplications(apps)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load recruiter dashboard data'
        setError(message)
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
  const pendingCount = useMemo(
    () => applications.filter((item) => ['applied', 'eligible'].includes(item.status)).length,
    [applications]
  )
  const recentItems = useMemo(() => applications.slice(0, 3), [applications])

  return (
    <section className="role-dashboard">
      <header className="role-dashboard-header">
        <h1>Recruiter Ongoing Sessions</h1>
        <p>Manage hiring drives, shortlist candidates, and publish final outcomes.</p>
      </header>

      {error && <div className="role-dashboard-alert">{error}</div>}

      <div className="role-kpi-grid">
        <article className="role-kpi-card">
          <span>Active Openings</span>
          <strong>{loading ? '...' : openings}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Total Applicants</span>
          <strong>{loading ? '...' : applications.length}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Shortlisted</span>
          <strong>{loading ? '...' : shortlistedCount}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Pending Actions</span>
          <strong>{loading ? '...' : pendingCount}</strong>
        </article>
      </div>

      <div className="role-dashboard-main">
        <article className="role-panel">
          <h2>Recruiter Actions</h2>
          <div className="role-action-grid">
            <Link className="role-action-card" to="/company/post-job">
              <h3>Create JNF / TNF</h3>
              <p>Submit job or internship forms for approval.</p>
            </Link>
            <Link className="role-action-card" to="/company/manage-jobs">
              <h3>Manage Openings</h3>
              <p>Edit active openings and close completed positions.</p>
            </Link>
            <Link className="role-action-card" to="/company/applicants">
              <h3>View Applicants</h3>
              <p>Review profiles and filter by eligibility metrics.</p>
            </Link>
            <Link className="role-action-card" to="/company/shortlist">
              <h3>Shortlist Candidates</h3>
              <p>Move candidates to test/interview rounds.</p>
            </Link>
          </div>
        </article>

        <article className="role-panel">
          <h2>Session Updates</h2>
          <ul className="role-list">
            {recentItems.length === 0 ? (
              <li>
                <b>No recent applicant updates</b>
                <br />
                <span>Publish openings to start receiving applications.</span>
              </li>
            ) : (
              recentItems.map((item) => (
                <li key={item.id}>
                  <b>
                    {item.studentName || item.studentEmail} - {item.jobTitle}
                  </b>
                  <br />
                  <span>
                    {item.company} | Status: {item.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default CompanyDashboardHome
