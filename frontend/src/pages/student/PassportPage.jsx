import { useEffect, useState } from 'react'
import { passportService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { Trophy, Target, BookOpen, Heart, Download } from 'lucide-react'

const MOOD_EMOJI = { very_happy:'😄', happy:'😊', neutral:'😐', sad:'😔', very_sad:'😢' }

export default function PassportPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => { passportService.mine().then(r => setData(r.data)) }, [])

  if (!data) return <div className="p-8 text-gray-400">Loading passport…</div>

  const { student, happiness_score, achievements, goals, certificates, recent_emotions, stats } = data

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl">My Passport</h1>
        <p className="text-gray-500 mt-1">Your full growth record</p>
      </div>

      {/* Passport cover */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-500 rounded-3xl text-white p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-200 mb-2">Happiness Passport</p>
              <h2 className="font-display text-4xl mb-1">{student.name}</h2>
              <p className="text-brand-200">{student.department} · {student.student_id}</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold">{happiness_score}</p>
              <p className="text-xs text-brand-200 mt-1">Happiness Score</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            {[
              { icon: Trophy, label: 'Achievements', value: stats.total_achievements },
              { icon: Target, label: 'Goals Done', value: `${stats.completed_goals}/${stats.total_goals}` },
              { icon: BookOpen, label: 'Certificates', value: stats.total_certificates },
              { icon: Heart, label: 'Mood Logs', value: recent_emotions.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4 text-center">
                <Icon size={20} className="mx-auto mb-2 text-white/70" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-brand-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stamps / Achievements */}
      <div className="card mb-6">
        <h2 className="font-display text-xl mb-4">Achievement Stamps</h2>
        {achievements.length === 0
          ? <p className="text-gray-400 text-sm">No verified achievements yet</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {achievements.map(a => (
              <div key={a.id} className="border-2 border-brand-200 rounded-2xl p-4 text-center bg-brand-50">
                <p className="text-2xl mb-1">🏆</p>
                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-500 mt-1">{a.category} · {a.points} pts</p>
                <p className="text-xs text-gray-400">{a.date_achieved}</p>
              </div>
            ))}
          </div>
        }
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-display text-xl mb-4">Certificates</h2>
          <div className="space-y-3">
            {certificates.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-gray-500">Issued by {c.issued_by} · {c.issued_at?.split('T')[0]}</p>
                </div>
                {c.certificate_url && (
                  <a href={c.certificate_url} target="_blank" rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700">
                    <Download size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent emotions */}
      {recent_emotions.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl mb-4">Recent Moods</h2>
          <div className="flex flex-wrap gap-2">
            {recent_emotions.map(e => (
              <span key={e.id} title={e.note || e.mood}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl cursor-default">
                {MOOD_EMOJI[e.mood]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
