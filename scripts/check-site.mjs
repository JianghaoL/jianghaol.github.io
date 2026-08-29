import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { collectContracts, readBaseline } from "./content-contract.mjs";

const ROOT = process.cwd();
const EXCLUDED = new Set([".git", "node_modules", "src", ".site-build-tmp"]);
const KNOWN_MISSING_PATH = path.join(ROOT, "tests", "fixtures", "known-missing-references.json");

async function walkHtml(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (EXCLUDED.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(absolute, nextRelative));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(nextRelative);
  }
  return files;
}

function localTarget(page, reference) {
  const clean = reference.split("#")[0].split("?")[0];
  if (!clean || clean.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  return clean.startsWith("/")
    ? path.join(ROOT, decodeURIComponent(clean.slice(1)))
    : path.resolve(path.dirname(path.join(ROOT, page)), decodeURIComponent(clean));
}

async function check() {
  const baseline = await readBaseline();
  const current = await collectContracts();
  const errors = [];
  const knownMissing = new Set(JSON.parse(await readFile(KNOWN_MISSING_PATH, "utf8")));

  for (const [file, expected] of Object.entries(baseline.pages)) {
    if (!current.pages[file]) errors.push(`${file}: route is missing`);
    else if (current.pages[file].digest !== expected.digest) errors.push(`${file}: immutable content changed`);
  }

  const htmlFiles = await walkHtml(ROOT);
  for (const file of htmlFiles) {
    const html = await readFile(path.join(ROOT, file), "utf8");
    const cspCount = (html.match(/http-equiv=["']Content-Security-Policy["']/gi) || []).length;
    if (cspCount !== 1) errors.push(`${file}: expected exactly one Content Security Policy`);
    if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) errors.push(`${file}: inline script is not allowed`);
    if (/\sstyle=["']/i.test(html)) errors.push(`${file}: inline style attribute is not allowed`);
    if (/<link\s+rel=["']stylesheet["']/i.test(html) && !html.includes('/css/apple-refactor.css')) {
      errors.push(`${file}: presentation page is missing the Apple design layer`);
    }

    const ids = [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) errors.push(`${file}: duplicate ids ${[...new Set(duplicates)].join(", ")}`);

    for (const match of html.matchAll(/\b(?:href|src|poster|data-audio)\s*=\s*(["'])(.*?)\1/gi)) {
      const target = localTarget(file, match[2]);
      if (!target) continue;
      try { await access(target); }
      catch {
        const issue = `${file.split(path.sep).join("/")}::${match[2]}`;
        if (!knownMissing.has(issue)) errors.push(`${file}: missing local reference ${match[2]}`);
      }
    }

    for (const match of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
      if (!/\brel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/i.test(match[0])) {
        errors.push(`${file}: target=_blank link is missing noopener noreferrer`);
      }
    }
  }

  const cname = (await readFile(path.join(ROOT, "CNAME"), "utf8")).trim();
  if (cname !== "www.lijianghao.com") errors.push(`CNAME: expected www.lijianghao.com, received ${cname}`);

  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${htmlFiles.length} routes, immutable content, links, ids, and external-link isolation (${knownMissing.size} frozen legacy references unchanged).`);
  }
}

await check();
