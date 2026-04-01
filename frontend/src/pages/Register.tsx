import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { registerUser } from '../services/authService'

export default function Register() {
  const [name, setName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    if (!form.checkValidity()) {
      setValidated(true)
      return
    }

    if (password !== confirmPassword) {
      setValidated(true)
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password and Confirm Password must match.',
      })
      return
    }

    setValidated(true)
    setLoading(true)

    try {
      await registerUser({ 
        name: name.trim(), 
        email: email.trim(), 
        password,
        registrationNumber: registrationNumber.trim(),
      })
      toast.success('Registration successful. Redirecting to login...')
      navigate('/login')
    } catch (error: any) {
      const message = error?.message || error?.response?.data?.detail || 'Registration failed. Please try again.'
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: message,
        confirmButtonText: 'OK',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center px-3" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm" style={{ maxWidth: 520, width: '100%' }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-2">Create your account</h4>
          <p className="text-muted mb-4">Register to start searching, borrowing, and managing library resources.</p>

          <form noValidate className={`row g-3 ${validated ? 'was-validated' : ''}`} onSubmit={handleSubmit}>
            <div className="col-12">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                className="form-control"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="invalid-feedback">Name is required.</div>
            </div>

            <div className="col-12">
              <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
              <input
                id="registrationNumber"
                className="form-control"
                placeholder="e.g., STU-2024-001"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
              <div className="invalid-feedback">Registration number is required.</div>
            </div>

            <div className="col-12">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="invalid-feedback">A valid email is required.</div>
            </div>

            <div className="col-12">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group has-validation">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                </button>
                <div className="invalid-feedback">Password must be at least 6 characters.</div>
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group has-validation">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control ${confirmPassword && confirmPassword !== password ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                </button>
                <div className="invalid-feedback">Passwords must match.</div>
              </div>
            </div>

            <div className="col-12 d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-3 mb-0 text-muted">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
