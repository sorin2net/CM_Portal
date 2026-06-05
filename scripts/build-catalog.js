// build-catalog.js
// Scaneaza folderul CM si genereaza catalog.json (categorii -> subcategorii -> videoclipuri).
// Ruleaza cu:  node scripts/build-catalog.js
//
// Pastreaza ID-urile YouTube deja completate intr-un catalog.json existent,
// ca sa nu pierzi munca atunci cand re-generezi dupa ce adaugi/scoti fisiere.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "CM");          // folderul cu videoclipuri
const OUT = path.join(__dirname, "..", "catalog.json");  // fisierul rezultat

// --- sortare "naturala": "Sezonul 2" inainte de "Sezonul 10", "02" inainte de "10" ---
const collator = new Intl.Collator("ro", { numeric: true, sensitivity: "base" });
const natSort = (a, b) => collator.compare(a, b);

// --- incarca youtubeId-urile dintr-un catalog vechi, indexate dupa calea fisierului ---
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

// --- transforma un nume de folder/fisier intr-un "slug" pentru URL ---
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // scoate diacriticele
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "x";
}

// --- scaneaza recursiv un director si construieste un "nod" ---
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
      file: rel,                              // calea locala (pentru proiectul fizic)
      youtubeId: knownIds.get(rel) || null,   // ID-ul YouTube (il completam in Faza 2)
    };
  });

  const subcategories = [];
  for (const d of dirs) {
    const child = scanDir(path.join(absDir, d), relDir ? `${relDir}/${d}` : d);
    // pastram doar subcategoriile care contin pana la urma ceva
    if (child.videos.length || child.subcategories.length) subcategories.push(child);
  }

  return {
    name: path.basename(absDir),
    slug: slugify(path.basename(absDir)),
    videos,
    subcategories,
  };
}

// --- construieste catalogul de la categoriile principale ---
const topEntries = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name)
  .sort(natSort);

const categories = [];
for (const name of topEntries) {
  const node = scanDir(path.join(ROOT, name), name);
  if (node.videos.length || node.subcategories.length) categories.push(node);
}

// --- mici statistici ---
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
