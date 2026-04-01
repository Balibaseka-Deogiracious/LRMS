import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { deleteUser, listUsers, toggleUserActive, updateUserRole } from '../services/userService'
import type { LocalUser } from '../services/mockStore'

export default function AdminUsers() {
  const [users, setUsers] = useState<LocalUser[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const records = await listUsers()
    setUsers(records)
    setLoading(false)
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const handleRoleChange = async (userId: string, role: 'admin' | 'student') => {
    const ok = await updateUserRole(userId, role)
    if (ok) {
      toast.success('User role updated.')
      void loadUsers()
    }
  }

  const handleToggleActive = async (user: LocalUser) => {
    const result = await Swal.fire({
      title: user.active ? 'Deactivate User?' : 'Activate User?',
      text: `${user.name} will ${user.active ? 'lose' : 'get'} login access.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: user.active ? 'Deactivate' : 'Activate',
    })

    if (!result.isConfirmed) return

    const ok = await toggleUserActive(user.id)
    if (ok) {
      toast.success('User access updated.')
      void loadUsers()
    } else {
      toast.error('Unable to change this user status.')
    }
  }

  const handleDelete = async (user: LocalUser) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: `Delete ${user.name} (${user.email}) from the system?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc3545',
    })

    if (!result.isConfirmed) return

    try {
      const ok = await deleteUser(user.id)
      if (ok) {
        toast.success('User deleted.')
        void loadUsers()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete this user.'
      toast.error(message)
    }
  }

  return (
    <div className="saas-page">
      <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-0">System Users</h4>
            <small className="text-muted">Librarian controls who can access the system.</small>
          </div>
          <span className="badge text-bg-primary">{users.length} users</span>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td style={{ maxWidth: 140 }}>
                      <select
                        className="form-select form-select-sm"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'student')}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Librarian</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${user.active ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {user.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleToggleActive(user)}>
                          {user.active ? 'Disable' : 'Enable'}
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(user)}>
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
