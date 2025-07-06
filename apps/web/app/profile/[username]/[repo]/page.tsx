'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RepoPage() {
  const { repo } = useParams() as { repo: string };

  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [repoFiles, setRepoFiles] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('github_username');
      if (!username) {
        setError('GitHub username not found in localStorage');
        return;
      }

      setLoading(true);
      try {
        const repoRes = await axios.get(`https://api.github.com/repos/${username}/${repo}`);
        setRepoInfo(repoRes.data);

        const filesRes = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/contents`,
        );
        setRepoFiles(filesRes.data);

        const issuesRes = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/issues?state=open`,
        );
        const onlyIssues = issuesRes.data.filter((item: any) => !item.pull_request);
        setIssues(onlyIssues);
      } catch (err) {
        setError('Failed to fetch repo data');
      } finally {
        setLoading(false);
      }
    };

    if (repo) fetchData();
  }, [repo]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {repoInfo && (
        <div className="mb-6">
          <div>
            {' '}
            <button onClick={() => router.back()}>{'< back'}</button>{' '}
            <h1 className="text-2xl font-semibold">{repoInfo.full_name}</h1>
          </div>
          <p className="text-sm text-gray-600">{repoInfo.description}</p>
          <div className="text-xs text-gray-500 mt-2 flex gap-3">
            ⭐stars - {repoInfo.stargazers_count} • 🍴Forks - {repoInfo.forks_count} • 🧑‍💻{' '}
            {repoInfo.language}
          </div>
        </div>
      )}

      <div className="mb-5">
        <h2 className="text-lg font-medium mb-2">📁 Files</h2>
        <ul className="text-sm text-blue-600 space-y-1">
          {repoFiles.map((file) => (
            <li key={file.sha}>
              <a
                href={file.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {file.name} ({file.type})
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">🐛 Open Issues</h2>
        {issues.length === 0 && <p className="text-sm text-gray-500">No open issues found.</p>}

        <ul className="space-y-3">
          {issues.map((issue) => (
            <li
              key={issue.id}
              className="border border-gray-200 p-3 rounded-md flex justify-between items-start"
            >
              \
              <div className="flex-1">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  #{issue.number} - {issue.title}
                </a>

                <div className="text-xs text-gray-500 mt-1">
                  By {issue.user.login} • {new Date(issue.created_at).toLocaleDateString()}
                </div>

                {issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {issue.labels.map((label: any) => (
                      <span
                        key={label.id}
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: `#${label.color}` }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}

                {issue.body && (
                  <p className="text-xs text-gray-600 mt-2">
                    {issue.body.slice(0, 150)}
                    {issue.body.length > 150 && '...'}
                  </p>
                )}
              </div>
              <div className="ml-4 text-xs text-gray-500 shrink-0 whitespace-nowrap">
                💬 {issue.comments} comment{issue.comments !== 1 && 's'}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
