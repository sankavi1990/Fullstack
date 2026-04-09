import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '', email: '', password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.username.trim())
      newErrors.username = 'Username is required!'
    else if (formData.username.length < 3)
      newErrors.username = 'Username must be at least 3 characters!'

    if (!formData.email.trim())
      newErrors.email = 'Email is required!'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email!'

    if (!formData.password.trim())
      newErrors.password = 'Password is required!'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters!'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setSuccess('')

    try {
      await API.post('/auth/register/', formData)
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      if (err.response?.data?.username) {
        setErrors({ username: 'Username already exists!' })
      } else {
        setErrors({ general: 'Registration failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Register</h2>

        {errors.general && (
          <p style={styles.error}>{errors.general}</p>
        )}

        {success && (
          <p style={styles.success}>{success}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div style={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                ...styles.input,
                border: errors.username ? '1px solid red' : '1px solid #ccc'
              }}
              placeholder="Enter username"
            />
            {errors.username && (
              <small style={styles.fieldError}>{errors.username}</small>
            )}
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                border: errors.email ? '1px solid red' : '1px solid #ccc'
              }}
              placeholder="Enter email"
            />
            {errors.email && (
              <small style={styles.fieldError}>{errors.email}</small>
            )}
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                border: errors.password ? '1px solid red' : '1px solid #ccc'
              }}
              placeholder="Enter password (min 6 chars)"
            />
            {errors.password && (
              <small style={styles.fieldError}>{errors.password}</small>
            )}
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        {/* Link to Login */}
        <p style={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login here</Link>
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
    borderRadius: '10px', width: '380px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: { textAlign: 'center', marginBottom: '1.5rem' },
  inputGroup: {
    marginBottom: '1rem', display: 'flex',
    flexDirection: 'column', gap: '5px'
  },
  input: {
    padding: '10px', borderRadius: '6px',
    fontSize: '14px'
  },
  button: {
    width: '100%', padding: '10px',
    backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '6px',
    fontSize: '16px', cursor: 'pointer', marginTop: '0.5rem'
  },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
  success: { color: 'green', textAlign: 'center', marginBottom: '1rem' },
  fieldError: { color: 'red', fontSize: '12px' },
  linkText: { textAlign: 'center', marginTop: '1rem', fontSize: '14px' },
  link: { color: '#4f46e5', fontWeight: 'bold' }
}

export default RegisterPage