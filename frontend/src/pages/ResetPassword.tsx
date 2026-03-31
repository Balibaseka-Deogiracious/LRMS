import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { resetPassword } from '../services/authService'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams])

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    if (!form.checkValidity()) {
      setValidated(true)
      return
    }

    if (newPassword !== confirmPassword) {
      setValidated(true)
      toast.error('Passwords do not match.')
      return
    }

    if (!token) {
      toast.error('Missing reset token. Request a new reset email.')
      return
    }

    setValidated(true)
    setLoading(true)

    try {
      await resetPassword(token, newPassword)
      setCompleted(true)
      toast.success('Password has been reset successfully.')
      await Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your password has been updated. You can now sign in.',
        confirmButtonText: 'Go to Login',
      })
      navigate('/login')
    } catch (error: any) {
      const message = error?.message || 'Unable to reset password right now.'
      toast.error(message)
      await Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
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
          <h4 className="card-title mb-2">Reset your password</h4>
          <p className="text-muted mb-4">Create a new password for your account.</p>

          {!token && (
            <div className="alert alert-warning" role="alert">
              Invalid reset link. Please request a new one from the forgot password page.
            </div>
          )}

          <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New password</label>
              <input
                id="newPassword"
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading || completed || !token}
              />
              <div className="invalid-feedback">Please enter at least 6 characters.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading || completed || !token}
              />
              <div className="invalid-feedback">Please confirm your new password.</div>
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary" disabled={loading || completed || !token}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Updating password...
                  </>
                ) : (
                  'Update password'
                )}
              </button>
            </div>
          </form>

          <p className="mb-0 text-muted">
            Back to <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
