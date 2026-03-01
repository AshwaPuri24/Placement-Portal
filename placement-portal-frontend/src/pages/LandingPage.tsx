import { Link } from 'react-router-dom'
import jimsLogo from '../assets/jims-logo.png'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-root">
      <header className="landing-header">
        <img src={jimsLogo} alt="JIMS Rohini Sector-5" className="landing-logo-image" />
        <nav className="landing-nav">
          <Link to="/about" className="landing-nav-link">
            About
          </Link>
          <Link to="/recruitment-process" className="landing-nav-link">
            Process
          </Link>
          <Link to="/placement-statistics" className="landing-nav-link">
            Statistics
          </Link>
          <Link to="/contact" className="landing-nav-link">
            Contact
          </Link>
          <Link to="/register" className="landing-nav-link">
            Register
          </Link>
          <Link to="/role-selection" className="landing-nav-link">
            Role Selection
          </Link>
          <Link to="/login" className="landing-nav-link primary">
            Sign in
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <h1 className="landing-title">JIMS Rohini Sector-5 Placement & Internship Management System</h1>
          <p className="landing-subtitle">
            Centralized platform for students, TPOs and recruiters to manage placement operations
            at JIMS Rohini Sector-5 efficiently.
          </p>
          <div className="landing-actions">
            <Link to="/register" className="cta-button">
              Get Started
            </Link>
            <Link to="/role-selection" className="cta-link">
              Select role first
            </Link>
            <Link to="/login" className="cta-link">
              Already registered? Sign in
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
