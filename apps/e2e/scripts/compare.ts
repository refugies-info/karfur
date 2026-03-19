#!/usr/bin/env node
/**
 * Compare Screenshots Script
 *
 * Compares screenshots between prod and local folders.
 * Generates an HTML report with side-by-side comparison.
 *
 * Usage: npx tsx scripts/compare.ts
 */

import * as fs from "fs";
import * as path from "path";

const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");
const REPORT_DIR = path.join(process.cwd(), "comparison-report");

// Compare prod vs local (not staging)
const BASELINE_ENV = "prod";
const TARGET_ENV = "local";

interface ComparisonResult {
  page: string;
  viewport: string;
  baselinePath: string;
  targetPath: string;
  baselineRelative: string;
  targetRelative: string;
  status: "match" | "diff" | "missing";
  message?: string;
}

async function compareScreenshots(): Promise<void> {
  console.log("🔍 Comparing screenshots...\n");

  // Ensure directories exist
  if (!fs.existsSync(path.join(SCREENSHOTS_DIR, BASELINE_ENV))) {
    console.error(
      `❌ No ${BASELINE_ENV} screenshots found. Run \`pnpm capture:${BASELINE_ENV}\` first.`,
    );
    process.exit(1);
  }

  if (!fs.existsSync(path.join(SCREENSHOTS_DIR, TARGET_ENV))) {
    console.error(
      `❌ No ${TARGET_ENV} screenshots found. Run \`pnpm capture:${TARGET_ENV}\` first.`,
    );
    process.exit(1);
  }

  // Create report directory
  await fs.promises.mkdir(REPORT_DIR, { recursive: true });

  const results: ComparisonResult[] = [];

  // Get all viewports
  const viewports = fs.readdirSync(path.join(SCREENSHOTS_DIR, BASELINE_ENV));

  for (const viewport of viewports) {
    const baselineViewportDir = path.join(SCREENSHOTS_DIR, BASELINE_ENV, viewport);
    const targetViewportDir = path.join(SCREENSHOTS_DIR, TARGET_ENV, viewport);

    if (!fs.existsSync(targetViewportDir)) {
      console.log(`⚠️  No ${TARGET_ENV} screenshots for ${viewport}`);
      continue;
    }

    // Get all baseline screenshots
    const screenshots = fs.readdirSync(baselineViewportDir).filter((f) => f.endsWith(".png"));

    for (const screenshot of screenshots) {
      const baselinePath = path.join(baselineViewportDir, screenshot);
      const targetPath = path.join(targetViewportDir, screenshot);

      // Relative paths for HTML (go up from comparison-report/)
      const baselineRelative = path.join("..", "screenshots", BASELINE_ENV, viewport, screenshot);
      const targetRelative = path.join("..", "screenshots", TARGET_ENV, viewport, screenshot);

      const pageName = screenshot.replace(".png", "");

      if (!fs.existsSync(targetPath)) {
        results.push({
          page: pageName,
          viewport,
          baselinePath,
          targetPath,
          baselineRelative,
          targetRelative,
          status: "missing",
          message: `${TARGET_ENV} screenshot not found`,
        });
        continue;
      }

      // Compare file sizes (simple heuristic)
      const baselineStats = fs.statSync(baselinePath);
      const targetStats = fs.statSync(targetPath);

      const sizeDiff = Math.abs(baselineStats.size - targetStats.size);
      const sizeDiffPercent = (sizeDiff / baselineStats.size) * 100;

      if (sizeDiffPercent > 5) {
        // More than 5% size difference
        results.push({
          page: pageName,
          viewport,
          baselinePath,
          targetPath,
          baselineRelative,
          targetRelative,
          status: "diff",
          message: `Size difference: ${sizeDiffPercent.toFixed(1)}%`,
        });
      } else {
        results.push({
          page: pageName,
          viewport,
          baselinePath,
          targetPath,
          baselineRelative,
          targetRelative,
          status: "match",
        });
      }
    }
  }

  // Print results
  console.log("\n📊 Results:\n");

  const matches = results.filter((r) => r.status === "match");
  const diffs = results.filter((r) => r.status === "diff");
  const missing = results.filter((r) => r.status === "missing");

  console.log(`✅ Matching: ${matches.length}`);
  console.log(`⚠️  Different: ${diffs.length}`);
  console.log(`❌ Missing: ${missing.length}`);

  if (diffs.length > 0) {
    console.log("\n⚠️  Differences found:\n");
    for (const diff of diffs) {
      console.log(`  - ${diff.page} (${diff.viewport}): ${diff.message}`);
    }
  }

  if (missing.length > 0) {
    console.log("\n❌ Missing screenshots:\n");
    for (const miss of missing) {
      console.log(`  - ${miss.page} (${miss.viewport}): ${miss.message}`);
    }
  }

  // Generate HTML report
  const htmlReport = generateHtmlReport(results);
  await fs.promises.writeFile(path.join(REPORT_DIR, "index.html"), htmlReport);

  console.log(`\n📄 Report generated: ${REPORT_DIR}/index.html`);

  // Exit with error if differences found
  if (diffs.length > 0 || missing.length > 0) {
    process.exit(1);
  }
}

function generateHtmlReport(results: ComparisonResult[]): string {
  const matches = results.filter((r) => r.status === "match");
  const diffs = results.filter((r) => r.status === "diff");
  const missing = results.filter((r) => r.status === "missing");

  // Group by viewport
  const byViewport: Record<string, ComparisonResult[]> = {};
  for (const r of results) {
    if (!byViewport[r.viewport]) byViewport[r.viewport] = [];
    byViewport[r.viewport].push(r);
  }

  return `<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Comparison Report</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: system-ui, sans-serif; 
      max-width: 1600px; 
      margin: 0 auto; 
      padding: 20px; 
      background: #f5f5f5;
    }
    h1 { color: #333; margin-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary div { padding: 15px 20px; border-radius: 8px; font-weight: 500; }
    .match { background: #d4edda; color: #155724; }
    .diff { background: #fff3cd; color: #856404; }
    .missing { background: #f8d7da; color: #721c24; }
    
    .viewport-section { 
      margin: 30px 0; 
      background: white; 
      border-radius: 12px; 
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .viewport-title { 
      font-size: 1.2em; 
      font-weight: 600; 
      margin-bottom: 20px; 
      padding-bottom: 10px;
      border-bottom: 2px solid #eee;
    }
    
    .comparison-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(700px, 1fr)); 
      gap: 20px; 
    }
    
    .comparison-card { 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      overflow: hidden;
      background: #fafafa;
    }
    .comparison-card.status-match { border-color: #28a745; }
    .comparison-card.status-diff { border-color: #ffc107; }
    .comparison-card.status-missing { border-color: #dc3545; }
    
    .card-header { 
      padding: 12px 15px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      background: white;
      border-bottom: 1px solid #eee;
    }
    .card-title { font-weight: 600; }
    .card-status { 
      font-size: 0.85em; 
      padding: 4px 10px; 
      border-radius: 4px; 
      font-weight: 500;
    }
    .status-match .card-status { background: #d4edda; color: #155724; }
    .status-diff .card-status { background: #fff3cd; color: #856404; }
    .status-missing .card-status { background: #f8d7da; color: #721c24; }
    
    .card-images { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 1px; 
      background: #ddd;
    }
    .image-container { 
      background: white; 
      padding: 10px; 
      text-align: center;
    }
    .image-label { 
      font-size: 0.8em; 
      color: #666; 
      margin-bottom: 8px; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .image-container img { 
      max-width: 100%; 
      height: auto; 
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .missing-image { 
      background: #f8d7da; 
      color: #721c24;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    
    .filter-bar {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }
    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 0.9em;
    }
    .filter-btn.active {
      background: #0066cc;
      color: white;
      border-color: #0066cc;
    }
    .filter-btn:hover { background: #f0f0f0; }
    .filter-btn.active:hover { background: #0055aa; }
  </style>
</head>
<body>
  <h1>📸 Screenshot Comparison Report</h1>
  <p>Comparing <strong>${BASELINE_ENV}</strong> vs <strong>${TARGET_ENV}</strong></p>

  <div class="summary">
    <div class="match">✅ Matching: ${matches.length}</div>
    <div class="diff">⚠️ Different: ${diffs.length}</div>
    <div class="missing">❌ Missing: ${missing.length}</div>
  </div>

  <div class="filter-bar">
    <button class="filter-btn active" data-filter="all">All (${results.length})</button>
    <button class="filter-btn" data-filter="diff">⚠️ Different (${diffs.length})</button>
    <button class="filter-btn" data-filter="missing">❌ Missing (${missing.length})</button>
    <button class="filter-btn" data-filter="match">✅ Matching (${matches.length})</button>
  </div>

  ${Object.entries(byViewport)
    .map(
      ([viewport, viewportResults]) => `
    <div class="viewport-section">
      <div class="viewport-title">📐 ${viewport.toUpperCase()}</div>
      <div class="comparison-grid">
        ${viewportResults
          .map(
            (r) => `
          <div class="comparison-card status-${r.status}" data-status="${r.status}">
            <div class="card-header">
              <span class="card-title">${r.page}</span>
              <span class="card-status">${r.status.toUpperCase()}${r.message ? ` - ${r.message}` : ""}</span>
            </div>
            <div class="card-images">
              <div class="image-container">
                <div class="image-label">${BASELINE_ENV}</div>
                <img src="${r.baselineRelative}" alt="${BASELINE_ENV} ${r.page}" />
              </div>
              <div class="image-container">
                <div class="image-label">${TARGET_ENV}</div>
                ${
                  r.status === "missing"
                    ? `<div class="missing-image">❌ Screenshot not found</div>`
                    : `<img src="${r.targetRelative}" alt="${TARGET_ENV} ${r.page}" />`
                }
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("")}

  <script>
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        document.querySelectorAll('.comparison-card').forEach(card => {
          if (filter === 'all' || card.dataset.status === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  </script>
</body>
</html>`;
}

compareScreenshots().catch(console.error);
