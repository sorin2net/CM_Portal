const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const META = path.join(ROOT, "data", "meta-raw.txt");
const VIEWS = path.join(ROOT, "data", "views-raw.txt");

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const meta = {};

if (fs.existsSync(META)) {
  for (const l of fs.readFileSync(META, "utf8").split(/\r?\n/)) {
    const [id, views, dur, date] = l.split("|");
    if (!id) continue;
    const m = {};
    if (views && views !== "NA" && !isNaN(+views)) m.views = +views;
    if (dur && dur !== "NA" && !isNaN(+dur)) m.duration = Math.round(+dur);
    if (date && /^\d{8}$/.test(date)) m.date = date;
    if (Object.keys(m).length) meta[id] = m;
  }
} else if (fs.existsSync(VIEWS)) {
  for (const l of fs.readFileSync(VIEWS, "utf8").split(/\r?\n/)) {
    const [id, v] = l.split("|");
    if (id && v && v !== "NA" && !isNaN(+v)) meta[id] = { views: +v };
  }
} else {
  console.log("Nu exista date de metadate (ruleaza fetch-views/meta). Sar peste.");
}

let set = 0;
(function walk(node) {
  for (const v of node.videos) {
    const m = v.youtubeId && meta[v.youtubeId];
    if (m) { if (m.views != null) v.views = m.views; if (m.duration != null) v.duration = m.duration; if (m.date) v.date = m.date; set++; }
  }
  node.subcategories.forEach(walk);
})({ videos: [], subcategories: catalog.categories });

fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");
console.log(`Metadate aplicate la ${set} clipuri (din ${Object.keys(meta).length} cunoscute).`);
