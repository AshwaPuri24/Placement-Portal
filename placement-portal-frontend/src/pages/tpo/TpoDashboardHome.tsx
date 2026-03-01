import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../../api/jobs'
import { getApplications, type PortalApplication } from '../../api/applications'
import '../dashboard/RoleDashboard.css'

const TpoDashboardHome = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openJobsCount, setOpenJobsCount] = useState(0)
  const [applications, setApplications] = useState<PortalApplication[]>([])

  useEffect(() => {
    Promise.all([getJobs(), getApplications()])
      .then(([jobs, apps]) => {
        setOpenJobsCount(jobs.filter((job) => job.status === 'open').length)
        setApplications(apps)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load TPO dashboard data'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [])

  const selectedCount = useMemo(
    () => applications.filter((item) => item.status === 'selected').length,
    [applications]
  )
  const selectionRatio = useMemo(() => {
    if (!applications.length) return '0%'
    return `${Math.round((selectedCount / applications.length) * 100)}%`
  }, [applications, selectedCount])

  const recentItems = useMemo(() => applications.slice(0, 3), [applications])

  return (
    <section className="role-dashboard">
      <header className="role-dashboard-header">
        <h1>TPO Dashboard</h1>
        <p>Approve recruiter requests, monitor drives, and keep campus process on schedule.</p>
      </header>

      {error && <div className="role-dashboard-alert">{error}</div>}

      <div className="role-kpi-grid">
        <article className="role-kpi-card">
          <span>JNF / TNF Pending</span>
          <strong>{loading ? '...' : openJobsCount}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Live Drives</span>
          <strong>{loading ? '...' : openJobsCount}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Total Applications</span>
          <strong>{loading ? '...' : applications.length}</strong>
        </article>
        <article className="role-kpi-card">
          <span>Selection Ratio</span>
          <strong>{loading ? '...' : selectionRatio}</strong>
        </article>
      </div>

      <div className="role-dashboard-main">
        <article className="role-panel">
          <h2>TPO Controls</h2>
          <div className="role-action-grid">
            <Link className="role-action-card" to="/tpo/approve-jobs">
              <h3>Approve JNF / TNF</h3>
              <p>Review eligibility and compensation details.</p>
            </Link>
            <Link className="role-action-card" to="/tpo/monitor-applications">
              <h3>Monitor Applications</h3>
              <p>Track application funnel and round-wise movement.</p>
            </Link>
            <Link className="role-action-card" to="/tpo/reports">
              <h3>Generate Reports</h3>
              <p>Create branch-wise and company-wise reports.</p>
            </Link>
            <Link className="role-action-card" to="/admin/manage-companies">
              <h3>Company Coordination</h3>
              <p>Handle onboarding and communication workflows.</p>
            </Link>
          </div>
        </article>

        <article className="role-panel">
          <h2>Priority Queue</h2>
          <ul className="role-list">
            {recentItems.length === 0 ? (
              <li>
                <b>No pending queue items</b>
                <br />
                <span>Drive updates will appear here.</span>
              </li>
            ) : (
              recentItems.map((item) => (
                <li key={item.id}>
                  <b>
                    {item.jobTitle} - {item.company}
                  </b>
                  <br />
                  <span>
                    {item.studentName || item.studentEmail} | Status: {item.status}
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

export default TpoDashboardHome
