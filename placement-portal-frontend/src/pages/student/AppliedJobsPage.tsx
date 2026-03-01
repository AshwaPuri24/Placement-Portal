import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplications, type StudentApplication } from '../../api/applications'
import '../shared/PanelPage.css'

const AppliedJobsPage = () => {
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load applications'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="panel-page">
      <div className="panel-header">
        <h1>Applied Jobs</h1>
        <p>Track your application statuses in one place.</p>
      </div>

      <div className="panel-card">
        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p style={{ color: '#b91c1c' }}>{error}</p>
        ) : applications.length === 0 ? (
          <p>
            No applications yet. <Link to="/student/jobs">Browse jobs</Link>.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '0.65rem' }}>
            {applications.map((item) => (
              <article
                key={item.id}
                style={{ border: '1px solid #dbeafe', borderRadius: '0.7rem', padding: '0.7rem' }}
              >
                <h3 style={{ margin: 0 }}>{item.jobTitle}</h3>
                <p style={{ margin: '0.2rem 0', color: '#475569' }}>{item.company}</p>
                <p style={{ margin: 0, color: '#0f766e' }}>Status: {item.status}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AppliedJobsPage
