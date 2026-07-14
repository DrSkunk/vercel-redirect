import { Buffer } from "node:buffer";
import { getAllowedRepos } from "./_allowed.js";

/**
 * CORS proxy for GitHub release asset downloads.
 * GET /api/github-download?url=<https://github.com/owner/repo/releases/download/...>
 * GitHub's download URLs redirect to githubusercontent.com without
 * Access-Control-Allow-Origin, so browsers need this proxy.
 * Only assets from repos in the ALLOWED_REPOS env var are permitted (SSRF protection).
 */
export default async function handler(req, res) {
  try {
    const requestUrl = new URL(req.url ?? "", "http://localhost");
    const target = requestUrl.searchParams.get("url");

    if (!target) {
      res.statusCode = 400;
      res.end("Missing 'url' query parameter");
      return;
    }

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      res.statusCode = 400;
      res.end("Invalid url");
      return;
    }

    const allowedPrefixes = getAllowedRepos().map((repo) => `/${repo}/releases/download/`);
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "github.com" ||
      !allowedPrefixes.some((prefix) => parsed.pathname.toLowerCase().startsWith(prefix))
    ) {
      res.statusCode = 403;
      res.end("URL not allowed");
      return;
    }

    const upstream = await fetch(parsed.toString(), { redirect: "follow" });
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.end(`Upstream error ${upstream.status}`);
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.statusCode = 200;
    res.setHeader("Content-Type", upstream.headers.get("content-type") ?? "application/octet-stream");
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(buffer);
  } catch (error) {
    console.error("github-download proxy error", error);
    res.statusCode = 500;
    res.end("Proxy error");
  }
}
