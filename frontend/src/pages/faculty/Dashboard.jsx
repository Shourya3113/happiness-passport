import { useEffect, useState } from 'react'
import { achievementService, certificateService } from '../../services/api'
import { CheckSquare, Award, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FacultyDashboard() {
  const [pending, setPending] = useState([])
  const [certs, setCerts] = useState([])

  useEffect(() => {
    achievementService.list().then(r => setPending(r.data.filter(a => a.status === 'pending')))
    certificateService.list().then(r => setCerts(r.data))
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl mb-2">Faculty Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage student achievements and certificates</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Clock size={22} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pending.length}</p>
            <p className="text-sm text-gray-500">Pending Reviews</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Award size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{certs.length}</p>
            <p className="text-sm text-gray-500">Certificates Issued</p>
          </div>
        </div>
        <Link to="/faculty/verify" className="card flex items-center gap-4 hover:shadow-card-hover transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <CheckSquare size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-600">Go to Verify →</p>
            <p className="text-xs text-gray-400">Review submissions</p>
          </div>
        </Link>
      </div>

      {pending.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl mb-4">Needs Review</h2>
          <div className="space-y-2">
            {pending.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.category} · submitted {a.created_at?.split('T')[0]}</p>
                </div>
                <span className="badge-yellow">Pending</span>
              </div>
            ))}
          </div>
          {pending.length > 5 && (
            <Link to="/faculty/verify" className="text-sm text-brand-600 hover:underline mt-3 block text-center">
              View all {pending.length} pending →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
