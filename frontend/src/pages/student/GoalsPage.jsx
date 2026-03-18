import { useEffect, useState } from 'react'
import { goalService } from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Target, Trash2, CheckCircle } from 'lucide-react'

const CATEGORIES = ['academic', 'personal', 'health', 'social', 'career', 'other']

export default function GoalsPage() {
  const [goals, setGoals]     = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'personal', target_date: '' })

  useEffect(() => { goalService.list().then(r => setGoals(r.data)) }, [])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await goalService.create(form)
      setGoals(g => [data, ...g])
      toast.success('Goal added!')
      setShowForm(false)
      setForm({ title: '', description: '', category: 'personal', target_date: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add goal')
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (id, progress) => {
    try {
      const { data } = await goalService.update(id, { progress })
      setGoals(gs => gs.map(g => g.id === id ? data : g))
    } catch { toast.error('Update failed') }
  }

  const deleteGoal = async (id) => {
    if (!confirm('Delete this goal?')) return
    try {
      await goalService.delete(id)
      setGoals(gs => gs.filter(g => g.id !== id))
      toast.success('Goal removed')
    } catch { toast.error('Delete failed') }
  }

  const active    = goals.filter(g => g.status === 'active')
  const completed = goals.filter(g => g.status === 'completed')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">My Goals</h1>
          <p className="text-gray-500 mt-1">{active.length} active · {completed.length} completed</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(v => !v)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="font-display text-xl mb-4">New Goal</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Goal title *</label>
              <input required className="input" placeholder="What do you want to achieve?"
                value={form.title} onChange={set('title')} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Target date</label>
              <input type="date" className="input" value={form.target_date} onChange={set('target_date')} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={set('description')} />
            </div>
            <div className="col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Adding…' : 'Add Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active goals */}
      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-xl mb-4">Active Goals</h2>
          <div className="space-y-4">
            {active.map(g => (
              <div key={g.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-brand-500" />
                      <p className="font-medium">{g.title}</p>
                      <span className="badge-blue">{g.category}</span>
                    </div>
                    {g.description && <p className="text-sm text-gray-500 mt-1 ml-6">{g.description}</p>}
                    {g.target_date && <p className="text-xs text-gray-400 mt-1 ml-6">Due: {g.target_date}</p>}

                    {/* Progress slider */}
                    <div className="mt-3 ml-6">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{g.progress}%</span>
                      </div>
                      <input type="range" min={0} max={100} value={g.progress}
                        onChange={e => updateProgress(g.id, +e.target.value)}
                        className="w-full accent-brand-600 cursor-pointer" />
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(g.id)} className="text-gray-300 hover:text-red-400 transition-colors mt-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed goals */}
      {completed.length > 0 && (
        <section>
          <h2 className="font-display text-xl mb-4 text-gray-500">Completed</h2>
          <div className="space-y-3">
            {completed.map(g => (
              <div key={g.id} className="card bg-green-50 border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">{g.title}</p>
                    <p className="text-xs text-gray-400">{g.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {goals.length === 0 && (
        <div className="card text-center py-12">
          <Target size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No goals yet — set your first one!</p>
        </div>
      )}
    </div>
  )
}
