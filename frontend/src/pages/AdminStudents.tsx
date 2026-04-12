import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { deleteUser, toggleUserActive, listUsers } from '../services/userService'

interface Student {
  id: string
  name: string
  email: string
  registration_number?: string
  is_active: boolean
  created_at?: string
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const loadStudents = async () => {
    setLoading(true)
    try {
      const records = await listUsers()
      // Filter only students (not admins)
      const studentsOnly = records.filter(r => r.role === 'student')
      const mappedStudents: Student[] = studentsOnly.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        is_active: r.active,
        created_at: r.createdAt,
      }))
      setStudents(mappedStudents)
    } catch (error) {
      console.error('Failed to load students:', error)
      toast.error('Failed to load students')
    }
    setLoading(false)
  }

  useEffect(() => {
    void loadStudents()
  }, [])

  const handleToggleActive = async (student: Student) => {
    const result = await Swal.fire({
      title: student.is_active ? 'Suspend Student?' : 'Activate Student?',
      text: `${student.name} will ${student.is_active ? 'lose' : 'get'} login access.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: student.is_active ? 'Suspend' : 'Activate',
    })

    if (!result.isConfirmed) return

    const ok = await toggleUserActive(student.id)
    if (ok) {
      toast.success('Student access updated.')
      void loadStudents()
    } else {
      toast.error('Unable to change this student status.')
    }
  }

  const handleDelete = async (student: Student) => {
    const result = await Swal.fire({
      title: 'Delete Student?',
      text: `Delete ${student.name} (${student.email}) from the system?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc3545',
    })

    if (!result.isConfirmed) return

    try {
      const ok = await deleteUser(student.id)
      if (ok) {
        toast.success('Student deleted.')
        void loadStudents()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete this student.'
      toast.error(message)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="saas-page">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0">Students</h4>
              <small className="text-muted">Manage registered student accounts.</small>
            </div>
            <span className="badge text-bg-primary">{students.length} students</span>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border" role="status" />
            </div>
          ) : students.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2" />
              No students registered yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`badge ${student.is_active ? 'text-bg-success' : 'text-bg-danger'}`}>
                          {student.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>{formatDate(student.created_at)}</td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className={`btn ${student.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleToggleActive(student)}
                            title={student.is_active ? 'Suspend this student' : 'Activate this student'}
                          >
                            {student.is_active ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(student)}
                            title="Delete this student"
                          >
                            Delete
                          </button>
                        </div>
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
