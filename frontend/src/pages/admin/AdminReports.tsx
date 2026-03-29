import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export default function AdminReports() {
  const handleGenerate = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Generate report?',
      text: 'This will prepare a summary report for books and borrowing activity.',
      showCancelButton: true,
      confirmButtonText: 'Generate',
    })

    if (!result.isConfirmed) return
    toast.success('Report generated successfully (demo).')
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h4 className="mb-2">Reports</h4>
        <p className="text-muted">Generate and review activity reports for administration.</p>
        <button className="btn btn-primary" onClick={handleGenerate}>Generate Report</button>
      </div>
    </div>
  )
}
