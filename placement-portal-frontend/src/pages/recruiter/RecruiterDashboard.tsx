import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './RecruiterDashboard.css'

const RecruiterDashboard = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const mockJob = {
    id: 'JOB-001',
    title: 'Software Engineer Intern',
    company: 'ABC Tech',
    requirements: 'B.Tech CS/IT, CGPA ≥ 7.5',
    benefits: 'Health insurance, WFH options',
    contact: 'hr@abctech.com',
  }

  return (
    <div className="recruiter-root">
      <header className="recruiter-header">
        <div className="recruiter-header-left">
          <div className="recruiter-logo">JIMS</div>
          <span className="recruiter-college">Placement Portal</span>
        </div>
        <div className="recruiter-header-right">
          <div className="recruiter-greeting">Hi, {user?.name ?? 'Recruiter'}</div>
          <div className="recruiter-menu-wrap">
            <button
              className="recruiter-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            {menuOpen && (
              <div className="recruiter-dropdown">
                <Link to="/recruiter/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/recruiter/change-password" onClick={() => setMenuOpen(false)}>Change Password</Link>
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

      <main className="recruiter-main">
        <section className="recruiter-section">
          <h2 className="section-title">Actions</h2>
          <div className="recruiter-grid">
            <div className="recruiter-tile">
              <h3>Post Job</h3>
              <p>Create a new job opening for the campus drive.</p>
              <button className="btn-primary">Post Job</button>
            </div>
            <div className="recruiter-tile">
              <h3>Student Applications</h3>
              <p>View and shortlist applicants for each job ID.</p>
              <button className="btn-outline">View Applicants</button>
            </div>
          </div>
        </section>

        <section className="recruiter-section">
          <h2 className="section-title">Track & Job Details</h2>
          <div className="recruiter-layout">
            <div className="recruiter-tile">
              <h3>Track</h3>
              <p>Track status of tests, interviews and selections.</p>
              <button className="btn-outline">View Status</button>
            </div>
            <div className="recruiter-tile details">
              <h3>Job Details</h3>
              <div className="job-detail-list">
                <div className="job-detail-row">
                  <span className="label">Job Title</span>
                  <span>{mockJob.title}</span>
                </div>
                <div className="job-detail-row">
                  <span className="label">Requirements</span>
                  <span>{mockJob.requirements}</span>
                </div>
                <div className="job-detail-row">
                  <span className="label">Benefits / Perks</span>
                  <span>{mockJob.benefits}</span>
                </div>
                <div className="job-detail-row">
                  <span className="label">Job ID</span>
                  <span>{mockJob.id}</span>
                </div>
                <div className="job-detail-row">
                  <span className="label">Point of Contact</span>
                  <span>{mockJob.contact}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default RecruiterDashboard
