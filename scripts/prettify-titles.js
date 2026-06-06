const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

function loadMap(file) {
  const p = path.join(ROOT, "data", file);
  const map = {};
  if (!fs.existsSync(p)) return map;
  for (const l of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const i = l.indexOf("|||");
    if (i > 0) map[l.slice(0, i)] = l.slice(i + 3);
  }
  return map;
}
const yt = Object.assign(loadMap("yt-cm.txt"), loadMap("yt-lacafea.txt"));

function prettyRobotzi(ytTitle) {
  const m = ytTitle.match(/ep\.?\s*0*(\d+)/i);
  if (!m) return null;
  const ep = +m[1];
  let name = ytTitle.slice(m.index + m[0].length).replace(/^[.\s_:-]+/, "").replace(/[._]+/g, " ").trim();
  return name ? `Ep. ${ep}: ${name}` : `Episodul ${ep}`;
}

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
let changed = 0;
(function walk(node, dirPath) {
  if (/RObotzi[\/]Sezonul/i.test(dirPath)) {
    for (const v of node.videos) {
      if (v.youtubeId && yt[v.youtubeId]) {
        const nice = prettyRobotzi(yt[v.youtubeId]);
        if (nice) { v.title = nice; changed++; }
      }
    }
  }
  node.subcategories.forEach((s) => walk(s, dirPath + "/" + s.name));
})({ videos: [], subcategories: catalog.categories }, "");

fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");
console.log(`Titluri Robotzi infrumusetate: ${changed}.`);
