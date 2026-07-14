# Vercel Redirecter

Generic redirect shim. Connect this repo to any number of Vercel projects; each project redirects all traffic to its own target URL (e.g. a GitHub Pages site), preserving path and query string. Made to migrate from personal Vercel to static GitHub Pages.

Example: `https://fri3d-flasher.vercel.app/foo?x=1` → `https://fri3dcamp.github.io/fri3d-web-flasher/foo?x=1`

## Configure

In your Vercel UI: Project → Settings → Environment Variables:

| Variable | Required | Example | Notes |
|---|---|---|---|
| `REDIRECT_TARGET` | yes | `https://fri3dcamp.github.io/fri3d-web-flasher` | Base URL, no trailing slash needed |
| `REDIRECT_PERMANENT` | no | `false` | `false` = 307 (temporary), default 308 (permanent, cached by browsers) |
| `ALLOWED_REPOS` | for proxy | `Fri3dCamp/*` | Comma-separated `owner/repo` allow-list for CORS proxy. `owner/*` allows all repos of that owner |
| `GITHUB_TOKEN` | no | `ghp_...` | Raises GitHub API rate limit for `/api/releases` |

Redeploy after changing env vars.

## Deploy

Connect repo to Vercel (Framework Preset: Other, no build step), or:

```sh
npx vercel --prod
```

## CORS proxy

GitHub's API and release downloads lack CORS headers, so static sites (GitHub Pages) can't fetch them from the browser. Two serverless endpoints, exempt from the redirect:

- `GET /api/releases?repo=owner/repo` — releases listing from GitHub API, cached 5 min.
- `GET /api/github-download?url=<browser_download_url>` — streams a release asset with `Access-Control-Allow-Origin: *`, cached 1 h.

Both validate against `ALLOWED_REPOS` (open-relay/SSRF protection); anything else gets 403.
