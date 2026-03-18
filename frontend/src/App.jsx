import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Auth pages
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Student pages
import StudentDashboard   from './pages/student/Dashboard'
import AchievementsPage   from './pages/student/AchievementsPage'
import GoalsPage          from './pages/student/GoalsPage'
import EmotionsPage       from './pages/student/EmotionsPage'
import PassportPage       from './pages/student/PassportPage'

// Faculty pages
import FacultyDashboard   from './pages/faculty/Dashboard'
import VerifyPage         from './pages/faculty/VerifyPage'
import IssueCertPage      from './pages/faculty/IssueCertPage'

// Admin pages
import AdminDashboard     from './pages/admin/Dashboard'
import LeaderboardPage    from './pages/admin/LeaderboardPage'

// Layout
import AppLayout from './components/common/AppLayout'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Spinner() {
  return (
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  )
}

function RoleHome() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
  if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />
  if (user.role === 'admin')   return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<RoleHome />} />

        {/* Student */}
        <Route path="/student" element={
          <ProtectedRoute roles={['student']}>
            <AppLayout role="student" />
          </ProtectedRoute>
        }>
          <Route path="dashboard"    element={<StudentDashboard />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="goals"        element={<GoalsPage />} />
          <Route path="emotions"     element={<EmotionsPage />} />
          <Route path="passport"     element={<PassportPage />} />
        </Route>

        {/* Faculty */}
        <Route path="/faculty" element={
          <ProtectedRoute roles={['faculty']}>
            <AppLayout role="faculty" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="verify"    element={<VerifyPage />} />
          <Route path="issue"     element={<IssueCertPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AppLayout role="admin" />
          </ProtectedRoute>
        }>
          <Route path="dashboard"   element={<AdminDashboard />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
