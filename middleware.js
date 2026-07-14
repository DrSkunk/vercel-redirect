export const config = { matcher: "/:path*" };

export default function middleware(req) {
  const target = process.env.REDIRECT_TARGET;
  if (!target) {
    return new Response("REDIRECT_TARGET env var not set", { status: 500 });
  }
  const url = new URL(req.url);
  const location = target.replace(/\/$/, "") + url.pathname + url.search;
  const status = process.env.REDIRECT_PERMANENT === "false" ? 307 : 308;
  return Response.redirect(location, status);
}
