#!/usr/bin/env node
/**
 * scripts/sync-benchmark-data.js
 *
 * Copies benchmark CSVs and calibration_state.json from the application
 * repository into the website's data/ directory before build.
 *
 * Usage:
 *   node scripts/sync-benchmark-data.js [--app-dir PATH]
 *
 * Default app-dir: ../Inference-Engine  (sibling directory)
 *
 * Called automatically by `pnpm prebuild` if you add it to package.json:
 *   "prebuild": "node scripts/sync-benchmark-data.js"
 *
 * Per §16 (Maintenance Notes) of the developer guide.
 */

'use strict'

const fs   = require('fs')
const path = require('path')

// ── Parse CLI arguments ────────────────────────────────────────────────────

const args = process.argv.slice(2)
const appDirFlag = args.indexOf('--app-dir')
const defaultAppDir = path.resolve(__dirname, '..', '..', 'Inference-Engine')
const APP_DIR = appDirFlag !== -1 ? path.resolve(args[appDirFlag + 1]) : defaultAppDir

const WEBSITE_DATA_DIR = path.resolve(__dirname, '..', 'data')

// ── Source → destination mapping ───────────────────────────────────────────

const COPY_MAP = [
  // CSV benchmark results
  {
    src: path.join(APP_DIR, 'deliverables', 'results', 'bloom.csv'),
    dst: path.join(WEBSITE_DATA_DIR, 'bloom.csv'),
  },
  {
    src: path.join(APP_DIR, 'deliverables', 'results', 'reservoir.csv'),
    dst: path.join(WEBSITE_DATA_DIR, 'reservoir.csv'),
  },
  {
    src: path.join(APP_DIR, 'deliverables', 'results', 'calibrator.csv'),
    dst: path.join(WEBSITE_DATA_DIR, 'calibrator.csv'),
  },
  {
    src: path.join(APP_DIR, 'deliverables', 'results', 'action_ranker.csv'),
    dst: path.join(WEBSITE_DATA_DIR, 'action_ranker.csv'),
  },
  {
    src: path.join(APP_DIR, 'deliverables', 'results', 'bfs.csv'),
    dst: path.join(WEBSITE_DATA_DIR, 'bfs.csv'),
  },
  // Calibration state (rendered in the Calibration section)
  {
    src: path.join(APP_DIR, 'training', 'calibration_state.json'),
    dst: path.join(WEBSITE_DATA_DIR, 'calibration_state.json'),
  },
]

// ── Run ────────────────────────────────────────────────────────────────────

console.log(`\n🔄  sync-benchmark-data`)
console.log(`    App repo:  ${APP_DIR}`)
console.log(`    Data dir:  ${WEBSITE_DATA_DIR}\n`)

// Ensure data/ exists
fs.mkdirSync(WEBSITE_DATA_DIR, { recursive: true })

let copied = 0
let skipped = 0

for (const { src, dst } of COPY_MAP) {
  if (!fs.existsSync(src)) {
    console.warn(`    ⚠  Not found (skipping): ${src}`)
    skipped++
    continue
  }

  const srcStat = fs.statSync(src)
  const srcMtime = srcStat.mtimeMs

  if (fs.existsSync(dst)) {
    const dstStat = fs.statSync(dst)
    if (dstStat.mtimeMs >= srcMtime && dstStat.size === srcStat.size) {
      console.log(`    ✓  Up-to-date: ${path.basename(dst)}`)
      skipped++
      continue
    }
  }

  fs.copyFileSync(src, dst)
  console.log(`    ✅  Copied:    ${path.basename(src)}`)
  copied++
}

console.log(`\n    Done — ${copied} file(s) copied, ${skipped} skipped.\n`)

if (skipped === COPY_MAP.length) {
  console.log(
    '    ℹ  No files were copied.\n' +
    '       If this is the first run, make sure APP_DIR points to a cloned\n' +
    `       Inference-Engine repo that has been benchmarked:\n` +
    `         python deliverables/benchmark.py  (in the app repo)\n`
  )
}

