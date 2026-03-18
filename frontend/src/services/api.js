import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refresh}` }
        })
        localStorage.setItem('access_token', data.access_token)
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authService = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
}

export const achievementService = {
  list:   ()             => api.get('/achievements/'),
  create: (formData)     => api.post('/achievements/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  verify: (id, data)     => api.patch(`/achievements/${id}/verify`, data),
}

export const goalService = {
  list:   ()             => api.get('/goals/'),
  create: (data)         => api.post('/goals/', data),
  update: (id, data)     => api.patch(`/goals/${id}`, data),
  delete: (id)           => api.delete(`/goals/${id}`),
}

export const emotionService = {
  list:    (days = 30)   => api.get(`/emotions/?days=${days}`),
  log:     (data)        => api.post('/emotions/', data),
  summary: (days = 30)   => api.get(`/emotions/summary?days=${days}`),
}

export const certificateService = {
  list:   ()     => api.get('/certificates/'),
  issue:  (data) => api.post('/certificates/issue', data),
  verify: (uuid) => api.get(`/certificates/verify/${uuid}`),
}

export const adminService = {
  stats:       () => api.get('/admin/stats'),
  leaderboard: () => api.get('/admin/leaderboard'),
}

export const passportService = {
  mine: () => api.get('/passport/me'),
}
