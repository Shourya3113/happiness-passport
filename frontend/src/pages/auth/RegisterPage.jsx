import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const DEPARTMENTS = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Law', 'Medicine', 'Other']

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    department: '', student_id: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Account created!')
      if (user.role === 'student') navigate('/student/dashboard')
      else if (user.role === 'faculty') navigate('/faculty/dashboard')
      else navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <span className="text-4xl block mb-3">🛂</span>
          <h1 className="font-display text-3xl text-gray-900">Create your Passport</h1>
          <p className="text-gray-500 mt-2">Start tracking your growth journey</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full name</label>
                <input type="text" required className="input" placeholder="Your full name"
                  value={form.name} onChange={set('name')} />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input type="email" required className="input" placeholder="you@university.edu"
                  value={form.email} onChange={set('email')} />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <input type="password" required minLength={8} className="input" placeholder="Min 8 characters"
                  value={form.password} onChange={set('password')} />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" value={form.role} onChange={set('role')}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="label">Department</label>
                <select className="input" value={form.department} onChange={set('department')}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {form.role === 'student' && (
                <div className="col-span-2">
                  <label className="label">Student ID</label>
                  <input type="text" className="input" placeholder="e.g. STU2024001"
                    value={form.student_id} onChange={set('student_id')} />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
