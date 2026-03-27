import React, { useState, useEffect } from 'react'
import { FiBook, FiAlertCircle, FiUsers, FiTrendingUp } from 'react-icons/fi'
import MetricCard from '../components/MetricCard'
import BookCard from '../components/BookCard'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

interface DashboardProps {
  userRole: 'patron' | 'librarian'
}

export default function Dashboard({ userRole }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    totalBooks: 0,
    activeLoans: 0,
    overdueItems: 0,
    activeReaders: 0,
  })
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data initialization
  useEffect(() => {
    const mockMetrics = {
      totalBooks: 2847,
      activeLoans: 342,
      overdueItems: 23,
      activeReaders: 1204,
    }
    const mockBooks = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        status: 'available',
        cover: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        status: 'borrowed',
        dueDate: '2026-04-15',
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        status: 'overdue',
        dueDate: '2026-03-20',
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        status: 'available',
      },
      {
        id: '5',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        status: 'available',
      },
      {
        id: '6',
        title: 'Brave New World',
        author: 'Aldous Huxley',
        status: 'borrowed',
        dueDate: '2026-04-01',
      },
    ]

    setMetrics(mockMetrics)
    setBooks(mockBooks)
    setLoading(false)
  }, [])

  const handleBorrow = async (bookId: string, bookTitle: string) => {
    const result = await Swal.fire({
      title: 'Confirm Borrow',
      text: `Do you want to borrow "${bookTitle}"?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Borrow it!',
    })

    if (result.isConfirmed) {
      toast.success(`📚 "${bookTitle}" borrowed successfully!`)
    }
  }

  const handleReturn = async (bookId: string, bookTitle: string) => {
    const result = await Swal.fire({
      title: 'Return Book',
      text: `Return "${bookTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Return it!',
    })

    if (result.isConfirmed) {
      toast.success(`✅ "${bookTitle}" returned successfully!`)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<FiBook className="w-6 h-6" />}
          title="Total Books"
          value={metrics.totalBooks.toLocaleString()}
          subtitle="In the library"
          color="indigo"
          trend="up"
        />
        <MetricCard
          icon={<FiTrendingUp className="w-6 h-6" />}
          title="Active Loans"
          value={metrics.activeLoans}
          subtitle="Currently borrowed"
          color="purple"
        />
        <MetricCard
          icon={<FiAlertCircle className="w-6 h-6" />}
          title="Overdue Items"
          value={metrics.overdueItems}
          subtitle="Need attention"
          color="pink"
          trend="down"
        />
        <MetricCard
          icon={<FiUsers className="w-6 h-6" />}
          title="Active Readers"
          value={metrics.activeReaders}
          subtitle="Registered members"
          color="blue"
          trend="up"
        />
      </div>

      {/* Featured Books Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {userRole === 'patron' ? 'Featured Books' : 'Recent Activity'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {userRole === 'patron'
              ? 'Check out these popular titles'
              : 'Library activity overview'}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              userRole={userRole}
              onBorrow={() => handleBorrow(book.id, book.title)}
              onReturn={() => handleReturn(book.id, book.title)}
              onWishlist={() => toast.info(`💌 "${book.title}" added to wishlist!`)}
            />
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="glass rounded-xl p-8 backdrop-blur-md">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Welcome to LRMS! 🎉
        </h4>
        <p className="text-slate-600 dark:text-slate-400">
          {userRole === 'patron'
            ? 'Explore our extensive collection of books. Use the search feature to find titles by author, genre, or keyword. Don\'t forget to add your favorites to your wishlist!'
            : 'Manage your library inventory and track book availability. Use the Inventory section to update book statuses and manage the collection.'}
        </p>
      </div>
    </div>
  )
}
