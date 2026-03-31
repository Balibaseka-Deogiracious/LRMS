import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { requestPasswordReset } from '../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sentToEmail, setSentToEmail] = useState<string | null>(null)
  const [resetLink, setResetLink] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    if (!form.checkValidity()) {
      setValidated(true)
      return
    }

    setValidated(true)
    setLoading(true)

    try {
      const result = await requestPasswordReset(email)
      setSentToEmail(result.email)
      setResetLink(result.resetLink)
      toast.success('Password reset email sent.')
      await Swal.fire({
        icon: 'success',
        title: 'Reset Email Sent',
        text: `We sent a password reset email to ${result.email}.`,
        confirmButtonText: 'OK',
      })
    } catch (error: any) {
      const message = error?.message || 'Unable to send reset email right now.'
      toast.error(message)
      await Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: message,
        confirmButtonText: 'OK',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center px-3" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm" style={{ maxWidth: 480, width: '100%' }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-2">Forgot your password?</h4>
          <p className="text-muted mb-4">Enter your account email and we will send a reset link.</p>

          <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
            <div className="mb-3">
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
              <div className="invalid-feedback">Please enter a valid email address.</div>
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Sending reset email...
                  </>
                ) : (
                  'Send reset email'
                )}
              </button>
            </div>
          </form>

          {sentToEmail && resetLink && (
            <div className="alert alert-info mb-3" role="alert">
              <div className="fw-semibold mb-2">Email sent to {sentToEmail}</div>
              <div className="small mb-3">Demo mode: open the email link below to continue.</div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate(resetLink)}
              >
                Open reset link
              </button>
            </div>
          )}

          <p className="mb-0 text-muted">
            Back to <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
