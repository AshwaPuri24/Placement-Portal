import '../shared/WorkPages.css'

const RecruiterProfile = () => {
  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Company Profile</h1>
        <p>Manage recruiter and organization details used for campus communication.</p>
      </article>
      <article className="work-card">
        <div className="work-grid-2">
          <div>
            <h3>Organization</h3>
            <p className="work-muted">Your Company Name</p>
          </div>
          <div>
            <h3>Primary Contact</h3>
            <p className="work-muted">recruiter@company.com</p>
          </div>
        </div>
      </article>
    </section>
  )
}

export default RecruiterProfile
