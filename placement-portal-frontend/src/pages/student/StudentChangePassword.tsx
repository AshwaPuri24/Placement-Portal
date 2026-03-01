import './StudentProfile.css'

const StudentChangePassword = () => {
  return (
    <div className="profile-root">
      <main className="profile-main">
        <h1>Change Password</h1>
        <p className="profile-placeholder">Update your account password securely.</p>
        <form className="password-form">
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
          <button type="button">Save Password</button>
        </form>
      </main>
    </div>
  )
}

export default StudentChangePassword
