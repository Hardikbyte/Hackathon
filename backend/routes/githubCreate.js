import fetch from 'node-fetch';

export async function githubCreateRoute(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(501).json({
      message: 'GITHUB_TOKEN not set. Add a token with repo scope to enable this feature.',
    });
  }
  const { name, description, isPublic } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Repository name required' });
  }
  try {
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim().replace(/[^a-zA-Z0-9._-]/g, '-'),
        description: (description || '').trim() || undefined,
        private: !isPublic,
        auto_init: true,
      }),
    });
    const repo = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      return res.status(createRes.status).json({
        message: repo.message || repo.errors?.[0]?.message || 'Failed to create repository',
      });
    }
    return res.json({ url: repo.html_url, cloneUrl: repo.clone_url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || 'Failed to create GitHub repository' });
  }
}
