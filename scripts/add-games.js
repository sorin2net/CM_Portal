const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const GAMES = [
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
  if ((m = t.match(/0*(\d+)\s*$/))) return +m[1];
  if ((m = t.match(/0*(\d+)/))) return +m[1];
  return 0;
}
const cleanTitle = (t) => t.replace(/^\s*(iobagg|codin|depestream|ninjaramo)\s*[-:]?\s*/i, "").trim() || t;

const SKIP = /\[private video\]|\[deleted video\]|resident evil|biohazard/i;
const entries = fs.readFileSync(path.join(ROOT, "data", "extra-diverse.txt"), "utf8")
  .split(/\r?\n/).filter(Boolean).filter((l) => !SKIP.test(l))
  .map((l) => { const i = l.indexOf("|||"); return { id: l.slice(0, i), title: l.slice(i + 3) }; });

const groups = new Map();
const misc = [];
for (const e of entries) {
  const g = GAMES.find(([, re]) => re.test(e.title));
  if (g) { if (!groups.has(g[0])) groups.set(g[0], []); groups.get(g[0]).push(e); }
  else misc.push(e);
}

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const iobagg = catalog.categories.find((c) => c.name === "IOBAGG");
const existing = new Set(iobagg.subcategories.map((s) => s.name.toLowerCase()));

function makeSub(name, list) {
  list.sort((a, b) => part(a.title) - part(b.title));
  return {
    name, slug: slug(name), subcategories: [], source: "youtube",
    videos: list.map((e) => ({ title: cleanTitle(e.title), file: null, youtubeId: e.id })),
  };
}

let addedGames = 0, addedVideos = 0;
for (const [name, list] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
  if (existing.has(name.toLowerCase())) continue;
  const sub = makeSub(name, list);
  iobagg.subcategories.push(sub);
  addedGames++; addedVideos += sub.videos.length;
}
if (misc.length) {
  const sub = makeSub("Diverse jocuri", misc);
  iobagg.subcategories.push(sub);
  addedVideos += sub.videos.length;
}

let withId = 0, total = 0;
(function cnt(n) { n.videos.forEach((v) => { total++; if (v.youtubeId) withId++; }); n.subcategories.forEach(cnt); })({ videos: [], subcategories: catalog.categories });
catalog.stats.videos = total; catalog.stats.withYoutubeId = withId;
fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");

console.log(`Adaugate ${addedGames} jocuri (+ Diverse) = ${addedVideos} clipuri noi sub IOBAGG.`);
console.log("Jocuri:", [...groups.keys()].join(", "));
console.log(`Total catalog acum: ${total} clipuri (${withId} cu link).`);
