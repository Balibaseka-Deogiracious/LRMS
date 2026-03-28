import { confirmAction, notifyError, notifySuccess } from '../utils/notifications'

export default function NotificationDemo() {
  const handleSuccess = () => {
    notifySuccess('Success notification example: action completed.')
  }

  const handleError = () => {
    notifyError('Error notification example: something went wrong.')
  }

  const handleConfirm = async () => {
    const confirmed = await confirmAction(
      'Confirm Action',
      'Do you want to continue with this example action?'
    )

    if (confirmed) {
      notifySuccess('Confirmed! SweetAlert action accepted.')
    } else {
      notifyError('Action cancelled.')
    }
  }

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-2">Toastify + SweetAlert2 Examples</h5>
        <p className="text-muted mb-3">
          Use these buttons to test global toast notifications and confirmation dialogs.
        </p>

        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-success" onClick={handleSuccess}>
            Show Success Toast
          </button>
          <button className="btn btn-danger" onClick={handleError}>
            Show Error Toast
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Show SweetAlert Confirmation
          </button>
        </div>
      </div>
    </div>
  )
}
