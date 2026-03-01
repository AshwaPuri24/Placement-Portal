import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobs, type Job } from '../../api/jobs'
import { applyToJob, getMyApplications } from '../../api/applications'
import '../shared/PanelPage.css'

const AvailableJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applyingId, setApplyingId] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    Promise.all([getJobs(), getMyApplications()])
      .then(([jobsData, appData]) => {
        setJobs(jobsData)
        setAppliedJobIds(new Set(appData.map((a) => a.jobId)))
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load jobs'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return jobs
    const q = query.toLowerCase()
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        (job.location ?? '').toLowerCase().includes(q)
    )
  }, [jobs, query])

  const handleApply = async (jobId: number) => {
    try {
      setApplyingId(jobId)
      await applyToJob(jobId)
      setAppliedJobIds((prev) => {
        const next = new Set(prev)
        next.add(jobId)
        return next
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to apply'
      setError(message)
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <section className="panel-page">
      <div className="panel-header">
        <h1>Available Jobs</h1>
        <p>Search and apply for open jobs and internships.</p>
      </div>

      <div className="panel-card">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, company, location"
          style={{ width: '100%', padding: '0.65rem', borderRadius: '0.6rem', border: '1px solid var(--jims-border)' }}
        />
      </div>

      {error && <div className="panel-card"><p style={{ margin: 0, color: 'var(--jims-danger)' }}>{error}</p></div>}

      <div className="panel-card">
        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {filteredJobs.map((job) => {
              const applied = appliedJobIds.has(job.id)
              return (
                <article
                  key={job.id}
                  style={{
                    border: '1px solid var(--jims-border)',
                    borderRadius: '0.8rem',
                    padding: '0.75rem',
                    display: 'grid',
                    gap: '0.55rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{job.title}</h3>
                      <p style={{ margin: '0.2rem 0 0', color: 'var(--jims-ink-soft)' }}>{job.company}</p>
                    </div>
                    <span style={{ fontSize: '0.8rem', background: '#f6ead5', color: 'var(--jims-maroon)', padding: '0.2rem 0.45rem', borderRadius: '0.45rem' }}>
                      {applied ? 'Applied' : job.status}
                    </span>
                  </div>

                  <p style={{ margin: 0, color: 'var(--jims-ink-soft)' }}>
                    {job.location ?? 'N/A'} | {job.ctc ?? 'N/A'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <Link
                      to={`/student/jobs/${job.id}`}
                      style={{ padding: '0.4rem 0.7rem', borderRadius: '0.45rem', border: '1px solid var(--jims-maroon)', color: 'var(--jims-maroon)' }}
                    >
                      Job Details
                    </Link>
                    <button
                      type="button"
                      disabled={applied || applyingId === job.id}
                      onClick={() => handleApply(job.id)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '0.45rem',
                        border: 0,
                        background: applied ? '#9b8f7a' : 'var(--jims-success)',
                        color: '#fff',
                        cursor: applied ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {applied ? 'Applied' : applyingId === job.id ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default AvailableJobsPage
