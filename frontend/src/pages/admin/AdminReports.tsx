import { useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function AdminReports() {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState('borrowed_books')

  const handleExport = async (format: 'csv' | 'pdf' | 'word' | 'excel') => {
    try {
      setIsExporting(true)
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      const response = await axios.get('/admin/reports/export', {
        params: {
          format: format === 'excel' ? 'excel' : format,
          type: selectedReportType,
          year,
          month,
        },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      const fileExtension = format === 'word' ? 'docx' : format === 'excel' ? 'xlsx' : format
      link.setAttribute('download', `${selectedReportType}_report.${fileExtension}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Report exported as ${format.toUpperCase()} successfully!`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const handleGenerateReport = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Generate report?',
      text: 'This will prepare a summary report for books and borrowing activity.',
      showCancelButton: true,
      confirmButtonText: 'Generate',
    })

    if (!result.isConfirmed) return
    toast.success('Report generated successfully!')
  }

  return (
    <div className="saas-page">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Generate Reports</h4>
          <p className="text-muted mb-4">Create and export reports for library administration.</p>
          
          <div className="mb-4">
            <label className="form-label">Select Report Type</label>
            <select
              className="form-select"
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
            >
              <option value="students">Students Report</option>
              <option value="books">Books Report</option>
              <option value="borrowed_books">Borrowed Books Report</option>
              <option value="returned_books">Returned Books Report</option>
              <option value="unreturned_books">Unreturned Books Report</option>
            </select>
          </div>

          <div className="mb-4">
            <button className="btn btn-primary me-2" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-4">Export Report As</h5>
          <p className="text-muted mb-4">Choose a format to export the current report.</p>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <button
                className="btn btn-outline-success w-100"
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                <i className="bi bi-file-earmark-csv me-2"></i>
                {isExporting ? 'Exporting...' : 'Export as CSV'}
              </button>
            </div>
            <div className="col-md-6 mb-3">
              <button
                className="btn btn-outline-danger w-100"
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                {isExporting ? 'Exporting...' : 'Export as PDF'}
              </button>
            </div>
            <div className="col-md-6 mb-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => handleExport('word')}
                disabled={isExporting}
              >
                <i className="bi bi-file-earmark-word me-2"></i>
                {isExporting ? 'Exporting...' : 'Export as Word'}
              </button>
            </div>
            <div className="col-md-6 mb-3">
              <button
                className="btn btn-outline-warning w-100"
                onClick={() => handleExport('excel')}
                disabled={isExporting}
              >
                <i className="bi bi-file-earmark-excel me-2"></i>
                {isExporting ? 'Exporting...' : 'Export as Excel'}
              </button>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Tip:</strong> Select a report type above before exporting. The report will be generated for the current month.
          </div>
        </div>
      </div>
    </div>
  )
}
