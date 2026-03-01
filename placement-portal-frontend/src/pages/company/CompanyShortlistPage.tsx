import { useEffect, useMemo, useState } from 'react'
import { getApplications, updateApplicationStatus, type PortalApplication } from '../../api/applications'
import '../shared/WorkPages.css'

const CompanyShortlistPage = () => {
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load shortlist queue'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const queue = useMemo(
    () => applications.filter((app) => ['applied', 'eligible', 'shortlisted'].includes(app.status)),
    [applications]
  )

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
        <h1>Shortlist Candidates</h1>
        <p>Move candidates from screening to shortlist and test rounds.</p>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading shortlist queue...</p>
        ) : queue.length === 0 ? (
          <p className="work-muted">No candidates in shortlist queue.</p>
        ) : (
          <ul className="work-list">
            {queue.map((app) => (
              <li key={app.id}>
                <h3 style={{ margin: 0 }}>
                  {app.studentName || app.studentEmail} - {app.jobTitle}
                </h3>
                <p className="work-muted">Current status: {app.status}</p>
                <div className="work-row">
                  <button className="work-btn secondary" onClick={() => setStatus(app.id, 'shortlisted')}>
                    Shortlist
                  </button>
                  <button className="work-btn secondary" onClick={() => setStatus(app.id, 'test_scheduled')}>
                    Schedule Test
                  </button>
                  <button className="work-btn secondary" onClick={() => setStatus(app.id, 'interview_scheduled')}>
                    Schedule Interview
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

export default CompanyShortlistPage
