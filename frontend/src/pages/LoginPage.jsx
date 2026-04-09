import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import API from '../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Clear any old tokens first
    localStorage.removeItem('access_token')      // ← ADD THIS
    localStorage.removeItem('refresh_token')     // ← ADD THIS

    try {
      const response = await API.post('/auth/login/', formData, {
        headers: {
          'Content-Type': 'application/json',   // ← ADD THIS
        }
      })
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid username or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.linkText}>
  Don't have an account?{' '}
  <Link to="/register" style={styles.link}>Register here</Link>
</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white', padding: '2rem',
    borderRadius: '10px', width: '350px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  linkText: { textAlign: 'center', marginTop: '1rem', fontSize: '14px' },
link: { color: '#4f46e5', fontWeight: 'bold' },
  title: { textAlign: 'center', marginBottom: '1.5rem' },
  inputGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  button: {
    width: '100%', padding: '10px',
    backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '6px',
    fontSize: '16px', cursor: 'pointer', marginTop: '0.5rem'
  },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' }
}

export default LoginPage