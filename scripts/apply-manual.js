// apply-manual.js
// Aplica ID-urile YouTube completate manual in data/manual-ids.json peste catalog.json.
// Acestea au PRIORITATE si se aplica ultimele (dupa potrivirile automate).
// Ruleaza:  node scripts/apply-manual.js   (sau, mai simplu, node scripts/build-all.js)

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const manual = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "manual-ids.json"), "utf8"));

let applied = 0, missing = [];
const byFile = {};
for (const [file, id] of Object.entries(manual)) {
  if (file.startsWith("_")) continue;                  // sare peste _README
  byFile[file] = id;
}

const seen = new Set();
(function walk(node) {
  for (const v of node.videos) {
    if (byFile[v.file]) { v.youtubeId = byFile[v.file]; applied++; seen.add(v.file); }
  }
  node.subcategories.forEach(walk);
})({ videos: [], subcategories: catalog.categories });

// avertizeaza daca o cale din manual-ids.json nu exista in catalog (typo?)
for (const file of Object.keys(byFile)) if (!seen.has(file)) missing.push(file);

// recalculeaza statistica
let withId = 0, total = 0;
(function cnt(n){ n.videos.forEach(v=>{total++; if(v.youtubeId) withId++;}); n.subcategories.forEach(cnt); })({videos:[],subcategories:catalog.categories});
catalog.stats.withYoutubeId = withId;
fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");

console.log(`Manual: aplicate ${applied} ID-uri.`);
if (missing.length) { console.log("ATENTIE - cai inexistente in catalog (verifica scrierea):"); missing.forEach(f => console.log("   " + f)); }
console.log(`Total cu ID YouTube: ${withId}/${total}`);
