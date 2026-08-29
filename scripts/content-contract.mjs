import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, "tests", "fixtures", "content-baseline.json");

/**
 * Content is intentionally stricter than a screenshot comparison. The contract
 * records every human-readable text run and every content-bearing URL in source
 * order, while ignoring tag names, classes, and wrappers that the refactor is
 * allowed to change. This makes a visual redesign possible without silently
 * rewriting, dropping, or reordering the portfolio itself.
 */
function extractContract(html) {
  const withoutNonContent = html
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/<script\b[^>]*>[^]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[^]*?<\/style>/gi, " ");

  const text = withoutNonContent
    .replace(/<[^>]+>/g, "\n")
    .split(/\r?\n/)
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const urls = [];
  const contentElementPattern = /<(?:a|img|source|video|audio|iframe)\b[^>]*>/gi;
  const urlPattern = /\b(?:href|src|poster|data-audio)\s*=\s*(["'])(.*?)\1/gi;
  for (const element of withoutNonContent.matchAll(contentElementPattern)) {
    for (const match of element[0].matchAll(urlPattern)) urls.push(match[2]);
  }

  return { text, urls };
}

async function walkHtml(directory, relative = "") {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if ([".git", "node_modules", "src", ".site-build-tmp"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(absolute, nextRelative));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(nextRelative);
  }

  return files.sort((a, b) => a.localeCompare(b, "en"));
}

export async function collectContracts(root = ROOT) {
  const files = await walkHtml(root);
  const pages = {};

  for (const file of files) {
    const normalized = file.split(path.sep).join("/");
    const html = await readFile(path.join(root, file), "utf8");
    const contract = extractContract(html);
    pages[normalized] = {
      ...contract,
      digest: createHash("sha256").update(JSON.stringify(contract)).digest("hex")
    };
  }

  return { version: 1, pages };
}

export async function readBaseline() {
  return JSON.parse(await readFile(BASELINE_PATH, "utf8"));
}

async function snapshot() {
  const baseline = await collectContracts();
  await mkdir(path.dirname(BASELINE_PATH), { recursive: true });
  await writeFile(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
  console.log(`Captured immutable content for ${Object.keys(baseline.pages).length} pages.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  if (process.argv[2] !== "snapshot") {
    console.error("Usage: node scripts/content-contract.mjs snapshot");
    process.exitCode = 1;
  } else {
    await snapshot();
  }
}
