const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const GAMES = [
  ["Dead Space", /dead space/i],
  ["Call of Duty: Modern Warfare", /modern warfare/i],
  ["Call of Duty: Black Ops", /black ops/i],
  ["Apex Legends", /apex legends/i],
  ["Atomic Heart", /atomic heart/i],
  ["Wolfenstein", /wolfenstein/i],
  ["Dying Light", /dying light/i],
  ["Titanfall", /titanfall/i],
  ["Battlefield 1", /battlefield 1|\bbf ?1\b/i],
  ["Battlefield V", /battlefield v/i],
  ["Battlefield: Hardline", /hardline/i],
  ["DOOM", /\bdoom\b/i],
  ["Shadow Warrior", /shadow warrior/i],
  ["Borderlands: The Pre-Sequel", /borderlands/i],
  ["Lords of the Fallen", /lords of the fallen/i],
  ["Ori and the Blind Forest", /ori and the blind forest/i],
  ["WildStar", /wildstar/i],
  ["Hearthstone", /hearthstone/i],
  ["Overwatch", /overwatch/i],
  ["Minecraft", /minecraft/i],
  ["Fortnite", /fortnite/i],
  ["Paladins", /paladins/i],
  ["Heroes of the Storm", /heroes of the storm/i],
  ["Insurgency", /insurgency/i],
];

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
function roman(s) { const m = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 }; s = s.toLowerCase(); let n = 0; for (let k = 0; k < s.length; k++) { const c = m[s[k]], nx = m[s[k + 1]] || 0; if (!c) return NaN; n += c < nx ? -c : c; } return n; }
function part(t) {
  if (/final|ultima/i.test(t)) return 999;
  let m;
  if ((m = t.match(/partea\s+(?:a\s+)?([ivxlcdm]+|\d+)/i))) { const v = /^\d+$/.test(m[1]) ? +m[1] : roman(m[1]); if (!isNaN(v)) return v; }
  if ((m = t.match(/\bp\s*0*(\d+)/i))) return +m[1];
  if ((m = t.match(/campanie\s+0*(\d+)/i))) return +m[1];
  if ((m = t.match(/#\s*0*(\d+)/))) return +m[1];
  if ((m = t.match(/0*(\d+)\s*$/))) return +m[1];
  if ((m = t.match(/0*(\d+)/))) return +m[1];
  return 0;
}
const cleanTitle = (t) => t.replace(/^\s*(iobagg|codin|depestream|ninjaramo)\s*[-:]?\s*/i, "").trim() || t;

const SKIP = /\[private video\]|\[deleted video\]|resident evil|biohazard/i;
function load(file) {
  const p = path.join(ROOT, "data", file);
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean).filter((l) => !SKIP.test(l))
    .map((l) => { const i = l.indexOf("|||"); return { id: l.slice(0, i), title: l.slice(i + 3) }; });
}

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const existing = new Set();
(function w(n) { n.videos.forEach((v) => v.youtubeId && existing.add(v.youtubeId)); n.subcategories.forEach(w); })({ videos: [], subcategories: catalog.categories });

const seen = new Set();
const cands = [];
for (const e of load("extra-diverse.txt")) { if (existing.has(e.id) || seen.has(e.id)) continue; seen.add(e.id); cands.push({ ...e, src: "diverse" }); }
for (const e of load("yt-cm.txt")) { if (existing.has(e.id) || seen.has(e.id)) continue; seen.add(e.id); cands.push({ ...e, src: "channel" }); }

const groups = new Map();
const miscDiverse = [];
const miscChannel = [];
for (const e of cands) {
  const g = GAMES.find(([, re]) => re.test(e.title));
  if (g) { if (!groups.has(g[0])) groups.set(g[0], []); groups.get(g[0]).push(e); }
  else if (e.src === "diverse") miscDiverse.push(e);
  else miscChannel.push(e);
}

const iobagg = catalog.categories.find((c) => c.name === "IOBAGG");
const existingSub = new Set(iobagg.subcategories.map((s) => s.name.toLowerCase()));
function makeSub(name, list) {
  list.sort((a, b) => part(a.title) - part(b.title));
  return { name, slug: slug(name), source: "youtube", subcategories: [], videos: list.map((e) => ({ title: cleanTitle(e.title), file: null, youtubeId: e.id })) };
}

let addedGames = 0, addedVideos = 0;
for (const [name, list] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
  if (existingSub.has(name.toLowerCase())) continue;
  iobagg.subcategories.push(makeSub(name, list));
  addedGames++; addedVideos += list.length;
}
if (miscDiverse.length) { iobagg.subcategories.push(makeSub("Diverse jocuri", miscDiverse)); addedVideos += miscDiverse.length; }
if (miscChannel.length) {
  catalog.categories.push({ name: "Altele de pe canal", slug: "altele-de-pe-canal", source: "youtube", subcategories: [], videos: miscChannel.map((e) => ({ title: cleanTitle(e.title), file: null, youtubeId: e.id })) });
  addedVideos += miscChannel.length;
}

let withId = 0, total = 0;
(function cnt(n) { n.videos.forEach((v) => { total++; if (v.youtubeId) withId++; }); n.subcategories.forEach(cnt); })({ videos: [], subcategories: catalog.categories });
catalog.stats.videos = total; catalog.stats.withYoutubeId = withId; catalog.stats.categories = catalog.categories.length;
fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");

console.log(`Adaugate ${addedGames} jocuri + ${miscDiverse.length} diverse + ${miscChannel.length} altele = ${addedVideos} clipuri.`);
console.log(`Total catalog: ${total} clipuri (${withId} cu link).`);
