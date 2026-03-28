import React, { useState } from 'react'

interface Props {
  onSearch: (q: string) => void
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('')

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={submit} className="mb-3">
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Search by title, author, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
  )
}
