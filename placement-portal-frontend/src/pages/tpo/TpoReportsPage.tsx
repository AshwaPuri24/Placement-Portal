import { useEffect, useMemo, useState } from 'react'
import { getApplications, type PortalApplication } from '../../api/applications'
import { getJobs } from '../../api/jobs'
import '../shared/WorkPages.css'

const TpoReportsPage = () => {
  const [jobsCount, setJobsCount] = useState(0)
  const [applications, setApplications] = useState<PortalApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getJobs(), getApplications()])
      .then(([jobs, apps]) => {
        setJobsCount(jobs.length)
        setApplications(apps)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to generate report'))
      .finally(() => setLoading(false))
  }, [])

  const selectedCount = useMemo(
    () => applications.filter((item) => item.status === 'selected').length,
    [applications]
  )
  const shortlistedCount = useMemo(
    () => applications.filter((item) => ['shortlisted', 'test_scheduled', 'interview_scheduled'].includes(item.status)).length,
    [applications]
  )
  const selectionRatio = useMemo(() => {
    if (!applications.length) return '0%'
    return `${Math.round((selectedCount / applications.length) * 100)}%`
  }, [applications, selectedCount])

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Placement Reports</h1>
        <p>Quick analytical summary of ongoing placement performance.</p>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Generating report...</p>
        ) : (
          <div className="work-grid-2">
            <div className="work-card">
              <h3>Total Openings</h3>
              <p>{jobsCount}</p>
            </div>
            <div className="work-card">
              <h3>Total Applications</h3>
              <p>{applications.length}</p>
            </div>
            <div className="work-card">
              <h3>Shortlisted / In Process</h3>
              <p>{shortlistedCount}</p>
            </div>
            <div className="work-card">
              <h3>Selection Ratio</h3>
              <p>{selectionRatio}</p>
            </div>
          </div>
        )}
      </article>
    </section>
  )
}

export default TpoReportsPage
