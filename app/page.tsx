'use client'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Feed from "@/components/feed/page"

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
      console.log(response.data?.feed || null)
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
      <Feed data={data}/>
    </div>
  )
}

export default Page
