const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const manualPath = path.join(ROOT, "data", "manual-ids.json");
const manual = JSON.parse(fs.readFileSync(manualPath, "utf8"));
const rows = fs.readFileSync(path.join(ROOT, "data", "search-results.tsv"), "utf8").split(/\r?\n/).filter(Boolean);

const ALLOW = new Set(["RObotzi/Extras/PhooThay.mp4"]);
const MIN = 0.5;

let added = 0;
const skipped = [];
for (const line of rows) {
  const [file, score, id] = line.split("\t");
  if (!id) { skipped.push(file); continue; }
  if (+score >= MIN || ALLOW.has(file)) { manual[file] = id; added++; }
  else skipped.push(file);
}

fs.writeFileSync(manualPath, JSON.stringify(manual, null, 2), "utf8");
console.log(`Adaugate in manual-ids.json: ${added}`);
console.log(`Ramase negasite: ${skipped.length}`);
skipped.forEach((f) => console.log("   - " + f));
