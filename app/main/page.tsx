'use client'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

interface FeedType {
  id: string
  name: string
  owner: string
  fullName: string
  url: string
}

function Page() {
  const [data, setData] = useState<FeedType[]>([])
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const feed = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/feed")
      setData(response.data?.feed || [])
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    feed()
  }, [feed])

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading feed</p>}
      {data.map((repo) => (
        <div key={repo.id} className="mb-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">{repo.fullName}</h2>
          <p className="text-sm text-gray-600">{repo.url}</p>
        </div>
      ))}
    </div>
  )
}

export default Page
