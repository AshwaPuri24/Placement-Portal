import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'
import { useAuth, type Role } from '../../context/AuthContext'
import { register as apiRegister } from '../../api/auth'

const RegisterPage = () => {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }
    try {
      setLoading(true)
      await apiRegister(email.trim(), password, role, name.trim() || undefined)
      await login(email.trim(), password, role)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Create your placement portal account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Full name
            <input
              type="text"
              className="auth-input"
              placeholder="Student / TPO / Recruiter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              placeholder="you@jims.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Role
            <select
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="student">Student</option>
              <option value="admin">TPO / Admin</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
