import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, storeToken } from '../services/authService'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    if (!form.checkValidity()) {
      setValidated(true)
      toast.error('Please fix the form errors and try again.')
      return
    }

    setValidated(true)
    setLoading(true)

    try {
      const res = await login(email, password)
      if (res?.token) {
        storeToken(res.token)
        toast.success('Login successful. Redirecting to dashboard...')
        navigate('/dashboard')
      } else {
        toast.error('Invalid login response from server.')
        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password. Please try again.',
          confirmButtonText: 'OK',
        })
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || 'Invalid email or password. Please try again.'
      toast.error(apiMessage)
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: apiMessage,
        confirmButtonText: 'OK',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center px-3" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm" style={{ maxWidth: 440, width: '100%' }}>
        <div className="card-body">
          <h4 className="card-title mb-1">Sign in to LRMS</h4>
          <p className="text-muted mb-4">Enter your credentials to continue.</p>

          <form noValidate className={validated ? 'was-validated' : ''} onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="invalid-feedback">Please enter a valid email address.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <div className="invalid-feedback">Password must be at least 6 characters.</div>
            </div>

            <div className="d-grid">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
