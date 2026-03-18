import { useEffect, useState } from 'react'
import { emotionService } from '../../services/api'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'

const MOODS = [
  { key: 'very_happy', emoji: '😄', label: 'Very Happy', score: 5, color: '#22c55e' },
  { key: 'happy',      emoji: '😊', label: 'Happy',      score: 4, color: '#86efac' },
  { key: 'neutral',    emoji: '😐', label: 'Neutral',    score: 3, color: '#fbbf24' },
  { key: 'sad',        emoji: '😔', label: 'Sad',        score: 2, color: '#fb923c' },
  { key: 'very_sad',   emoji: '😢', label: 'Very Sad',   score: 1, color: '#ef4444' },
]

const SCORE_MAP = { very_happy: 5, happy: 4, neutral: 3, sad: 2, very_sad: 1 }

export default function EmotionsPage() {
  const [logs, setLogs]           = useState([])
  const [summary, setSummary]     = useState(null)
  const [selected, setSelected]   = useState(null)
  const [note, setNote]           = useState('')
  const [energy, setEnergy]       = useState(3)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = () => {
    emotionService.list(30).then(r => setLogs(r.data))
    emotionService.summary(30).then(r => setSummary(r.data))
  }

  const handleSubmit = async () => {
    if (!selected) return toast.error('Please select a mood')
    setSubmitting(true)
    try {
      await emotionService.log({ mood: selected, energy_level: energy, note })
      toast.success('Mood logged!')
      setSelected(null)
      setNote('')
      setEnergy(3)
      fetchData()
    } catch { toast.error('Failed to log mood') }
    finally { setSubmitting(false) }
  }

  const chartData = [...logs]
    .reverse()
    .slice(-14)
    .map(l => ({
      date: format(parseISO(l.logged_at), 'MMM d'),
      score: SCORE_MAP[l.mood],
      mood: l.mood,
    }))

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Emotion Check-In</h1>
        <p className="text-gray-500 mt-1">How are you feeling today?</p>
      </div>

      {/* Check-in form */}
      <div className="card mb-8">
        <h2 className="font-display text-xl mb-5">Log Today's Mood</h2>

        {/* Mood selector */}
        <div className="flex gap-3 mb-6">
          {MOODS.map(m => (
            <button key={m.key}
              onClick={() => setSelected(m.key)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all
                ${selected === m.key
                  ? 'border-brand-500 bg-brand-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Energy level */}
        <div className="mb-4">
          <label className="label">Energy level: {energy}/5</label>
          <input type="range" min={1} max={5} value={energy}
            onChange={e => setEnergy(+e.target.value)}
            className="w-full accent-brand-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Drained</span><span>Energised</span>
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="label">Add a note (optional)</label>
          <textarea className="input" rows={2} placeholder="What's on your mind?"
            value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <button onClick={handleSubmit} disabled={submitting || !selected}
          className="btn-primary disabled:opacity-50">
          {submitting ? 'Logging…' : 'Log Mood'}
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-3xl mb-1">
              {MOODS.find(m => m.key === summary.dominant_mood)?.emoji ?? '—'}
            </p>
            <p className="text-sm font-medium capitalize">{summary.dominant_mood?.replace('_', ' ')}</p>
            <p className="text-xs text-gray-400">Dominant mood</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-brand-700 mb-1">{summary.average_score}</p>
            <p className="text-sm font-medium">Average score</p>
            <p className="text-xs text-gray-400">Out of 5</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">{summary.total_logs}</p>
            <p className="text-sm font-medium">Check-ins</p>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="card">
          <h2 className="font-display text-xl mb-5">Mood Trend (Last 14 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [MOODS.find(m => m.score === v)?.label ?? v, 'Mood']} />
              <Line type="monotone" dataKey="score" stroke="#2e9468" strokeWidth={2}
                dot={{ fill: '#2e9468', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
