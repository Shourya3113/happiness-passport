import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { Trophy, Medal } from 'lucide-react'

const RANK_STYLE = [
  'bg-amber-400 text-white',
  'bg-gray-300 text-white',
  'bg-orange-400 text-white',
]

export default function LeaderboardPage() {
  const [board, setBoard] = useState([])

  useEffect(() => { adminService.leaderboard().then(r => setBoard(r.data)) }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top 20 students by verified achievement points</p>
      </div>

      {board.length === 0 ? (
        <div className="card text-center py-16">
          <Trophy size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No data yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {board.map((s) => (
            <div key={s.id}
              className={`card flex items-center gap-4 hover:shadow-card-hover transition-shadow
                ${s.rank <= 3 ? 'border-2 border-amber-200 bg-amber-50' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${RANK_STYLE[s.rank - 1] || 'bg-gray-100 text-gray-600'}`}>
                {s.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-gray-400">{s.department}</p>
              </div>
              <div className="flex items-center gap-1.5 text-brand-700 font-bold">
                <Trophy size={15} className="text-amber-500" />
                {s.points} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
