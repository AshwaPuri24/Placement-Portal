import { useEffect, useState } from 'react'
import { getUsers, type PortalUser } from '../../api/users'
import '../shared/WorkPages.css'

const AdminManageCompaniesPage = () => {
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState<PortalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = (search?: string) => {
    setLoading(true)
    getUsers('recruiter', search)
      .then((data) => setCompanies(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load recruiters'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Manage Companies</h1>
        <p>Search and review recruiter/company accounts.</p>
      </article>
      <article className="work-card">
        <div className="work-row">
          <input
            placeholder="Search company/recruiter email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="work-btn secondary" onClick={() => load(query.trim() || undefined)}>
            Search
          </button>
        </div>
      </article>
      <article className="work-card">
        {error && <p className="work-error">{error}</p>}
        {loading ? (
          <p className="work-muted">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="work-muted">No recruiters found.</p>
        ) : (
          <ul className="work-list">
            {companies.map((company) => (
              <li key={company.id}>
                <h3 style={{ margin: 0 }}>{company.name || 'Recruiter'}</h3>
                <p className="work-muted">{company.email}</p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}

export default AdminManageCompaniesPage
