import { useState } from 'react'
import { certificateService } from '../../services/api'
import toast from 'react-hot-toast'
import { Award } from 'lucide-react'

export default function IssueCertPage() {
  const [form, setForm] = useState({ student_id: '', title: '', description: '', event_id: '' })
  const [loading, setLoading] = useState(false)
  const [issued, setIssued] = useState([])
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await certificateService.issue({
        ...form,
        student_id: parseInt(form.student_id),
        event_id: form.event_id ? parseInt(form.event_id) : null,
      })
      setIssued(i => [data, ...i])
      toast.success('Certificate issued!')
      setForm({ student_id: '', title: '', description: '', event_id: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to issue certificate')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Issue Certificate</h1>
        <p className="text-gray-500 mt-1">Generate a verified certificate for a student</p>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Student ID (user ID) *</label>
            <input required type="number" className="input" placeholder="Student's system ID"
              value={form.student_id} onChange={set('student_id')} />
          </div>
          <div>
            <label className="label">Certificate Title *</label>
            <input required className="input" placeholder="e.g. Certificate of Participation – Tech Fest 2024"
              value={form.title} onChange={set('title')} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} placeholder="What did the student accomplish or participate in?"
              value={form.description} onChange={set('description')} />
          </div>
          <div>
            <label className="label">Event ID (optional)</label>
            <input type="number" className="input" placeholder="Link to an event (optional)"
              value={form.event_id} onChange={set('event_id')} />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Award size={18} /> {loading ? 'Issuing…' : 'Issue Certificate'}
          </button>
        </form>
      </div>

      {issued.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl mb-4">Just Issued</h2>
          <div className="space-y-3">
            {issued.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-gray-500">UUID: {c.uuid?.slice(0, 8)}…</p>
                </div>
                {c.certificate_url && (
                  <a href={c.certificate_url} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline">Download PDF</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
