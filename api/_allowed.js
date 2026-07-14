/**
 * Parse ALLOWED_REPOS env var: comma-separated "owner/repo" list.
 * Example: "Fri3dCamp/badge_firmware_MicroPythonOS,Fri3dCamp/communicator_2026"
 * Returned lowercased for case-insensitive comparison.
 */
export function getAllowedRepos() {
  return (process.env.ALLOWED_REPOS ?? "")
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter((r) => /^[\w.-]+\/[\w.-]+$/.test(r));
}
