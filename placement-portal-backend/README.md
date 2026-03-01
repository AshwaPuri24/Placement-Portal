# Placement Portal Backend

Node.js + Express API for the Placement & Internship Management System.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure MySQL**
   - Create database: run `scripts/init-db.sql` in MySQL
   - If you already created DB earlier, run `scripts/migrate-add-job-created-by.sql`
   - Copy `.env.example` to `.env` and set your DB credentials

3. **Run**
   ```bash
   npm run dev
   ```

API runs at `http://localhost:3000`

## Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current authenticated user
- `GET /api/jobs` - List jobs
- `GET /api/jobs` - Recruiters only see jobs they created
- `GET /api/jobs/:id` - Get job
- `POST /api/jobs` - Create job (admin/recruiter)
- `PUT /api/jobs/:id` - Update job (admin/recruiter)
- `DELETE /api/jobs/:id` - Delete job (admin/recruiter)
- `POST /api/applications` - Apply to job (student)
- `GET /api/applications/my` - Student applications
- `GET /api/applications?jobId=1` - View applicants (admins: all, recruiters: only their jobs)
- `PATCH /api/applications/:id/status` - Update application status (admins: all, recruiters: only their jobs)
- `GET /api/users?role=student&q=aman` - List users (admin/hod)
