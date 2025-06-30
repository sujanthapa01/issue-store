"use client"

import { formatDistanceToNow } from "date-fns"

export default function RepoCard({ repo }: { repo: any }) {
  const issues = repo.issues || []

  const bgStyles = [
    {
      bg: "bg-gradient-to-br from-white via-slate-50 to-blue-50",
      border: "hover:border-blue-300",
      button: "bg-blue-100 border-blue-200 text-blue-700",
    },
    {
      bg: "bg-gradient-to-br from-white via-pink-50 to-rose-50",
      border: "hover:border-rose-300",
      button: "bg-rose-100 border-rose-200 text-rose-700",
    },
    {
      bg: "bg-gradient-to-br from-white via-yellow-50 to-amber-50",
      border: "hover:border-amber-300",
      button: "bg-amber-100 border-amber-200 text-amber-700",
    },
    {
      bg: "bg-gradient-to-br from-white via-emerald-50 to-green-50",
      border: "hover:border-green-300",
      button: "bg-green-100 border-green-200 text-green-700",
    },
  ]

  const selectedStyle = bgStyles[Math.floor(Math.random() * bgStyles.length)]

  return (
    <div
      className={`mb-8 rounded-xl border p-6 shadow-sm transition hover:shadow-md ${selectedStyle.bg} ${selectedStyle.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <img
            src={repo.avatarUrl || repo.user?.avatar || "/default-avatar.png"}
            alt={`${repo.user?.username || repo.owner}'s avatar`}
            className="w-12 h-12 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{repo.fullName}</h2>
            <p className="text-sm text-gray-600">@{repo.user?.username || repo.owner}</p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            repo.isPrivate
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {repo.isPrivate ? "Private" : "Public"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">
        {repo.description || "No description provided."}
      </p>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 items-center">
        <span className={`${selectedStyle.button} py-1 px-2 rounded-lg border-2`}>
          🔗{" "}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </span>

        {repo.homepage && (
          <span>
            🌐{" "}
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Homepage →
            </a>
          </span>
        )}

        {repo.language && <span>💻 {repo.language}</span>}
        <span>⭐ {repo.stars || 0} Stars</span>
        <span>👁 {repo.watchers || 0} Watchers</span>
        <span>🍴 {repo.forks || 0} Forks</span>
        <span>🛠 {issues.length} Issue{issues.length !== 1 && "s"}</span>
        <span>🧭 Updated {formatDistanceToNow(new Date(repo.updatedAt))} ago</span>
      </div>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {repo.topics.map((topic: string) => (
            <span
              key={topic}
              className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      {/* Issues */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues</h3>
        {issues.length === 0 ? (
          <p className="text-sm text-gray-500">No issues found for this repository.</p>
        ) : (
          <ul className="space-y-4">
            {issues.map((issue: any) => (
              <li
                key={issue.id}
                className="p-4 border rounded-lg bg-white/60 hover:bg-white transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-md font-medium text-gray-800">{issue.title}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      issue.state === "open"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {issue.state}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">#{issue.number}</p>
                <p className="text-sm text-gray-700 mb-3">
                  {issue.body ? issue.body.slice(0, 200) : "No description"}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>🕓 {formatDistanceToNow(new Date(issue.createdAt))} ago</span>
                  <a
                    href={`https://github.com/${repo.fullName}/issues/${issue.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Issue →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
