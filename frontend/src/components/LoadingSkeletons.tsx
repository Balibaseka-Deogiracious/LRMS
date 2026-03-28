export function StatsCardsSkeleton() {
  return (
    <div className="row g-3 mb-4">
      {[1, 2, 3].map((item) => (
        <div className="col-12 col-md-4" key={item}>
          <div className="card shadow-sm">
            <div className="card-body placeholder-glow">
              <span className="placeholder col-6 mb-2" />
              <span className="placeholder col-4" style={{ height: '1.5rem' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BookGridSkeleton() {
  return (
    <div className="row g-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body placeholder-glow">
              <span className="placeholder col-8 mb-2" />
              <span className="placeholder col-5 mb-2" />
              <span className="placeholder col-12 mb-2" />
              <span className="placeholder col-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Year</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="placeholder-glow">
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index}>
              <td><span className="placeholder col-8" /></td>
              <td><span className="placeholder col-7" /></td>
              <td><span className="placeholder col-6" /></td>
              <td><span className="placeholder col-5" /></td>
              <td><span className="placeholder col-4" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
