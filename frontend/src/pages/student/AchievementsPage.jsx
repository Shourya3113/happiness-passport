import { useEffect, useState } from 'react'
import { achievementService } from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Upload, Trophy } from 'lucide-react'

const CATEGORIES = ['academic', 'sports', 'cultural', 'social', 'technical', 'leadership', 'other']
const STATUS_BADGE = {
  pending:  <span className="badge-yellow">Pending</span>,
  verified: <span className="badge-green">Verified</span>,
  rejected: <span className="badge-red">Rejected</span>,
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [showForm, setShowForm]         = useState(false)
  const [loading, setLoading]           = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: 'academic', date_achieved: '', certificate: null
  })

  useEffect(() => { fetchAchievements() }, [])

  const fetchAchievements = () => {
    achievementService.list().then(r => setAchievements(r.data)).catch(() => {})
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v && k !== 'certificate') fd.append(k, v) })
      if (form.certificate) fd.append('certificate', form.certificate)
      await achievementService.create(fd)
      toast.success('Achievement submitted for review!')
      setShowForm(false)
      setForm({ title: '', description: '', category: 'academic', date_achieved: '', certificate: null })
      fetchAchievements()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Achievements</h1>
          <p className="text-gray-500 mt-1">Submit and track your accomplishments</p>
        </div>
        <button className="btn-primary flex items-center gap-2"
          onClick={() => setShowForm(v => !v)}>
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Achievement'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="font-display text-xl mb-5">New Achievement</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Title *</label>
              <input required className="input" placeholder="e.g. First Place in Coding Hackathon"
                value={form.title} onChange={set('title')} />
            </div>
            <div>
              <label className="label">Category *</label>
              <select required className="input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Date Achieved *</label>
              <input required type="date" className="input"
                value={form.date_achieved} onChange={set('date_achieved')} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Brief description…"
                value={form.description} onChange={set('description')} />
            </div>
            <div className="col-span-2">
              <label className="label">Supporting Certificate (PDF/Image)</label>
              <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-brand-400 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {form.certificate ? form.certificate.name : 'Click to upload certificate'}
                </span>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                  onChange={e => setForm(f => ({ ...f, certificate: e.target.files[0] }))} />
              </label>
            </div>
            <div className="col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Submitting…' : 'Submit Achievement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {achievements.length === 0 && (
          <div className="card text-center py-12">
            <Trophy size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No achievements yet — add your first one!</p>
          </div>
        )}
        {achievements.map(a => (
          <div key={a.id} className="card hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{a.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge-blue">{a.category}</span>
                    <span className="text-xs text-gray-400">{a.date_achieved}</span>
                    <span className="text-xs text-brand-600 font-medium">+{a.points} pts</span>
                  </div>
                  {a.faculty_remarks && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      Faculty: "{a.faculty_remarks}"
                    </p>
                  )}
                </div>
              </div>
              <div className="shrink-0">{STATUS_BADGE[a.status]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
