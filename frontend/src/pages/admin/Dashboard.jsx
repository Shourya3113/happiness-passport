import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { Users, Trophy, Award, PieChart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => { adminService.stats().then(r => setStats(r.data)) }, [])

  const deptData = stats?.departments?.filter(d => d.name).map(d => ({
    name: d.name?.split(' ')[0], count: d.count
  })) ?? []

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Institution-wide analytics overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users}  label="Total Students"    value={stats?.total_students}        color="bg-brand-600" />
        <StatCard icon={Trophy} label="Achievements"      value={stats?.total_achievements}    color="bg-amber-500" />
        <StatCard icon={Trophy} label="Verified"          value={stats?.verified_achievements} color="bg-green-600" />
        <StatCard icon={Award}  label="Certificates"      value={stats?.total_certificates}    color="bg-blue-600" />
      </div>

      {deptData.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl mb-5">Students by Department</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2e9468" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
