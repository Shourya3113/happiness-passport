import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'student') navigate('/student/dashboard')
      else if (user.role === 'faculty') navigate('/faculty/dashboard')
      else navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-700 to-brand-500 text-white p-16">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛂</span>
          <div>
            <p className="font-display text-2xl">Happiness Passport</p>
            <p className="text-brand-200 text-sm font-mono uppercase tracking-widest">Your Growth Journey</p>
          </div>
        </div>
        <div>
          <blockquote className="font-display text-4xl leading-tight mb-6">
            "Every achievement is a stamp in your passport of life."
          </blockquote>
          <div className="flex gap-4">
            {['🏆 Achievements', '🎯 Goals', '💚 Wellbeing'].map(t => (
              <span key={t} className="bg-white/15 px-4 py-2 rounded-full text-sm font-medium">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-brand-200 text-sm">
          Tracking holistic student development across academics, personal growth, and emotional wellbeing.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <span className="text-3xl">🛂</span>
            <p className="font-display text-2xl text-brand-700">Happiness Passport</p>
          </div>

          <h1 className="font-display text-3xl text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email" required
                className="input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
