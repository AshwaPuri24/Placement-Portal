import { useEffect, useState } from 'react'
import { getJobs, updateJob, type Job } from '../../api/jobs'
import '../shared/WorkPages.css'

const TpoApproveJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getJobs()
      .then((data) => setJobs(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load jobs'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (job: Job, status: 'open' | 'closed') => {
    try {
      await updateJob(job.id, {
        title: job.title,
        company: job.company,
        ctc: job.ctc ?? undefined,
        location: job.location ?? undefined,
        status,
      })
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update job status')
    }
  }

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Approve JNF / TNF</h1>
        <p>Control publication status of recruiter openings.</p>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading openings...</p>
        ) : (
          <ul className="work-list">
            {jobs.map((job) => (
              <li key={job.id}>
                <h3 style={{ margin: 0 }}>
                  {job.title} - {job.company}
                </h3>
                <p className="work-muted">Current status: {job.status}</p>
                <div className="work-row">
                  <button className="work-btn secondary" onClick={() => setStatus(job, 'open')}>
                    Approve/Open
                  </button>
                  <button className="work-btn secondary" onClick={() => setStatus(job, 'closed')}>
                    Hold/Close
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

export default TpoApproveJobsPage
