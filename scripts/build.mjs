import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { collectContracts, readBaseline } from "./content-contract.mjs";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "src", "site");
const PARTIALS = path.join(ROOT, "src", "partials");
const TEMP = path.join(ROOT, ".site-build-tmp");
const INCLUDE_PATTERN = /\{\{>\s*([a-z0-9/_-]+)\s*\}\}/gi;

async function walk(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, nextRelative));
    else if (entry.isFile()) files.push(nextRelative);
  }
  return files;
}

/**
 * Includes are deliberately small and deterministic: a token maps to exactly
 * one UTF-8 file and includes may not escape src/partials. Recursive expansion
 * is supported for composition, with a hard depth limit to turn accidental
 * include cycles into a clear build failure instead of incomplete HTML.
 */
async function expandIncludes(source, stack = []) {
  const matches = [...source.matchAll(INCLUDE_PATTERN)];
  let output = source;

  for (const match of matches) {
    const name = match[1];
    if (stack.includes(name) || stack.length >= 12) {
      throw new Error(`Circular or excessively deep include: ${[...stack, name].join(" -> ")}`);
    }

    const partialPath = path.resolve(PARTIALS, `${name}.html`);
    if (!partialPath.startsWith(`${path.resolve(PARTIALS)}${path.sep}`)) {
      throw new Error(`Unsafe partial path: ${name}`);
    }

    const partial = await readFile(partialPath, "utf8");
    output = output.replace(match[0], await expandIncludes(partial, [...stack, name]));
  }

  return output;
}

async function assertContentContract() {
  const baseline = await readBaseline();
  const generated = await collectContracts(TEMP);
  const baselinePaths = Object.keys(baseline.pages);
  const generatedPaths = Object.keys(generated.pages);

  if (JSON.stringify(baselinePaths) !== JSON.stringify(generatedPaths)) {
    throw new Error("Generated route list differs from the immutable baseline.");
  }

  const changed = baselinePaths.filter((file) => baseline.pages[file].digest !== generated.pages[file].digest);
  if (changed.length) {
    throw new Error(`Content contract changed in:\n${changed.map((file) => `  - ${file}`).join("\n")}`);
  }
}

async function syncGeneratedFiles(files) {
  for (const relative of files) {
    const from = path.join(TEMP, relative);
    const to = path.join(ROOT, relative);
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { force: true });
  }
}

async function build() {
  await stat(SOURCE);
  await rm(TEMP, { recursive: true, force: true });
  await mkdir(TEMP, { recursive: true });

  const files = await walk(SOURCE);
  for (const relative of files) {
    const sourcePath = path.join(SOURCE, relative);
    const destinationPath = path.join(TEMP, relative);
    await mkdir(path.dirname(destinationPath), { recursive: true });

    if (relative.endsWith(".html")) {
      const html = await readFile(sourcePath, "utf8");
      const expanded = await expandIncludes(html);
      if (INCLUDE_PATTERN.test(expanded)) throw new Error(`Unresolved include in ${relative}`);
      await writeFile(destinationPath, expanded, "utf8");
    } else {
      await cp(sourcePath, destinationPath, { force: true });
    }
  }

  await assertContentContract();
  await syncGeneratedFiles(files);
  await rm(TEMP, { recursive: true, force: true });
  console.log(`Built and content-verified ${files.length} source files.`);
}

await build();
