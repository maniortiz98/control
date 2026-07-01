const fs = require("fs");
const path = require("path");

const PROJECT_DIST = "dist/actinver_spine";
const configuredDir = process.env.BUILD_OUTPUT_DIR
  ? path.resolve(process.env.BUILD_OUTPUT_DIR)
  : null;

function resolveOutputDir() {
  if (configuredDir && fs.existsSync(configuredDir)) {
    console.log(`Using BUILD_OUTPUT_DIR: ${configuredDir}`);
    return configuredDir;
  }
  if (fs.existsSync(PROJECT_DIST)) {
    console.log(`Using default output: ${PROJECT_DIST}`);
    return PROJECT_DIST;
  }
  throw new Error(
    `Build output directory not found.\nChecked:\n` +
      `- ${configuredDir || "(no BUILD_OUTPUT_DIR set)"}\n` +
      `- ${PROJECT_DIST}`
  );
}

function readIndexHtml(outputDir) {
  const indexPath = path.join(outputDir, "index.html");
  if (!fs.existsSync(indexPath)) return null;
  try {
    return fs.readFileSync(indexPath, "utf8");
  } catch {
    return null;
  }
}

function findScriptFilesFromIndex(indexHtml) {
  if (!indexHtml) return [];
  const scriptSrcRegex = /<script[^>]+src="'["'][^>]*><\/script>/gi;
  const scripts = [];
  let match;
  while ((match = scriptSrcRegex.exec(indexHtml)) !== null) {
    scripts.push(match[1]);
  }
  return scripts;
}

function normalizeScriptPath(outputDir, src) {
  let rel = src.replace(/^\.\//, "");
  if (/^https?:\/\//i.test(rel)) return null;
  return path.join(outputDir, rel);
}

const outputDir = resolveOutputDir();
console.log(`Output location: ${outputDir}`);

const indexHtml = readIndexHtml(outputDir);
const scriptSrcs = findScriptFilesFromIndex(indexHtml);
const candidateFiles = scriptSrcs
  .map((s) => normalizeScriptPath(outputDir, s))
  .filter((p) => p && fs.existsSync(p));

let mainFilePath = candidateFiles[0] || null;

if (!mainFilePath) {
  const files = fs.readdirSync(outputDir);
  const hashedMain = files.find((f) => /^main\.[a-f0-9]+\.(js|mjs)$/.test(f));
  const plainMain = files.find((f) => /^main\.(js|mjs)$/.test(f));
  if (hashedMain) mainFilePath = path.join(outputDir, hashedMain);
  else if (plainMain) mainFilePath = path.join(outputDir, plainMain);
  else {
    const jsFiles = files.filter((f) => /\.m?js$/.test(f));
    if (jsFiles.length > 0) {
      const withSizes = jsFiles
        .map((f) => ({
          name: f,
          size: fs.statSync(path.join(outputDir, f)).size,
        }))
        .sort((a, b) => b.size - a.size);
      mainFilePath = path.join(outputDir, withSizes[0].name);
    }
  }
}

if (!mainFilePath) {
  console.warn(`No JS bundle found in ${outputDir}. Skipping hash injection.`);
  process.exit(0);
}

const mainFileRel = path.relative(outputDir, mainFilePath).replace(/\\/g, "/");
const stats = fs.statSync(mainFilePath);
const biPath = path.join(outputDir, "assets", "build-info.json");
if (!fs.existsSync(biPath)) {
  throw new Error(`build-info.json not found at ${biPath}`);
}

const biRaw = fs.readFileSync(biPath, "utf8");
const bi = JSON.parse(biRaw);

let bundleHash = "non-hashed-build";
const hashMatch =
  mainFileRel.match(/^main\.([a-f0-9]+)\.(js|mjs)$/) ||
  mainFileRel.match(/\.([a-f0-9]{8,})\.(js|mjs)$/);

if (hashMatch && hashMatch[1]) {
  bundleHash = hashMatch[1];
}

bi.bundleFile = mainFileRel;
bi.bundleHash = bundleHash;
bi.bundleSizeMB = (stats.size / 1024 / 1024).toFixed(2);

fs.writeFileSync(biPath, JSON.stringify(bi, null, 2), "utf8");

console.log(
  `✅ build-info.json updated:\n` +
    `• File: ${bi.bundleFile}\n` +
    `• Hash: ${bi.bundleHash}\n` +
    `• Size: ${bi.bundleSizeMB} MB`
);
