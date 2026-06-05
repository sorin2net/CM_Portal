const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "CM");
const OUT = path.join(__dirname, "..", "catalog.json");

const collator = new Intl.Collator("ro", { numeric: true, sensitivity: "base" });
const natSort = (a, b) => collator.compare(a, b);

function loadExistingIds(node, map) {
  if (!node) return map;
  for (const v of node.videos || []) {
    if (v.file && v.youtubeId) map.set(v.file, v.youtubeId);
  }
  for (const c of node.subcategories || []) loadExistingIds(c, map);
  return map;
}
let knownIds = new Map();
if (fs.existsSync(OUT)) {
  try {
    const old = JSON.parse(fs.readFileSync(OUT, "utf8"));
    for (const cat of old.categories || []) loadExistingIds(cat, knownIds);
    console.log(`Am pastrat ${knownIds.size} ID-uri YouTube din catalogul existent.`);
  } catch (e) {
    console.warn("Nu am putut citi catalogul vechi (il regenerez de la zero).");
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "x";
}

function scanDir(absDir, relDir) {
  const entries = fs.readdirSync(absDir, { withFileTypes: true });

  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort(natSort);
  const files = entries
    .filter(e => e.isFile() && e.name.toLowerCase().endsWith(".mp4"))
    .map(e => e.name)
    .sort(natSort);

  const videos = files.map(name => {
    const rel = relDir ? `${relDir}/${name}` : name;
    return {
      title: name.replace(/\.mp4$/i, ""),
      file: rel,
      youtubeId: knownIds.get(rel) || null,
    };
  });

  const subcategories = [];
  for (const d of dirs) {
    const child = scanDir(path.join(absDir, d), relDir ? `${relDir}/${d}` : d);

    if (child.videos.length || child.subcategories.length) subcategories.push(child);
  }

  return {
    name: path.basename(absDir),
    slug: slugify(path.basename(absDir)),
    videos,
    subcategories,
  };
}

const topEntries = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name)
  .sort(natSort);

const categories = [];
for (const name of topEntries) {
  const node = scanDir(path.join(ROOT, name), name);
  if (node.videos.length || node.subcategories.length) categories.push(node);
}

let totalVideos = 0, withId = 0;
function count(node) {
  totalVideos += node.videos.length;
  withId += node.videos.filter(v => v.youtubeId).length;
  node.subcategories.forEach(count);
}
categories.forEach(count);

const catalog = {
  name: "Creative Monkeyz Portal",
  generatedAt: new Date().toISOString(),
  stats: { categories: categories.length, videos: totalVideos, withYoutubeId: withId },
  categories,
};

fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2), "utf8");
console.log(`\nGata! Scris: ${OUT}`);
console.log(`Categorii principale: ${categories.length}`);
console.log(`Total videoclipuri: ${totalVideos}`);
console.log(`Cu ID YouTube completat: ${withId} / ${totalVideos}`);
