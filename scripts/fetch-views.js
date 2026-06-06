const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const YTDLP = path.join(ROOT, "CM", "yt-dlp.exe");

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog.json"), "utf8"));
const ids = new Set();
(function w(n) { n.videos.forEach((v) => v.youtubeId && ids.add(v.youtubeId)); n.subcategories.forEach(w); })({ videos: [], subcategories: catalog.categories });

const urlsFile = path.join(ROOT, "data", "all-urls.txt");
fs.writeFileSync(urlsFile, [...ids].map((id) => "https://www.youtube.com/watch?v=" + id).join("\n"));
console.log(`Descarc vizualizarile pentru ${ids.size} clipuri (dureaza cateva minute)...`);

const out = execFileSync(YTDLP, ["-a", urlsFile, "--no-warnings", "--ignore-errors", "--print", "%(id)s|%(view_count)s"], { encoding: "utf8", maxBuffer: 1 << 26 });
fs.writeFileSync(path.join(ROOT, "data", "views-raw.txt"), out);
console.log(`Gata. Ruleaza acum: node scripts/build-all.js`);
