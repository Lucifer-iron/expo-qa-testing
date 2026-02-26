#!/usr/bin/env node
/**
 * enforce-testids.js
 * Scans app/**\/*.tsx for interactive elements missing testID props.
 * Exits with code 0 if clean, code 1 if violations found.
 *
 * Usage:
 *   node scripts/enforce-testids.js --app-dir app/
 *   node scripts/enforce-testids.js --app-dir app/ --strict
 */

const fs = require('fs');
const path = require('path');

// ─── Config ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const appDirArg = args.indexOf('--app-dir');
const APP_DIR = appDirArg !== -1 ? args[appDirArg + 1] : 'app';
const STRICT = args.includes('--strict'); // strict: also flag optional wrappers

// Elements that MUST have a testID
const INTERACTIVE_PATTERNS = [
    /\bTouchableOpacity\b/,
    /\bTouchableHighlight\b/,
    /\bTouchableNativeFeedback\b/,
    /\bPressable\b/,
    /\bButton\b/,
    /\bTextInput\b/,
    /\bSwitch\b/,
    /\bCheckBox\b/,
    /\bRadioButton\b/,
];

// Allowed patterns — skip these (they have testID via variable or spread)
const SKIP_PATTERNS = [
    /testID=/,      // already has testID
    /\.\.\.props/,  // spread props (assume testID passed in)
    /disabled={true}/, // fully disabled elements
    /{\.\.\.rest}/,
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function walkDir(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // skip node_modules, .expo, .git
            if (!['node_modules', '.expo', '.git', '__tests__'].includes(entry.name)) {
                results = results.concat(walkDir(fullPath));
            }
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
            results.push(fullPath);
        }
    }
    return results;
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const violations = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Collect a small window of context (current + next 4 lines)
        const window = lines.slice(i, i + 5).join(' ');

        const isInteractive = INTERACTIVE_PATTERNS.some(p => p.test(line));
        if (!isInteractive) continue;

        // Check if this element is an opening tag (has < prefix)
        if (!line.trim().includes('<')) continue;

        // Skip false positives
        const shouldSkip = SKIP_PATTERNS.some(p => p.test(window));
        if (shouldSkip) continue;

        violations.push({
            file: filePath,
            line: i + 1,
            content: line.trim(),
        });
    }

    return violations;
}

// ─── Main ──────────────────────────────────────────────────────────────────

const resolvedDir = path.resolve(APP_DIR);
if (!fs.existsSync(resolvedDir)) {
    console.error(`❌ App directory not found: ${resolvedDir}`);
    process.exit(1);
}

console.log(`🔍 Scanning ${resolvedDir} for testID violations...\n`);

const files = walkDir(resolvedDir);
let allViolations = [];

for (const file of files) {
    const violations = checkFile(file);
    allViolations = allViolations.concat(violations);
}

if (allViolations.length === 0) {
    console.log(`✅ All interactive elements have testIDs. ${files.length} files scanned.`);
    process.exit(0);
} else {
    for (const v of allViolations) {
        const relativePath = path.relative(process.cwd(), v.file);
        console.error(`❌ VIOLATION: ${relativePath}:${v.line}`);
        console.error(`   → ${v.content}`);
        console.error(`   → Add testID following convention: "<screen>.<component>-<type>"`);
        console.error('');
    }
    console.error(`\n⛔ Found ${allViolations.length} testID violation(s) across ${files.length} files.`);
    console.error(`   See references/testid-convention.md for naming standards.\n`);
    process.exit(1);
}
