import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../api/jobs'
import { getApplications, type PortalApplication } from '../../api/applications'
import '../dashboard/RoleDashboard.css'

const AdminDashboardHome = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jobsCount, setJobsCount] = useState(0)
  const [applications, setApplications] = useState<PortalApplication[]>([])

  useEffect(() => {
    Promise.all([getJobs(), getApplications()])
      .then(([jobs, apps]) => {
        setJobsCount(jobs.length)
        setApplications(apps)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load admin dashboard data'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [])

  const uniqueStudents = useMemo(
    () => new Set(applications.map((item) => item.studentId)).size,
    [applications]
  )
  const uniqueCompanies = useMemo(
    () => new Set(applications.map((item) => item.company)).size,
    [applications]
  )
  const selectedCount = useMemo(
    () => applications.filter((item) => item.status === 'selected').length,
    [applications]
  )

  const recentItems = useMemo(() => applications.slice(0, 3), [applications])

  return (
    <section className="role-dashboard">
      <header className="role-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, companies, and platform settings for smooth operations.</p>
      </header>

      {error && <div className="role-dashboard-alert">{error}</div>}

      <div className="role-kpi-grid">
        <article className="role-kpi-card">
          <span>Student Accounts</span>
          <strong>{loading ? '...' : uniqueStudents}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Recruiter Accounts</span>
          <strong>{loading ? '...' : uniqueCompanies}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Total Openings</span>
          <strong>{loading ? '...' : jobsCount}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Selections Finalized</span>
          <strong>{loading ? '...' : selectedCount}</strong>
        </article>
      </div>

      <div className="role-dashboard-main">
        <article className="role-panel">
          <h2>Administration</h2>
          <div className="role-action-grid">
            <Link className="role-action-card" to="/admin/manage-students">
              <h3>Manage Students</h3>
              <p>Verify, activate, and maintain student records.</p>
            </Link>
            <Link className="role-action-card" to="/admin/manage-companies">
              <h3>Manage Companies</h3>
              <p>Control recruiter onboarding and account status.</p>
            </Link>
            <Link className="role-action-card" to="/tpo/reports">
              <h3>Placement Reports</h3>
              <p>Access central analytics and export summaries.</p>
            </Link>
            <Link className="role-action-card" to="/tpo/dashboard">
              <h3>TPO Operations</h3>
              <p>Jump to operational queue and current drive status.</p>
            </Link>
          </div>
        </article>

        <article className="role-panel">
          <h2>Recent Logs</h2>
          <ul className="role-list">
            {recentItems.length === 0 ? (
              <li>
                <b>No recent logs available</b>
                <br />
                <span>System activity will appear once applications begin.</span>
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

export default AdminDashboardHome
