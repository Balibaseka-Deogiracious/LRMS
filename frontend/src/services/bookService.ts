import { Book } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function searchBooks(query = ''): Promise<Book[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/books?search=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search books')
    const data = await response.json()
    
    return Array.isArray(data) ? data : (data.books || [])
  } catch (error) {
    console.error('Search books error:', error)
    return []
  }
}

export async function getBook(id: string): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`)
    if (!response.ok) return null
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error('Get book error:', error)
    return null
  }
}

export async function addBook(payload: any) {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Authentication token not found')
  }

  const isFormData = payload instanceof FormData
  
  // Create FormData with all fields including file and cover
  const formData = new FormData()
  if (isFormData) {
    for (const [key, value] of payload.entries()) {
      formData.append(key, value as any)
    }
  } else {
    formData.append('title', payload.title?.trim() || '')
    formData.append('author', payload.author?.trim() || '')
    formData.append('isbn', payload.isbn?.trim() || '')
    formData.append('description', payload.description?.trim() || '')
    formData.append('publication_year', payload.publication_year || '')
    formData.append('total_copies', payload.total_copies || '1')
  }

  // Send all data at once (file, cover, and book metadata)
  const response = await fetch(`${API_BASE_URL}/admin/books`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to create book')
  }

  const created = await response.json()
  return created
}

export async function borrowBook(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found. Please login again.')
    }

    const response = await fetch(`${API_BASE_URL}/books/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: parseInt(id) }),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to borrow book'
      try {
        const errorData = await response.json()
        errorMessage = errorData?.detail || errorMessage
      } catch (parseError) {
        // If response body is not JSON, use status text
        errorMessage = response.statusText || `Error ${response.status}`
      }
      throw new Error(errorMessage)
    }

    await response.json()
    return true
  } catch (error: any) {
    const message = error?.message || 'Failed to borrow book. Please try again.'
    console.error('Borrow book error:', error, 'Message:', message)
    throw new Error(message)
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return response.ok
  } catch (error) {
    console.error('Delete book error:', error)
    return false
  }
}

export async function downloadBookFile(bookId: number): Promise<void> {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('File not found or access denied')
    }

    // Get filename from Content-Disposition header with better parsing
    const contentDisposition = response.headers.get('content-disposition') || ''
    let filename = 'book'
    
    if (contentDisposition) {
      // Try to extract filename from different formats:
      // format 1: filename="book.pdf"
      // format 2: filename=book.pdf
      // format 3: filename*=UTF-8''book.pdf
      const filenameMatch = contentDisposition.match(/filename(?:\*=(?:UTF-8'')?)?"?([^"\n\r;]+)"?/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].trim()
      }
    }
    
    // Ensure filename has an extension based on the content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const hasExtension = /\.[a-zA-Z0-9]{1,5}$/.test(filename)
    
    if (!hasExtension) {
      // Map MIME types to extensions
      const mimeToExtension: { [key: string]: string } = {
        'application/pdf': '.pdf',
        'application/epub+zip': '.epub',
        'text/plain': '.txt',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'text/csv': '.csv',
      }
      
      const ext = mimeToExtension[contentType] || '.bin'
      filename += ext
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download book file error:', error)
    throw new Error('Failed to download book file')
  }
}

export async function getCategories() {
  try {
    const token = localStorage.getItem('token')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/books/categories`, {
      headers,
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return Array.isArray(data) ? data : (data.categories || [])
  } catch (error) {
    console.error('Get categories error:', error)
    return []
  }
}
