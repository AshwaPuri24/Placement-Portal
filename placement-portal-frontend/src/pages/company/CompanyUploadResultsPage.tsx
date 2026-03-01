import { useEffect, useMemo, useState } from 'react'
import { getApplications, updateApplicationStatus, type PortalApplication } from '../../api/applications'
import '../shared/WorkPages.css'

const CompanyUploadResultsPage = () => {
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load finalization queue'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const queue = useMemo(
    () => applications.filter((app) => ['shortlisted', 'test_scheduled', 'interview_scheduled'].includes(app.status)),
    [applications]
  )

  const setResult = async (id: number, status: 'selected' | 'rejected') => {
    setError(null)
    setMessage(null)
    try {
      await updateApplicationStatus(id, status)
      setMessage('Result updated.')
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Result update failed')
    }
  }

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Upload Final Results</h1>
        <p>Finalize candidate outcomes after tests/interviews.</p>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {message && <p className="work-success">{message}</p>}
        {loading ? (
          <p className="work-muted">Loading finalization queue...</p>
        ) : queue.length === 0 ? (
          <p className="work-muted">No candidates ready for final result update.</p>
        ) : (
          <ul className="work-list">
            {queue.map((app) => (
              <li key={app.id}>
                <h3 style={{ margin: 0 }}>
                  {app.studentName || app.studentEmail} - {app.jobTitle}
                </h3>
                <p className="work-muted">Current status: {app.status}</p>
                <div className="work-row">
                  <button className="work-btn" onClick={() => setResult(app.id, 'selected')}>
                    Mark Selected
                  </button>
                  <button className="work-btn danger" onClick={() => setResult(app.id, 'rejected')}>
                    Mark Rejected
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

export default CompanyUploadResultsPage
