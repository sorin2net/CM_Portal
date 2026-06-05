const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "catalog.json");
const THRESH = 0.6;

function norm(s) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[：]/g, ":")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
const tokensOf = (s) => new Set(norm(s).split(" ").filter(Boolean));

function dice(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return (2 * inter) / (a.size + b.size);
}

function robotziEp(title) {
  const t = title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (!/robotzi/.test(t)) return null;
  const s = t.match(/\bs0*(\d+)/);
  const e = t.match(/ep\.?\s*0*(\d+)/);
  if (!s || !e) return null;
  const dec = /ep\.?\s*0*\d+\.\d/.test(t);
  return { s: +s[1], e: +e[1], dec };
}

function localRobotziEp(title) {
  const m = title.toLowerCase().match(/s0*(\d+)e0*(\d+)/);
  return m ? { s: +m[1], e: +m[2] } : null;
}

function loadPool(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map((line) => {
    const i = line.indexOf("|||");
    const id = line.slice(0, i);
    const title = line.slice(i + 3);
    return { id, title, tokens: tokensOf(title), rob: robotziEp(title) };
  });
}
const pool = [
  ...loadPool(path.join(ROOT, "data", "yt-cm.txt")),
  ...loadPool(path.join(ROOT, "data", "yt-lacafea.txt")),
];
console.log(`Pool YouTube: ${pool.length} clipuri.`);

function matchVideo(video, dirPath) {
  const isRobotziSeason = /RObotzi[\/\\]Sezonul/i.test(dirPath);
  const lrob = isRobotziSeason ? localRobotziEp(video.title) : null;

  if (lrob) {
    const cand = pool.filter((p) => p.rob && p.rob.s === lrob.s && p.rob.e === lrob.e);
    if (cand.length) {

      const lt = tokensOf(video.title);
      cand.sort((a, b) => (a.rob.dec - b.rob.dec) || (dice(b.tokens, lt) - dice(a.tokens, lt)));
      return { id: cand[0].id, title: cand[0].title, score: 1, method: "ep" };
    }
  }

  const lt = tokensOf(video.title);
  let best = null, bestScore = 0;
  for (const p of pool) {
    const sc = dice(lt, p.tokens);
    if (sc > bestScore) { bestScore = sc; best = p; }
  }
  return best ? { id: best.id, title: best.title, score: bestScore, method: "fuzzy" } : null;
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
const report = [];
let filled = 0, total = 0;

function walk(node, dirPath) {
  for (const v of node.videos) {
    total++;
    const m = matchVideo(v, dirPath);
    if (m) {
      report.push({ path: dirPath, local: v.title, ...m });
      if (m.method === "ep" || m.score >= THRESH) { v.youtubeId = m.id; filled++; }
      else v.youtubeId = null;
    } else {
      report.push({ path: dirPath, local: v.title, id: "", title: "", score: 0, method: "none" });
      v.youtubeId = null;
    }
  }
  for (const s of node.subcategories) walk(s, dirPath + "/" + s.name);
}
catalog.categories.forEach((c) => walk(c, c.name));

catalog.stats.withYoutubeId = filled;
catalog.generatedAt = new Date().toISOString();
fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2), "utf8");

report.sort((a, b) => a.score - b.score);
const tsv = ["scor\tmetoda\tcale\ttitlu_local\t->\ttitlu_youtube\tid"]
  .concat(report.map((r) =>
    `${r.score.toFixed(2)}\t${r.method}\t${r.path}\t${r.local}\t->\t${r.title}\t${r.id}`));
fs.writeFileSync(path.join(ROOT, "data", "matches.tsv"), tsv.join("\n"), "utf8");

console.log(`\nCompletate automat: ${filled}/${total}`);
const byCat = {};
for (const r of report) {
  const cat = r.path.split("/")[0];
  byCat[cat] = byCat[cat] || { ok: 0, tot: 0 };
  byCat[cat].tot++;
  if (r.score >= THRESH || r.method === "ep") byCat[cat].ok++;
}
console.log("\nAcoperire pe categorii:");
for (const [c, s] of Object.entries(byCat)) {
  console.log(`  ${c.padEnd(20)} ${s.ok}/${s.tot}`);
}
console.log("\nRaport detaliat: data/matches.tsv (deschide-l in Excel/VS Code)");
