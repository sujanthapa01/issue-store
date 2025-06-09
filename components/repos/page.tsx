'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  username: string | null
}

const Page: React.FC<Props> = ({ username }) => {
  const [repos, setRepos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const fetchRepos = async () => {
    if (!username) {
      setError('Username is missing')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await axios.get(`https://api.github.com/users/${username}/repos`)
      const originalRepos = res.data.filter((repo: any) => !repo.fork)
      setRepos(originalRepos)
    } catch (err) {
      setError('Failed fetching repos')
    } finally {
      setLoading(false)
    }
  }

  const checkRepo = (repoName: string) => {
    router.push(`/profile/${username}/${repoName}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">🔍 GitHub Repositories</h2>

      <button
        onClick={fetchRepos}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
      >
        {loading ? 'Fetching Repos...' : 'Fetch Repositories'}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-6 grid gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-blue-700">{repo.name}</p>
                <p className="text-sm text-gray-500">
                  🐛 Open Issues: {repo.open_issues_count}
                </p>
              </div>
              <button
                onClick={() => checkRepo(repo.name)}
                className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Go →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
