# @refugies-info/e2e

Visual regression testing for Réfugiés.info using Playwright.

## Quick Start

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
npx playwright install
```

## Commands

### Capture Screenshots

```bash
# Capture production (baseline)
pnpm e2e:capture:prod

# Capture staging
pnpm e2e:capture:staging
```

### Compare & Report

```bash
# Compare staging vs prod
pnpm e2e:compare

# Open HTML report
pnpm e2e:report
```

### Update Baseline

```bash
# If changes are expected, update baseline screenshots
pnpm e2e:update-baseline
```

## What's Tested

### Static Pages (12 pages)
- Home, Recherche, Mentions légales, Politique de confidentialité, etc.

### Dynamic Pages (10 pages)
- 5 Dispositifs (from API)
- 5 Démarches (from API)

### Viewports (3 per page)
- Desktop: 1920×1080
- Tablet: 768×1024
- Mobile: 375×812

## Screenshots Directory

```
screenshots/
├── baseline/     # Reference screenshots (committed to git)
│   ├── prod/
│   └── staging/
└── actual/       # Current test screenshots (not committed)
```

## Report

After running tests, open `test-results/report/index.html` to see:
- Side-by-side comparison of baseline vs actual
- Diff overlay highlighting changed pixels
- Pass/fail status for each test
