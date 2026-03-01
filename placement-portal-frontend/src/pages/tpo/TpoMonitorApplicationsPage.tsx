import { useEffect, useMemo, useState } from 'react'
import { getApplications, type PortalApplication } from '../../api/applications'
import '../shared/WorkPages.css'

const TpoMonitorApplicationsPage = () => {
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load applications')
      )
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return applications
    return applications.filter((item) => item.status === statusFilter)
  }, [applications, statusFilter])

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Monitor Applications</h1>
        <p>Track application movement across all drives.</p>
      </article>
      <article className="work-card">
        <div className="work-row">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="eligible">Eligible</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="test_scheduled">Test Scheduled</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading applications...</p>
        ) : filtered.length === 0 ? (
          <p className="work-muted">No records for selected filter.</p>
        ) : (
          <ul className="work-list">
            {filtered.map((app) => (
              <li key={app.id}>
                <h3 style={{ margin: 0 }}>
                  {app.jobTitle} - {app.company}
                </h3>
                <p className="work-muted">
                  {app.studentName || app.studentEmail} | Status: {app.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}

export default TpoMonitorApplicationsPage
