import { useState } from 'react';
import { downloadProjectZip, createGitHubRepo } from '../api';

export function DownloadAndGitHub() {
  const [downloading, setDownloading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [githubSuccess, setGithubSuccess] = useState<{ url: string } | null>(null);
  const [repoName, setRepoName] = useState('voice-automation-accessibility');
  const [repoDesc, setRepoDesc] = useState('Voice-Activated Browser Automation for Accessibility');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadProjectZip();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'voice-automation-project.zip';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCreateRepo = async () => {
    setGithubError('');
    setGithubSuccess(null);
    setGithubLoading(true);
    try {
      const result = await createGitHubRepo({
        name: repoName,
        description: repoDesc,
        isPublic: true,
      });
      setGithubSuccess({ url: result.url });
    } catch (e) {
      setGithubError(e instanceof Error ? e.message : 'Failed to create repo');
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <section
      className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
      aria-labelledby="download-heading"
    >
      <h2 id="download-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
        Project
      </h2>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="min-h-[48px] px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold text-accessibility-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {downloading ? 'Preparing…' : 'Download full project (ZIP)'}
        </button>
        <div className="border-t border-slate-600 pt-4">
          <h3 className="text-lg font-medium text-textPrimary mb-2">Create public GitHub repo</h3>
          <label className="block text-textMuted text-sm mb-1" htmlFor="repo-name">
            Repository name
          </label>
          <input
            id="repo-name"
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            className="w-full min-h-[48px] px-4 rounded-lg bg-surface border border-slate-600 text-textPrimary text-accessibility-lg mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-describedby="repo-name-desc"
          />
          <span id="repo-name-desc" className="sr-only">
            Choose a name for the new GitHub repository
          </span>
          <label className="block text-textMuted text-sm mb-1" htmlFor="repo-desc">
            Description
          </label>
          <input
            id="repo-desc"
            type="text"
            value={repoDesc}
            onChange={(e) => setRepoDesc(e.target.value)}
            className="w-full min-h-[48px] px-4 rounded-lg bg-surface border border-slate-600 text-textPrimary text-accessibility-lg mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <button
            type="button"
            onClick={handleCreateRepo}
            disabled={githubLoading}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-semibold text-accessibility-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {githubLoading ? 'Creating…' : 'Create and push to GitHub'}
          </button>
          {githubError && (
            <p className="mt-2 text-error text-accessibility-lg" role="alert">
              {githubError}
            </p>
          )}
          {githubSuccess && (
            <p className="mt-2 text-success text-accessibility-lg">
              Repo created: <a href={githubSuccess.url} className="underline" target="_blank" rel="noopener noreferrer">{githubSuccess.url}</a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
