# Vercel Redirecter

Generic redirect shim. Connect this repo to any number of Vercel projects; each project redirects all traffic to its own target URL (e.g. a GitHub Pages site), preserving path and query string. Made to migrate from personal Vercel to static GitHub Pages.

Example: `https://fri3d-flasher.vercel.app/foo?x=1` → `https://fri3dcamp.github.io/fri3d-web-flasher/foo?x=1`

## Configure

In your Vercel UI: Project → Settings → Environment Variables:

| Variable | Required | Example | Notes |
|---|---|---|---|
| `REDIRECT_TARGET` | yes | `https://fri3dcamp.github.io/fri3d-web-flasher` | Base URL, no trailing slash needed |
| `REDIRECT_PERMANENT` | no | `false` | `false` = 307 (temporary), default 308 (permanent, cached by browsers) |

Redeploy after changing env vars.

## Deploy

Connect repo to Vercel (Framework Preset: Other, no build step), or:

```sh
npx vercel --prod
```
