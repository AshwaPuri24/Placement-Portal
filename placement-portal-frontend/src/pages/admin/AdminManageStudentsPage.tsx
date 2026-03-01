import { useEffect, useState } from 'react'
import { getUsers, type PortalUser } from '../../api/users'
import '../shared/WorkPages.css'

const AdminManageStudentsPage = () => {
  const [query, setQuery] = useState('')
  const [students, setStudents] = useState<PortalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = (search?: string) => {
    setLoading(true)
    getUsers('student', search)
      .then((data) => setStudents(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load students'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Manage Students</h1>
        <p>Search and review student accounts.</p>
      </article>
      <article className="work-card">
        <div className="work-row">
          <input
            placeholder="Search by name or email"
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
          <p className="work-muted">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="work-muted">No students found.</p>
        ) : (
          <ul className="work-list">
            {students.map((student) => (
              <li key={student.id}>
                <h3 style={{ margin: 0 }}>{student.name || 'Student'}</h3>
                <p className="work-muted">{student.email}</p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}

export default AdminManageStudentsPage
