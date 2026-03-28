import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

// Centralized toast helpers keep notification usage consistent across pages.
export const notifySuccess = (message: string) => {
  toast.success(message)
}

export const notifyError = (message: string) => {
  toast.error(message)
}

// Reusable confirmation dialog helper powered by SweetAlert2.
export const confirmAction = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  })

  return result.isConfirmed
}
