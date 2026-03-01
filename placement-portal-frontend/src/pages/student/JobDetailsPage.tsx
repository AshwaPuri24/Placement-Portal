import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../../api/client'
import type { Job } from '../../api/jobs'
import '../shared/PanelPage.css'

const JobDetailsPage = () => {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    apiFetch<Job>(`/jobs/${id}`)
      .then((data) => setJob(data))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load job details'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <section className="panel-page">
      <div className="panel-header">
        <h1>Job Details</h1>
        <p>Detailed opportunity information.</p>
      </div>

      <div className="panel-card">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: '#b91c1c' }}>{error}</p>
        ) : !job ? (
          <p>Job not found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.55rem' }}>
            <h2 style={{ margin: 0 }}>{job.title}</h2>
            <p style={{ margin: 0, color: '#475569' }}>{job.company}</p>
            <p style={{ margin: 0 }}>Location: {job.location ?? 'N/A'}</p>
            <p style={{ margin: 0 }}>CTC: {job.ctc ?? 'N/A'}</p>
            <p style={{ margin: 0 }}>Status: {job.status}</p>
            <Link to="/student/jobs" style={{ marginTop: '0.4rem', color: '#1d4ed8' }}>
              Back to available jobs
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default JobDetailsPage
