import { useEffect, useState } from 'react'
import { achievementService } from '../../services/api'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Trophy, Clock } from 'lucide-react'

export default function VerifyPage() {
  const [achievements, setAchievements] = useState([])
  const [remarks, setRemarks] = useState({})

  useEffect(() => {
    achievementService.list().then(r => setAchievements(r.data.filter(a => a.status === 'pending')))
  }, [])

  const handle = async (id, status) => {
    try {
      const { data } = await achievementService.verify(id, { status, remarks: remarks[id] || '' })
      setAchievements(a => a.filter(x => x.id !== id))
      toast.success(`Achievement ${status}`)
    } catch { toast.error('Action failed') }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Verify Achievements</h1>
        <p className="text-gray-500 mt-1">{achievements.length} pending review</p>
      </div>

      {achievements.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle size={48} className="text-green-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">All caught up! No pending achievements.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map(a => (
            <div key={a.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-500">{a.description}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="badge-blue">{a.category}</span>
                    <span className="text-xs text-gray-400">{a.date_achieved}</span>
                    <span className="text-xs text-brand-600">+{a.points} pts</span>
                  </div>
                  {a.certificate_url && (
                    <a href={a.certificate_url} target="_blank" rel="noreferrer"
                      className="text-xs text-blue-500 hover:underline mt-1 block">
                      View certificate ↗
                    </a>
                  )}

                  <div className="mt-3">
                    <input className="input text-sm"
                      placeholder="Remarks (optional)"
                      value={remarks[a.id] || ''}
                      onChange={e => setRemarks(r => ({ ...r, [a.id]: e.target.value }))} />
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button onClick={() => handle(a.id, 'verified')}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                      <CheckCircle size={15} /> Verify
                    </button>
                    <button onClick={() => handle(a.id, 'rejected')}
                      className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm px-4 py-2 rounded-lg transition-colors">
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
