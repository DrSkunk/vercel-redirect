/**
 * Parse ALLOWED_REPOS env var: comma-separated "owner/repo" entries.
 * Wildcard repo supported: "Fri3dCamp/*" allows every repo of that owner.
 * Example: "Fri3dCamp/*,SomeOrg/specific-repo"
 * Matching is case-insensitive.
 */
export function getAllowedRepos() {
  return (process.env.ALLOWED_REPOS ?? "")
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter((r) => /^[\w.-]+\/([\w.-]+|\*)$/.test(r));
}

/** Check "owner/repo" against the allow-list (supports "owner/*"). */
export function isRepoAllowed(repo) {
  const target = String(repo).toLowerCase();
  if (!/^[\w.-]+\/[\w.-]+$/.test(target)) return false;
  const owner = target.split("/")[0];
  return getAllowedRepos().some((entry) => entry === target || entry === `${owner}/*`);
}
