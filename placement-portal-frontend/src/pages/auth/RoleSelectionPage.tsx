import { Link } from 'react-router-dom'
import './Auth.css'

const roles = [
  {
    key: 'student',
    label: 'Student',
    subtitle: 'Placements, internships and career services',
    accent: 'student',
    iconText: 'ST',
  },
  {
    key: 'recruiter',
    label: 'Company / Recruiter',
    subtitle: 'Job postings and campus hiring',
    accent: 'recruiter',
    iconText: 'CR',
  },
  {
    key: 'admin',
    label: 'TPO / Admin',
    subtitle: 'System and user management',
    accent: 'admin',
    iconText: 'TA',
  },
]

const RoleSelectionPage = () => {
  return (
    <div className="role-selection-root">
      <div className="role-selection-backdrop" />
      <section className="role-selection-modal" aria-label="Select login type">
        <Link to="/" className="role-close-btn" aria-label="Close">
          x
        </Link>
        <h2 className="role-selection-title">Select Login Type</h2>
        <p className="role-selection-subtitle">Select your portal to continue</p>

        <div className="role-grid">
          {roles.map((role) => (
            <Link
              key={role.key}
              to={`/login?role=${role.key}`}
              className={`role-card ${role.accent}`}
            >
              <span className="role-icon" aria-hidden="true">
                {role.iconText}
              </span>
              <span className="role-label">{role.label}</span>
              <span className="role-text">{role.subtitle}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default RoleSelectionPage
