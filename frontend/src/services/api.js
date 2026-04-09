import axios from 'axios'

const API = axios.create({
  baseURL: 'https://sankavi.pythonanywhere.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto clear token if 401 received
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired token automatically
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API