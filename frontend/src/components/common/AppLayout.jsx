import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, Trophy, Target, Heart, BookOpen,
  CheckSquare, Award, Users, BarChart2, LogOut
} from 'lucide-react'
import clsx from 'clsx'

const NAV = {
  student: [
    { to: '/student/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/achievements', icon: Trophy,          label: 'Achievements' },
    { to: '/student/goals',        icon: Target,          label: 'My Goals' },
    { to: '/student/emotions',     icon: Heart,           label: 'Emotion Check' },
    { to: '/student/passport',     icon: BookOpen,        label: 'My Passport' },
  ],
  faculty: [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/faculty/verify',    icon: CheckSquare,      label: 'Verify Achievements' },
    { to: '/faculty/issue',     icon: Award,            label: 'Issue Certificates' },
  ],
  admin: [
    { to: '/admin/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/leaderboard', icon: BarChart2,        label: 'Leaderboard' },
  ],
}

const ROLE_COLORS = {
  student: 'from-brand-700 to-brand-500',
  faculty: 'from-blue-700 to-blue-500',
  admin:   'from-purple-700 to-purple-500',
}

export default function AppLayout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = NAV[role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={clsx(
        'w-64 flex flex-col bg-gradient-to-b text-white shadow-xl',
        ROLE_COLORS[role]
      )}>
        {/* Logo */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛂</span>
            <div>
              <p className="font-display text-lg leading-tight">Happiness</p>
              <p className="font-display text-lg leading-tight">Passport</p>
            </div>
          </div>
          <p className="mt-1 text-xs text-white/60 uppercase tracking-widest font-mono">
            {role} portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
