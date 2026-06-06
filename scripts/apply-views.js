const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "data", "views-raw.txt");

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));

if (!fs.existsSync(RAW)) {
  console.log("Nu exista data/views-raw.txt (ruleaza fetch-views). Sar peste vizualizari.");
} else {
  const map = {};
  for (const l of fs.readFileSync(RAW, "utf8").split(/\r?\n/)) {
    const [id, v] = l.split("|");
    if (id && v && v !== "NA" && !isNaN(+v)) map[id] = +v;
  }
  let set = 0;
  (function walk(node) {
    for (const v of node.videos) {
      if (v.youtubeId && map[v.youtubeId] != null) { v.views = map[v.youtubeId]; set++; }
    }
    node.subcategories.forEach(walk);
  })({ videos: [], subcategories: catalog.categories });
  fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");
  console.log(`Vizualizari aplicate la ${set} clipuri (din ${Object.keys(map).length} cunoscute).`);
}
