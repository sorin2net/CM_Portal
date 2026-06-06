const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const SUBS = [
  ["Știrile CM", "stiri"],
  ["Gaming cu Codin", "gaming"],
  ["Reacții (politică)", "react-politica"],
  ["Codin & AI", "codin-ai"],
  ["ZOOT SUIT", "zootsuit"],
  ["Rendam", "rendam"],
  ["DePeStream", "dps"],
  ["CM Random", "random"],
  ["Codin reacționează", "react"],
];

const REMAP = { "HfwJfQTsCxs": "XRYEdLPjiTE" };

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
const cleanTitle = (t) => t.replace(/\s*\|\s*CreativeMonkeyzClips.*$/i, "").replace(/\s*\|\s*Codin reac.*$/i, "").trim() || t;
function load(file) {
  const p = path.join(ROOT, "data", "clips", file + ".txt");
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean)
    .filter((l) => !/\[private video\]|\[deleted video\]/i.test(l))
    .map((l) => { const i = l.indexOf("|||"); return { id: l.slice(0, i), title: l.slice(i + 3) }; });
}

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const existing = new Set();
(function w(n) { n.videos.forEach((v) => v.youtubeId && existing.add(v.youtubeId)); n.subcategories.forEach(w); })({ videos: [], subcategories: catalog.categories });

const seen = new Set();
const cat = { name: "CM Clips", slug: "cm-clips", source: "youtube", videos: [], subcategories: [] };
let total = 0;
for (const [name, file] of SUBS) {
  const vids = [];
  for (const e of load(file)) {
    const id = REMAP[e.id] || e.id;
    if (!id || existing.has(id) || seen.has(id)) continue;
    seen.add(id);
    vids.push({ title: cleanTitle(e.title), file: null, youtubeId: id });
  }
  if (vids.length) { cat.subcategories.push({ name, slug: slug(name), source: "youtube", subcategories: [], videos: vids }); total += vids.length; }
}
if (cat.subcategories.length) catalog.categories.push(cat);

let withId = 0, tot = 0;
(function cnt(n) { n.videos.forEach((v) => { tot++; if (v.youtubeId) withId++; }); n.subcategories.forEach(cnt); })({ videos: [], subcategories: catalog.categories });
catalog.stats.videos = tot; catalog.stats.withYoutubeId = withId; catalog.stats.categories = catalog.categories.length;
fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");

console.log(`CM Clips: ${cat.subcategories.length} subcategorii, ${total} clipuri noi.`);
cat.subcategories.forEach((s) => console.log(`  ${s.name}: ${s.videos.length}`));
console.log(`Total catalog: ${tot} clipuri.`);
