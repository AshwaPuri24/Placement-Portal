import { useEffect, useState } from 'react'
import { getApplications, updateApplicationStatus, type PortalApplication } from '../../api/applications'
import '../shared/WorkPages.css'

const CompanyApplicantsPage = () => {
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load applicants'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id: number, status: string) => {
    try {
      await updateApplicationStatus(id, status)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Status update failed')
    }
  }

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>View Applicants</h1>
        <p>Review all applicants for your openings and update screening status.</p>
      </article>

      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading applicants...</p>
        ) : applications.length === 0 ? (
          <p className="work-muted">No applicants yet.</p>
        ) : (
          <ul className="work-list">
            {applications.map((app) => (
              <li key={app.id}>
                <h3 style={{ margin: 0 }}>
                  {app.studentName || app.studentEmail} - {app.jobTitle}
                </h3>
                <p className="work-muted">
                  {app.company} | Current status: {app.status}
                </p>
                <div className="work-row">
                  <button className="work-btn secondary" onClick={() => setStatus(app.id, 'eligible')}>
                    Mark Eligible
                  </button>
                  <button className="work-btn secondary" onClick={() => setStatus(app.id, 'rejected')}>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}

export default CompanyApplicantsPage
