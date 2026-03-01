import '../shared/WorkPages.css'

const AdminChangePassword = () => {
  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Change Password</h1>
        <p>Update admin account password securely.</p>
      </article>
      <article className="work-card">
        <form className="work-form">
          <label>
            Current Password
            <input type="password" />
          </label>
          <label>
            New Password
            <input type="password" />
          </label>
          <label>
            Confirm New Password
            <input type="password" />
          </label>
          <button className="work-btn" type="button">
            Save Password
          </button>
        </form>
      </article>
    </section>
  )
}

export default AdminChangePassword
