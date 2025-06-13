'use client'

import axios from 'axios'
import React, { use, useState } from 'react'

type Props = {
  username: string | null
}

const Page: React.FC<Props> = ({ username }) => {
  const [repoLink, setRepoLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleAddRepository = async () => {
    setStatus(null)

    if (!username) {
      setStatus('❌ Username not found.')
      return
    }


    let cleanedLink = repoLink.trim()

    // Remove trailing slash or .git extension
    if (cleanedLink.endsWith('/')) cleanedLink = cleanedLink.slice(0, -1)
    if (cleanedLink.endsWith('.git')) cleanedLink = cleanedLink.slice(0, -4)

    const match = cleanedLink.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/)
    if (!match) {
      setStatus('❌ Invalid GitHub repo link.')
      return
    }

    const owner = match[1]
    const repoName = match[2]

    if (owner.toLowerCase() !== username.toLowerCase()) {
      setStatus('❌ You can only add repositories you own.')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`)

      if (data.fork) {
        setStatus('❌ Forked repositories are not allowed.')
        return
      }

      const payload = {
        id: data.id.toString(),
        name: data.name,
        owner: data.owner.login,
        fullName: data.full_name,
        url: data.html_url,
        description: data.description,
        isPrivate: data.private,
        username: owner,
      }

      await axios.post('/api/repository', payload)
      setStatus('✅ Repository added successfully!')
      setRepoLink('') 
    } catch (error: any) {
      console.error(error)
      setStatus('❌ Failed to fetch or save repository.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">📦 Add Your GitHub Repository</h2>

      <input
        type="text"
        value={repoLink}
        onChange={(e) => setRepoLink(e.target.value)}
        placeholder="https://github.com/your-username/your-repo or .git"
        className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
      />

      <button
        onClick={handleAddRepository}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Adding...' : 'Add Repository'}
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  )
}

export default Page
