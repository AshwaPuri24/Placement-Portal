import { useEffect, useState } from 'react'
import { getMyProfile, type StudentProfile as Profile } from '../../api/profile'
import { useAuth } from '../../context/AuthContext'
import './StudentProfile.css'

const StudentProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyProfile()
      .then((p) => setProfile(p))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load profile'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="profile-root">
      <main className="profile-main">
        <h1>My Profile</h1>
        <p className="profile-placeholder">
          Overview of your academic record, skills, and important links used for placements.
        </p>

        {error && <p className="profile-error">{error}</p>}

        {loading || !profile ? (
          <p className="profile-placeholder">Loading profile…</p>
        ) : (
          <>
            <div className="profile-grid">
              <div className="profile-field">
                <span>Name</span>
                <strong>{user?.name ?? 'Student'}</strong>
              </div>
              <div className="profile-field">
                <span>10th Percentage</span>
                <strong>{profile.tenthPercentage ?? '—'}</strong>
              </div>
              <div className="profile-field">
                <span>12th Percentage</span>
                <strong>{profile.twelfthPercentage ?? '—'}</strong>
              </div>
              <div className="profile-field">
                <span>Backlogs</span>
                <strong>{profile.backlogs ?? 0}</strong>
              </div>
              <div className="profile-field">
                <span>Graduation Year</span>
                <strong>{profile.graduationYear ?? '—'}</strong>
              </div>
            </div>

            <div className="profile-grid" style={{ marginTop: '1rem' }}>
              <div className="profile-field">
                <span>Programming Languages</span>
                <strong>{profile.programmingLanguages || 'Add your languages in Edit Profile'}</strong>
              </div>
              <div className="profile-field">
                <span>Frameworks</span>
                <strong>{profile.frameworks || 'List popular frameworks you know'}</strong>
              </div>
              <div className="profile-field">
                <span>Tools</span>
                <strong>{profile.tools || 'Add tools like Git, Docker, etc.'}</strong>
              </div>
              <div className="profile-field">
                <span>Certifications</span>
                <strong>{profile.certifications || 'Mention relevant certifications'}</strong>
              </div>
            </div>

            <div className="profile-links">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noreferrer">
                  Portfolio
                </a>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default StudentProfile
