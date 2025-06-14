'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Repository = {
  id: string
  name: string
  fullName: string
  description: string
  url: string
  isPrivate: boolean
}

const SavedRepositoriesPopup = () => {
  const [open, setOpen] = useState(false)
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const fetchAllData = async () => {
    setLoading(true)
    setStatus(null)
    setRepos([])
    const username = localStorage.getItem('github_username')

    console.log(username)
    try {
      const { data } = await axios.get('/api/getRepository', {
        params: { username },
      })
      setRepos(data)
      setStatus('✅ Loaded repositories.')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to load repositories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchAllData()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-48 h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition">
          <span className="text-lg font-medium">📂 Show Saved Repositories</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>📦 Your Repositories</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm">Loading...</p>}
        {status && <p className="text-sm mb-2">{status}</p>}

        {repos.length === 0 && !loading ? (
          <p className="text-gray-500">No repositories saved yet.</p>
        ) : (
          repos.map((repo) => (
            <div key={repo.id} className="border rounded p-4 mb-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold">{repo.fullName}</h3>
              <p className="text-sm text-gray-700">{repo.description || 'No description'}</p>
              <a href={repo.url} target="_blank" className="text-xs text-blue-600 block mt-1">
                🔗 {repo.url}
              </a>
              <p className="text-xs text-gray-500">🔒 {repo.isPrivate ? 'Private' : 'Public'}</p>
            </div>
          ))
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SavedRepositoriesPopup
