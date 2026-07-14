import { Buffer } from "node:buffer";
import { isRepoAllowed } from "./_allowed.js";

/**
 * CORS proxy for GitHub releases listing.
 * GET /api/releases?repo=<owner/repo>
 * Only repos listed in the ALLOWED_REPOS env var (comma-separated
 * "owner/repo" values) are permitted, to avoid abuse as an open relay.
 */
export default async function handler(req, res) {
  try {
    const requestUrl = new URL(req.url ?? "", "http://localhost");
    const repo = requestUrl.searchParams.get("repo");

    if (!repo || !isRepoAllowed(repo)) {
      res.statusCode = 403;
      res.end("Repo not allowed");
      return;
    }

    const upstream = await fetch(`https://api.github.com/repos/${repo}/releases`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "vercel-redirect-proxy",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });

    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.end(`Upstream error ${upstream.status}`);
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.end(buffer);
  } catch (error) {
    console.error("releases proxy error", error);
    res.statusCode = 500;
    res.end("Proxy error");
  }
}
