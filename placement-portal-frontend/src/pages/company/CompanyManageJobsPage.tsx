import { useEffect, useState } from 'react'
import { deleteJob, getJobs, updateJob, type Job } from '../../api/jobs'
import '../shared/WorkPages.css'

const CompanyManageJobsPage = () => {
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

  const changeStatus = async (job: Job, status: 'open' | 'closed') => {
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
      setError(err instanceof Error ? err.message : 'Status update failed')
    }
  }

  const remove = async (id: number) => {
    try {
      await deleteJob(id)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Manage Openings</h1>
        <p>Open, close, and remove your recruiter postings.</p>
      </article>

      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading openings...</p>
        ) : jobs.length === 0 ? (
          <p className="work-muted">No openings found.</p>
        ) : (
          <ul className="work-list">
            {jobs.map((job) => (
              <li key={job.id}>
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <p className="work-muted">
                  {job.company} | {job.location ?? 'N/A'} | {job.ctc ?? 'N/A'}
                </p>
                <p className="work-muted">Status: {job.status}</p>
                <div className="work-row">
                  {job.status === 'open' ? (
                    <button className="work-btn secondary" onClick={() => changeStatus(job, 'closed')}>
                      Close
                    </button>
                  ) : (
                    <button className="work-btn secondary" onClick={() => changeStatus(job, 'open')}>
                      Reopen
                    </button>
                  )}
                  <button className="work-btn danger" onClick={() => remove(job.id)}>
                    Delete
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

export default CompanyManageJobsPage
