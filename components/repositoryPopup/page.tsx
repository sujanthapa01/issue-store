'use client'

import axios from 'axios'
import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  username: string | null
}

const AddRepositoryPopup: React.FC<Props> = ({ username }) => {
  const [repoLink, setRepoLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [repoData, setRepoData] = useState<any | null>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [repoId, setRepoId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleFetchRepository = async () => {
    setStatus(null)
    setRepoData(null)
    setIssues([])
    setRepoId(null)

    if (!username) {
      setStatus('❌ Username not found.')
      return
    }

    let cleanedLink = repoLink.trim()
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

      setRepoData(payload)
      setStatus('✅ Repository info fetched. Click "Save Repository" to continue.')

    } catch (error) {
      console.error(error)
      setStatus('❌ Failed to fetch repository info.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRepository = async () => {
    if (!repoData) return
    try {
      await axios.post('/api/repository', repoData)
      setStatus('✅ Repository saved successfully!')
      setRepoId(repoData.id)
      await fetchIssues(repoData.owner, repoData.name)
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to save repository.')
    }
  }

  const fetchIssues = async (owner: string, repo: string) => {
    try {
      const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`)
      const filtered = data.filter((issue: any) => !issue.pull_request)
      setIssues(filtered)
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to fetch issues.')
    }
  }

  const saveIssue = async (issue: any) => {
    if (!repoId) return setStatus('❌ Repository ID missing.')
    try {
      await axios.post('/api/repository/issue', {
        title: issue.title,
        body: issue.body,
        state: issue.state,
        number: issue.number,
        repositoryId: repoId,
      })
      setStatus(`✅ Issue #${issue.number} saved.`)
    } catch (err) {
      console.error(err)
      setStatus(`❌ Failed to save issue #${issue.number}.`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-48 h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition">
          <span className="text-lg font-medium">➕ Add Repository</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto max-w-2xl" onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>📦 Add GitHub Repository</DialogTitle>
        </DialogHeader>

        <input
          type="text"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          placeholder="https://github.com/your-username/your-repo"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <button
          onClick={handleFetchRepository}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Checking...' : 'Check Repository'}
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}

        {repoData && (
          <div className="mt-6 border rounded p-4 bg-gray-50">
            <h3 className="text-xl font-semibold">{repoData.fullName}</h3>
            <p className="text-sm text-gray-700">{repoData.description || 'No description'}</p>
            <p className="text-xs">🔗 <a href={repoData.url} target="_blank" className="text-blue-500">{repoData.url}</a></p>
            <p className="text-xs">🔒 {repoData.isPrivate ? 'Private' : 'Public'}</p>
            <button
              onClick={handleSaveRepository}
              className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save Repository
            </button>
          </div>
        )}

        {issues.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Open Issues</h3>
            {issues.map((issue) => (
              <div key={issue.id} className="border p-3 mb-2 rounded">
                <h4 className="font-bold">#{issue.number}: {issue.title}</h4>
                <p className="text-sm">{issue.body?.slice(0, 100) || 'No description'}</p>
                <p className="text-xs italic">State: {issue.state}</p>
                <button
                  onClick={() => saveIssue(issue)}
                  className="mt-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Save Issue
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddRepositoryPopup
