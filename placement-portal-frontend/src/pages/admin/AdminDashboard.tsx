import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createJob } from '../../api/jobs'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [ctc, setCtc] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleCreateJob = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    if (!title.trim() || !company.trim()) {
      setError('Job title and company are required')
      return
    }
    try {
      setSubmitting(true)
      await createJob({
        title: title.trim(),
        company: company.trim(),
        ctc: ctc.trim() || undefined,
        location: location.trim() || undefined,
      })
      setMessage('Job created successfully')
      setTitle('')
      setCompany('')
      setCtc('')
      setLocation('')
    } catch (err: any) {
      setError(err.message || 'Failed to create job')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">JIMS</div>
          <span className="admin-college">Placement Portal</span>
        </div>
        <div className="admin-header-right">
          <div className="admin-greeting">Hi, {user?.name ?? 'Admin'} — TPO Dashboard</div>
          <div className="admin-menu-wrap">
            <button
              className="admin-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            {menuOpen && (
              <div className="admin-dropdown">
                <Link to="/admin/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/admin/change-password" onClick={() => setMenuOpen(false)}>Change Password</Link>
                <button
                type="button"
                onClick={() => { setMenuOpen(false); logout() }}
                className="logout-btn"
              >
                Log Out
              </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-section">
          <h2 className="section-title">Job Board (CRUD)</h2>
          <div className="admin-card wide">
            <p>Manage all on-campus jobs and internship drives.</p>
            <div className="admin-actions">
              <button
                className="btn-primary"
                type="button"
                onClick={() => setShowJobForm((v) => !v)}
              >
                {showJobForm ? 'Close form' : 'Create Job'}
              </button>
              <button className="btn-outline">View All Jobs</button>
            </div>

            {showJobForm && (
              <form className="job-form" onSubmit={handleCreateJob}>
                <div className="job-form-row">
                  <label>
                    Job Title
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Software Engineer Intern"
                    />
                  </label>
                  <label>
                    Company
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="ABC Tech"
                    />
                  </label>
                </div>
                <div className="job-form-row">
                  <label>
                    CTC
                    <input
                      type="text"
                      value={ctc}
                      onChange={(e) => setCtc(e.target.value)}
                      placeholder="8 LPA"
                    />
                  </label>
                  <label>
                    Location
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Bangalore / Remote"
                    />
                  </label>
                </div>
                {error && <p className="job-form-error">{error}</p>}
                {message && <p className="job-form-success">{message}</p>}
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Job'}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="admin-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="admin-grid">
            <div className="admin-tile">
              <h3>Student Track</h3>
              <p>Track student applications and shortlisting status.</p>
              <button className="btn-outline">View</button>
            </div>
            <div className="admin-tile">
              <h3>Create Test</h3>
              <p>Configure aptitude / technical tests for drives.</p>
              <button className="btn-primary">Create</button>
            </div>
            <div className="admin-tile">
              <h3>Generate Student Report</h3>
              <p>Download or view placement reports and statistics.</p>
              <button className="btn-outline">Generate</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
