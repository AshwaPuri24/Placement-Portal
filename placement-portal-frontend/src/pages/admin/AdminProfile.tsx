import '../shared/WorkPages.css'

const AdminProfile = () => {
  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Admin Profile</h1>
        <p>Manage admin details for portal governance and communications.</p>
      </article>
      <article className="work-card">
        <div className="work-grid-2">
          <div>
            <h3>Name</h3>
            <p className="work-muted">Placement Administrator</p>
          </div>
          <div>
            <h3>Email</h3>
            <p className="work-muted">admin@jims.edu</p>
          </div>
        </div>
      </article>
    </section>
  )
}

export default AdminProfile
