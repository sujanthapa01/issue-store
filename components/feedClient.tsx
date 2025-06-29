"use client"

import RepoCard from "./repoCard"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"

export default function FeedClient() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const fetchFeed = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/feed")
      setData(response.data?.feed || [])
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  if (loading) return <p className="text-center text-sm">Loading repositories...</p>
  if (error) return <p className="text-center text-sm text-red-500">Error loading feed.</p>
  if (!data.length) return <p className="text-center text-sm">No repositories found.</p>

  return (
    <div className="space-y-6">
      {data.map((repo: any) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
