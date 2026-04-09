import { useState } from 'react'
import API from '../services/api'

function SmartFormPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', message: ''
  })
  const [errors, setErrors] = useState({})
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  // JavaScript Validation
  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim())
      newErrors.name = 'Name is required!'
    else if (formData.name.trim().length < 3)
      newErrors.name = 'Name must be at least 3 characters!'

    if (!formData.email.trim())
      newErrors.email = 'Email is required!'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email address!'

    if (!formData.message.trim())
      newErrors.message = 'Message is required!'
    else if (formData.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters!'

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
    setSuggestion('')
    setSuccess('')

    try {
      const response = await API.post('/form/submit/', formData)
      setSuggestion(response.data.suggestion)
      setSuccess(response.data.message)
      console.log("Response:", response.data)
    } catch (err) {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">

          {/* Card */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">
                🤖 AI Smart Form Assistant
              </h3>

              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}

              {success && (
  <div className="alert alert-success mt-3">
    ✅ {success}
  </div>
)}

              <form onSubmit={handleSubmit} noValidate>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Message */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    placeholder="Type your message here..."
                    rows={4}
                  />
                  {errors.message && (
                    <div className="invalid-feedback">{errors.message}</div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Getting AI Suggestions...
                      </>
                    ) : (
                      '✨ Submit & Get AI Suggestions'
                    )}
                  </button>
                </div>

              </form>

              {/* AI Suggestion Box */}
              {suggestion && (
                <div className="mt-4 p-3 bg-light border rounded">
                  <h6 className="fw-bold text-primary">
                    🤖 AI Suggestions:
                  </h6>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                    {suggestion}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SmartFormPage