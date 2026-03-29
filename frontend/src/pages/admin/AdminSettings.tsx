import { useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export default function AdminSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true)

  const handleSave = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Save settings?',
      showCancelButton: true,
      confirmButtonText: 'Save',
    })

    if (!result.isConfirmed) return
    toast.success('Settings saved successfully (demo).')
  }

  return (
    <div className="saas-page">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="mb-2">Settings</h4>
          <p className="text-muted">Configure librarian preferences and notifications.</p>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailAlerts"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="emailAlerts">Enable email alerts</label>
          </div>

          <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  )
}
