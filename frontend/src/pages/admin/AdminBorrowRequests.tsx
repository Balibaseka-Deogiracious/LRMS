import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface BorrowRequest {
  id: number
  student_id: number
  book_id: number
  status: string
  requested_at: string
  approved_at?: string
  denial_reason?: string
  student?: {
    id: number
    full_name: string
    email: string
    registration_number: string
  }
  book?: {
    id: number
    title: string
    author: string
    isbn: string
  }
}

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [processing, setProcessing] = useState<number | null>(null)

  const loadBorrowRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_BASE_URL}/admin/borrow-requests?status_filter=${statusFilter}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch borrow requests')
      }

      const data = await response.json()
      setRequests(data || [])
    } catch (error) {
      console.error('Failed to load borrow requests:', error)
      toast.error('Failed to load borrow requests')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBorrowRequests()
  }, [statusFilter])

  const handleApprove = async (requestId: number) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Approve Borrow Request?',
      text: 'This will approve the borrow request and create a borrow record.',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#28a745',
    })

    if (!result.isConfirmed) return

    setProcessing(requestId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_BASE_URL}/admin/borrow-requests/${requestId}/approve`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.detail || 'Failed to approve request')
      }

      toast.success('Borrow request approved successfully!')
      await loadBorrowRequests()
    } catch (error: any) {
      console.error('Failed to approve request:', error)
      toast.error(error.message || 'Failed to approve request')
    } finally {
      setProcessing(null)
    }
  }

  const handleDeny = async (requestId: number) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Deny Borrow Request?',
      input: 'textarea',
      inputPlaceholder: 'Enter reason for denial (optional)',
      showCancelButton: true,
      confirmButtonText: 'Deny',
      confirmButtonColor: '#dc3545',
      inputAttributes: {
        maxlength: '500',
      },
    })

    if (!result.isConfirmed) return

    setProcessing(requestId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_BASE_URL}/admin/borrow-requests/${requestId}/deny`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            denial_reason: result.value || 'No reason provided',
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.detail || 'Failed to deny request')
      }

      toast.success('Borrow request denied!')
      await loadBorrowRequests()
    } catch (error: any) {
      console.error('Failed to deny request:', error)
      toast.error(error.message || 'Failed to deny request')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="saas-page">
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="saas-page">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Borrow Requests Management</h4>
          <p className="text-muted mb-4">Review and manage student book borrow requests.</p>

          <div className="mb-4">
            <label className="form-label">Filter by Status</label>
            <div className="btn-group" role="group">
              {['pending', 'approved', 'denied', 'cancelled'].map((status) => (
                <input
                  key={status}
                  type="radio"
                  className="btn-check"
                  name="statusFilter"
                  id={`status-${status}`}
                  value={status}
                  checked={statusFilter === status}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              ))}
              <label className="btn btn-outline-primary" htmlFor="status-pending">
                Pending
              </label>
              <label className="btn btn-outline-success" htmlFor="status-approved">
                Approved
              </label>
              <label className="btn btn-outline-danger" htmlFor="status-denied">
                Denied
              </label>
              <label className="btn btn-outline-secondary" htmlFor="status-cancelled">
                Cancelled
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {requests.length === 0 ? (
            <div className="alert alert-info mb-0">
              No borrow requests found with status: <strong>{statusFilter}</strong>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Request ID</th>
                    <th>Student Name</th>
                    <th>Book Title</th>
                    <th>Requested Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <code className="text-primary">#{request.id}</code>
                      </td>
                      <td>
                        <div>
                          <strong>{request.student?.full_name || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{request.student?.registration_number}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{request.book?.title || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{request.book?.author}</small>
                        </div>
                      </td>
                      <td>
                        <small>{formatDate(request.requested_at)}</small>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            request.status === 'pending'
                              ? 'warning'
                              : request.status === 'approved'
                                ? 'success'
                                : 'danger'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {request.status === 'pending' ? (
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => handleApprove(request.id)}
                              disabled={processing === request.id}
                            >
                              {processing === request.id ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i>
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDeny(request.id)}
                              disabled={processing === request.id}
                            >
                              {processing === request.id ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Denying...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-x-circle me-1"></i>
                                  Deny
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <small className="text-muted">
                            {request.status === 'denied' && request.denial_reason
                              ? `Reason: ${request.denial_reason}`
                              : 'Action already taken'}
                          </small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
