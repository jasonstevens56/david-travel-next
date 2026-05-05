'use client'

import {useRouter} from 'next/navigation'
import {FormEvent, useState} from 'react'

export default function SearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = query.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="search-bar-wrap">
      <div className="container">
        <form className="search-form" onSubmit={submit}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search David Travel articles..."
            aria-label="Search articles"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  )
}
