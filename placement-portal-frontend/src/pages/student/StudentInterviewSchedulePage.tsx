import { useEffect, useMemo, useState } from 'react'
import { getMyApplications, type StudentApplication } from '../../api/applications'
import '../shared/WorkPages.css'

const StudentInterviewSchedulePage = () => {
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyApplications()
      .then((data) => setApplications(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load schedule'))
      .finally(() => setLoading(false))
  }, [])

  const scheduleItems = useMemo(
    () =>
      applications.filter((item) =>
        ['test_scheduled', 'interview_scheduled', 'shortlisted'].includes(item.status)
      ),
    [applications]
  )

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Interview Schedule</h1>
        <p>Track all upcoming test and interview stages from your application statuses.</p>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading schedule...</p>
        ) : scheduleItems.length === 0 ? (
          <p className="work-muted">No scheduled rounds at the moment.</p>
        ) : (
          <ul className="work-list">
            {scheduleItems.map((item) => (
              <li key={item.id}>
                <h3 style={{ margin: 0 }}>
                  {item.jobTitle} - {item.company}
                </h3>
                <p className="work-muted">Round status: {item.status}</p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}

export default StudentInterviewSchedulePage
