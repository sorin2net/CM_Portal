const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const CATALOG = path.join(ROOT, "catalog.json");

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[：]/g, ":").replace(/[^a-z0-9]+/g, " ").trim();
const tok = (s) => new Set(norm(s).split(" ").filter(Boolean));
function dice(a, b) { if (!a.size || !b.size) return 0; let i = 0; for (const t of a) if (b.has(t)) i++; return 2 * i / (a.size + b.size); }
const loadPl = (f) => fs.existsSync(path.join(ROOT, "data", f))
  ? fs.readFileSync(path.join(ROOT, "data", f), "utf8").split(/\r?\n/).filter(Boolean)
      .map((l) => { const i = l.indexOf("|||"); return { id: l.slice(0, i), title: l.slice(i + 3) }; })
  : [];

function roman(s) {
  const m = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 };
  s = s.toLowerCase(); let n = 0;
  for (let k = 0; k < s.length; k++) {
    const cur = m[s[k]], nx = m[s[k + 1]] || 0;
    if (!cur) return null;
    n += cur < nx ? -cur : cur;
  }
  return n;
}

const JOBS = [
  { prefix: "PIRAMIDA",                pls: ["pl-piramida.txt"],                 mode: "fuzzy" },
  { prefix: "RENDAM",                  pls: ["pl-rendam-en.txt", "pl-rendam-ro.txt"], mode: "fuzzy" },
  { prefix: "NinjaRamo/RFX",           pls: ["pl-rfx.txt"],                      mode: "fuzzy" },
  { prefix: "CODIN&RAMO/PUNCT",        pls: ["pl-punct.txt"],                    mode: "fuzzy" },
  { prefix: "CODIN&RAMO/DPS",          pls: ["pl-dps.txt"],                      mode: "fuzzy" },
  { prefix: "RObotzi/Songs",           pls: ["pl-muzica.txt"],                   mode: "fuzzy" },
  { prefix: "IOBAGG/Songs",            pls: ["pl-muzica.txt"],                   mode: "fuzzy" },
  { prefix: "NinjaRamo/Muzica",        pls: ["pl-muzica.txt"],                   mode: "fuzzy" },
  { prefix: "IOBAGG/OUTLAST/MainGame", pls: ["pl-outlast.txt"],                  mode: "outlast" },
];
const FUZZY_MIN = 0.34;

function outlastMatch(localTitle, pool) {
  const ln = (localTitle.match(/partea\s+0*(\d+)/i) || [])[1];
  if (!ln) return null;
  const wantFinal = /final/i.test(localTitle);
  for (const p of pool) {
    const t = norm(p.title);
    if (/whistleblower|demo/.test(t)) continue;
    if (wantFinal && /final/.test(t) && !/partea/.test(t)) return p;
    const rm = t.match(/partea\s+(?:a\s+)?([ivxlcdm]+)\b/);
    if (rm && roman(rm[1]) === +ln) return p;
  }
  return null;
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
let filled = 0;
const log = [];

function tryJob(video, dirPath) {
  if (video.youtubeId) return;
  const job = JOBS.find((j) => dirPath.startsWith(j.prefix));
  if (!job) return;
  const pool = job.pls.flatMap(loadPl);

  if (job.mode === "outlast") {
    const m = outlastMatch(video.title, pool);
    if (m) { video.youtubeId = m.id; filled++; log.push(`OUTLAST  ${video.title}  ->  ${m.title}`); }
    return;
  }

  const lt = tok(video.title);
  let best = null, bs = 0;
  for (const p of pool) { const sc = dice(lt, tok(p.title)); if (sc > bs) { bs = sc; best = p; } }
  if (best && bs >= FUZZY_MIN) { video.youtubeId = best.id; filled++; log.push(`${bs.toFixed(2)}  ${video.title}  ->  ${best.title}`); }
}

function walk(node, dirPath) {
  node.videos.forEach((v) => tryJob(v, dirPath));
  node.subcategories.forEach((s) => walk(s, dirPath + "/" + s.name));
}
catalog.categories.forEach((c) => walk(c, c.name));

let withId = 0, total = 0;
(function cnt(n){ n.videos.forEach(v=>{total++; if(v.youtubeId) withId++;}); n.subcategories.forEach(cnt); })({videos:[],subcategories:catalog.categories});
catalog.stats.withYoutubeId = withId;
fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2), "utf8");

console.log(`Pass 2: am completat inca ${filled} clipuri.\n`);
log.sort().forEach((l) => console.log("  " + l));
console.log(`\nTotal cu ID YouTube acum: ${withId}/${total}`);
