import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { passportService, emotionService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { Trophy, Target, Heart, BookOpen, TrendingUp, Star } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

const MOOD_EMOJI = {
  very_happy: '😄', happy: '😊', neutral: '😐', sad: '😔', very_sad: '😢'
}

function StatCard({ icon: Icon, label, value, color, to }) {
  const inner = (
    <div className={`card hover:shadow-card-hover transition-shadow flex items-center gap-4 ${to ? 'cursor-pointer' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [passport, setPassport] = useState(null)
  const [emotionSummary, setEmotionSummary] = useState(null)

  useEffect(() => {
    passportService.mine().then(r => setPassport(r.data)).catch(() => {})
    emotionService.summary(30).then(r => setEmotionSummary(r.data)).catch(() => {})
  }, [])

  const score = passport?.happiness_score ?? 0
  const chartData = [{ name: 'Score', value: score, fill: '#2e9468' }]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gray-900">
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your growth summary for today</p>
      </div>

      {/* Happiness Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score gauge */}
        <div className="card col-span-1 flex flex-col items-center justify-center py-8">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">Happiness Score</p>
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius={48} outerRadius={72} data={chartData}
                startAngle={90} endAngle={-270} barSize={14}>
                <RadialBar background dataKey="value" cornerRadius={8} max={100} />
                <Tooltip formatter={(v) => [`${v}/100`, 'Score']} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-4xl font-bold text-brand-700 -mt-2">{score}</p>
          <p className="text-xs text-gray-400 mt-1">out of 100</p>
        </div>

        {/* Stat cards */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <StatCard icon={Trophy} label="Verified Achievements" color="bg-amber-500"
            value={passport?.stats?.total_achievements} to="/student/achievements" />
          <StatCard icon={Target} label="Goals Completed" color="bg-brand-600"
            value={`${passport?.stats?.completed_goals ?? 0}/${passport?.stats?.total_goals ?? 0}`}
            to="/student/goals" />
          <StatCard icon={BookOpen} label="Certificates" color="bg-blue-500"
            value={passport?.stats?.total_certificates} to="/student/passport" />
          <StatCard icon={Heart} label="Mood (30 days)" color="bg-pink-500"
            value={emotionSummary?.dominant_mood
              ? MOOD_EMOJI[emotionSummary.dominant_mood]
              : '—'}
            to="/student/emotions" />
        </div>
      </div>

      {/* Recent achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Recent Achievements</h2>
            <Link to="/student/achievements" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          {passport?.achievements?.length === 0 && (
            <p className="text-gray-400 text-sm py-4 text-center">No verified achievements yet</p>
          )}
          <div className="space-y-3">
            {passport?.achievements?.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Trophy size={16} className="text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.category} · {a.points} pts</p>
                </div>
                <span className="badge-green ml-auto shrink-0">verified</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Goals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Active Goals</h2>
            <Link to="/student/goals" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          {passport?.goals?.filter(g => g.status === 'active').length === 0 && (
            <p className="text-gray-400 text-sm py-4 text-center">No active goals yet</p>
          )}
          <div className="space-y-3">
            {passport?.goals?.filter(g => g.status === 'active').slice(0, 4).map(g => (
              <div key={g.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-sm font-medium">{g.title}</p>
                  <span className="text-xs text-gray-500">{g.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-brand-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
