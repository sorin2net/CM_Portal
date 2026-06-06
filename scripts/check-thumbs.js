const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "catalog.json");
const THRESH = 2500;
const CONC = 24;

const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
const vids = [];
(function w(n) { n.videos.forEach((v) => { if (v.youtubeId) vids.push(v); }); n.subcategories.forEach(w); })({ videos: [], subcategories: catalog.categories });

let bad = 0;
async function check(v) {
  try {
    const r = await fetch("https://img.youtube.com/vi/" + v.youtubeId + "/mqdefault.jpg");
    const len = +(r.headers.get("content-length") || 0);
    if (r.status !== 200 || (len && len < THRESH)) { v.noThumb = true; bad++; }
    else if (v.noThumb) delete v.noThumb;
  } catch (e) { }
}

(async () => {
  for (let i = 0; i < vids.length; i += CONC) {
    await Promise.all(vids.slice(i, i + CONC).map(check));
    process.stdout.write(`\r  verificate ${Math.min(i + CONC, vids.length)}/${vids.length}`);
  }
  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2), "utf8");
  console.log(`\nThumbnail-uri verificate: ${vids.length}. Cu poza goala (placeholder): ${bad}.`);
})();
