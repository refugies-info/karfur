---
name: dependabot-security-fixes
description: Fix GitHub Dependabot security vulnerabilities in npm/pnpm projects. Use when the user asks to "fix Dependabot alerts", "address security vulnerabilities", or "resolve CVEs". Handles dependency chain analysis, pnpm overrides, minimumReleaseAge exceptions, and PR creation.
---

# Fixing Dependabot Security Alerts

A systematic workflow for addressing GitHub Dependabot security vulnerabilities in Node.js projects using pnpm.

## Workflow Overview

1. **Fetch alerts** → Get open Dependabot alerts from GitHub
2. **Trace dependencies** → Find where vulnerable packages come from
3. **Check fixed versions** → Verify npm has patched versions available
4. **Apply overrides** → Update `pnpm.overrides` in package.json
5. **Handle minimumReleaseAge** → Add freshly published security fixes to exclude list
6. **Verify** → Install, audit, lint, typecheck
7. **Create PR** → Conventional commit format

## Step 1: Fetch Dependabot Alerts

Use the GitHub CLI to fetch open security alerts:

```bash
gh api repos/{owner}/{repo}/dependabot/alerts --jq '
  .[] | select(.state == "open") |
  {
    number,
    dependency: .dependency.package.name,
    severity: .security_advisory.severity,
    summary: .security_advisory.summary,
    fixed_in: .security_vulnerability.first_patched_version.identifier
  }
'
```

**Output format:**
```
{"dependency":"handlebars","fixed_in":"4.7.9","number":458,"severity":"medium","summary":"Prototype Pollution Leading to XSS"}
{"dependency":"node-forge","fixed_in":"1.4.0","number":457,"severity":"high","summary":"..."}
```

## Step 2: Trace Dependency Chains

### Quick check with pnpm why

```bash
pnpm why <package>
```

**Limitation:** `pnpm why` only shows direct and some transitive deps. For deep chains, check the lockfile.

### Lockfile analysis (for deep transitive deps)

```bash
# Find where a package is used
grep -E "<package>@" pnpm-lock.yaml | head -10

# Find which package depends on it (awk pattern)
cat pnpm-lock.yaml | awk '
/^  [a-z].*@/ {currentPkg=$0}
/<package>: <version>/ {print "Found in: " currentPkg}
'

# Check nested package.json files
find . -name "package.json" -exec grep -l "<package>" {} \; 2>/dev/null
```

### Check the actual dependency in node_modules

```bash
cat node_modules/<parent-package>/package.json | jq '.dependencies, .peerDependencies'
```

## Step 3: Check Fixed Versions

```bash
# Latest version
npm view <package> version

# Recent versions
npm view <package> versions --json | jq -r '.[-5:][]'

# Check if fixed version exists
npm view <package>@<fixed-version>
```

### Maintenance branches

Some packages release security fixes on multiple branches:

```bash
npm view brace-expansion versions --json | jq -r '.[]' | grep -E "^(1|2|3|4|5)\."
```

Example: `brace-expansion` has maintenance branches:
- `5.0.5` - latest (may be major version jump)
- `2.0.3` - maintenance patch for v2.x (compatible with older minimatch)

**Choose the branch that matches your constraint range** to avoid breaking changes.

## Step 4: Apply pnpm Overrides

Add or update overrides in `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "node-forge": ">=1.4.0",
      "handlebars": ">=4.7.9",
      "brace-expansion": ">=2.0.3"
    }
  }
}
```

### Override syntax

- `">=X.Y.Z"` - minimum version (resolves to highest compatible)
- `"X.Y.Z"` - exact version (pinned)
- `"parent-package>child-package": "X.Y.Z"` - nested override

### Why overrides? (Not resolutions)

- `pnpm.overrides` forces the version resolution
- Works even for deep transitive dependencies
- The package manager handles compatibility checks

## Step 5: Handle minimumReleaseAge

If the project uses `minimumReleaseAge` in `pnpm-workspace.yaml`, freshly published security patches will be blocked:

```bash
ERR_PNPM_NO_MATURE_MATCHING_VERSION  Version 4.7.9 (released 12 hours ago) of handlebars 
does not meet the minimumReleaseAge constraint
```

### Add to minimumReleaseAgeExclude

```yaml
minimumReleaseAgeExclude:
  # ... existing entries ...
  # TODO: Remove after YYYY-MM-DD once <package>@<version> is older than 7 days (security fix)
  - <package>
```

**Calculate the date:** Add 7 days to the publish date.

```bash
# Get publish date
npm view <package> time.<version>
```

## Step 6: Verify the Fix

```bash
# Install with new overrides
pnpm install

# Check lockfile shows fixed versions
grep -E "<package>@" pnpm-lock.yaml

# Audit for remaining vulnerabilities
pnpm audit

# Standard checks
pnpm lint
pnpm check:types
```

### Verify specific packages

```bash
# Check what version resolved
cat package.json | jq '.pnpm.overrides | to_entries | .[] | select(.key | test("<package>"))'

# Check lockfile
grep -E "<package>@" pnpm-lock.yaml | head -5
```

## Step 7: Create PR

### Commit message format

```
fix(workspace): address Dependabot security alerts for <packages>

- Update <package> override from X.Y.Z to A.B.C (fixes CVE-XXXX-XXXXX)
- Add <package> override >=X.Y.Z (fixes <vulnerability type>)
- Add packages to minimumReleaseAgeExclude with TODO dates

Fixes GitHub Dependabot alerts #NNN, #NNN.
```

### PR body template

```markdown
## Summary

- Addresses N open Dependabot security alerts by updating pnpm overrides
- <list of changes>

## Vulnerabilities Fixed

| Package | CVE | Severity | Fixed Version |
|---------|-----|----------|---------------|
| <pkg> | <cve-id> | <severity> | <version> |

## Test plan

- [x] `pnpm install` succeeds with new overrides
- [x] `pnpm lint` passes
- [x] `pnpm check:types` passes
- [ ] Verify Dependabot alerts are resolved after merge

Fixes #NNN, #NNN.
```

## Common Gotchas

### 1. `pnpm why` shows nothing

The package may be a deep transitive dependency. Use lockfile analysis instead:

```bash
grep -E "<package>@" pnpm-lock.yaml
```

### 2. Override doesn't resolve to expected version

Using `>=X.Y.Z` resolves to the **highest** version satisfying the constraint.

**Fix:** Use exact version `"X.Y.Z"` if you need to pin to a specific maintenance branch.

### 3. Major version jump breaks compatibility

Check if the package has maintenance branches:

```bash
npm view <package> versions --json | jq -r '.[]' | sort -V
```

Look for `maintenance-v1`, `maintenance-v2` tags or version patterns.

### 4. Peer dependency errors after override

Run `pnpm install` and check the error output. You may need to:

1. Check if the new version has different peer requirements
2. Update peer dependencies in consuming packages
3. Use `ignoredDependencies` or `peerDependencyRules` in pnpm config

### 5. minimumReleaseAge blocking fresh security patches

Always add freshly published security fixes to `minimumReleaseAgeExclude` with a TODO comment for cleanup.

## Example Session

```bash
# 1. Fetch alerts
gh api repos/owner/repo/dependabot/alerts --jq '...' 

# 2. Trace dependency
pnpm why handlebars  # may show nothing
grep -E "handlebars@" pnpm-lock.yaml  # shows 4.7.8
find . -name "package.json" -exec grep -l "handlebars" {} \;  # ts-jest, @tsoa/cli

# 3. Check fixed version
npm view handlebars version  # 4.7.9

# 4. Add override
# Edit package.json: "handlebars": ">=4.7.9"

# 5. Handle minimumReleaseAge
# Add to pnpm-workspace.yaml: minimumReleaseAgeExclude: - handlebars

# 6. Verify
pnpm install
grep -E "handlebars@" pnpm-lock.yaml  # should show 4.7.9

# 7. Commit and PR
git commit -m "fix(workspace): address Dependabot security alerts..."
gh pr create --base dev
```

## Related Skills

- `bare-repo-worktrees` - For creating worktrees before making changes
- `git-commit` - For conventional commit message generation
- `github-issues-prs` - For PR creation and management
