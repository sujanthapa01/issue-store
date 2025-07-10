interface paramtype {
  owner: string;
  repo: string;
  github_token: string;
}

export const syncRepo = async ({ owner, repo, github_token }: paramtype) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${github_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'web',
      active: true,
      events: ['push', 'issues', 'star', 'fork', 'watch', 'repository', 'pull_request'],
      config: {
        url: 'https://yourdomain.com/api/github/webhook',
        content_type: 'json',
        secret: process.env.GITHUB_WEBHOOK_SECRET,
      },
    }),
  });

  return response;
};
