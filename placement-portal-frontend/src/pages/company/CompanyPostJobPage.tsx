import { useState, type FormEvent } from 'react'
import { createJob } from '../../api/jobs'
import '../shared/WorkPages.css'

const CompanyPostJobPage = () => {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [ctc, setCtc] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    if (!title.trim() || !company.trim()) {
      setError('Title and company are required.')
      return
    }
    try {
      setSaving(true)
      await createJob({
        title: title.trim(),
        company: company.trim(),
        location: location.trim() || undefined,
        ctc: ctc.trim() || undefined,
        description: description.trim() || undefined,
        requirements: requirements.trim() || undefined,
      })
      setTitle('')
      setCompany('')
      setLocation('')
      setCtc('')
      setDescription('')
      setRequirements('')
      setMessage('JNF/TNF posted successfully.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post opening.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="work-page">
      <article className="work-card">
        <h1>Create JNF / TNF</h1>
        <p>Submit a campus opening form for TPO processing.</p>
      </article>

      <article className="work-card">
        <form className="work-form" onSubmit={submit}>
          <div className="work-grid-2">
            <label>
              Job Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              Company
              <input value={company} onChange={(e) => setCompany(e.target.value)} />
            </label>
          </div>
          <div className="work-grid-2">
            <label>
              Location
              <input value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>
            <label>
              CTC / Stipend
              <input value={ctc} onChange={(e) => setCtc(e.target.value)} />
            </label>
          </div>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Requirements
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} />
          </label>
          {error && <p className="work-error">{error}</p>}
          {message && <p className="work-success">{message}</p>}
          <button className="work-btn" type="submit" disabled={saving}>
            {saving ? 'Submitting...' : 'Submit Opening'}
          </button>
        </form>
      </article>
    </section>
  )
}

export default CompanyPostJobPage
