const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const YTDLP = path.join(ROOT, "CM", "yt-dlp.exe");

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[：？]/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
const tok = (s) => new Set(norm(s).split(" ").filter(Boolean));
function dice(a, b) { if (!a.size || !b.size) return 0; let i = 0; for (const t of a) if (b.has(t)) i++; return 2 * i / (a.size + b.size); }

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const missing = [];
(function w(n, p) { n.videos.forEach((v) => { if (!v.youtubeId) missing.push({ title: v.title, file: v.file, dir: p }); }); n.subcategories.forEach((s) => w(s, p + "/" + s.name)); })({ videos: [], subcategories: catalog.categories }, "");

function query(m) {
  let q = m.title.replace(/^\d+\s*-\s*/, "").replace(/[：]/g, ":").replace(/[？]/g, "?");
  if (/RObotzi/i.test(m.dir) && !/robotzi/i.test(q)) q = "Robotzi " + q;
  if (/^3lar/i.test(m.dir) && !/3lar|3lr/i.test(q)) q = "3lar " + q;
  return q;
}

const lines = [];
missing.forEach((m, idx) => {
  const q = query(m);
  let out = "";
  try {
    out = execFileSync(YTDLP, ["--no-warnings", "--flat-playlist", "--print", "%(id)s|||%(title)s|||%(channel)s", `ytsearch4:${q}`], { encoding: "utf8", timeout: 30000, stdio: ["ignore", "pipe", "ignore"] });
  } catch (e) { out = ""; }
  const cands = out.split(/\r?\n/).filter(Boolean).map((l) => { const p = l.split("|||"); return { id: p[0], title: p[1] || "", channel: p[2] || "" }; });
  const lt = tok(m.title);
  cands.forEach((c) => (c.score = dice(lt, tok(c.title))));
  cands.sort((a, b) => b.score - a.score);
  const best = cands[0];
  console.log(`\n[${idx + 1}/${missing.length}] ${m.file}`);
  console.log(`   cautare: "${q}"`);
  cands.slice(0, 4).forEach((c, i) => console.log(`   ${i === 0 ? "*" : " "} ${c.score.toFixed(2)} ${c.id} | ${c.title} | (${c.channel})`));
  if (best) lines.push([m.file, best.score.toFixed(2), best.id, best.title, best.channel].join("\t"));
});

fs.writeFileSync(path.join(ROOT, "data", "search-results.tsv"), lines.join("\n"), "utf8");
console.log(`\n\nScris data/search-results.tsv (${lines.length} propuneri).`);
