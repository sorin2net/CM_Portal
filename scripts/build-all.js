// build-all.js
// Reconstruieste tot catalogul, in ordinea corecta. Ruleaza asta ori de cate ori:
//  - adaugi/stergi fisiere video in folderul CM, sau
//  - completezi un ID nou in data/manual-ids.json
// Comanda:  node scripts/build-all.js

const { execSync } = require("child_process");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const steps = [
  ["build-catalog", "scaneaza folderul CM"],
  ["match-youtube", "potriveste cu YouTube (canal CM + LaCafea)"],
  ["match-pass2",   "potriveste pe playlist-uri (Piramida, Rendam, OUTLAST...)"],
  ["apply-manual",  "aplica ID-urile completate manual"],
];

for (const [file, desc] of steps) {
  console.log(`\n========== ${file}  (${desc}) ==========`);
  execSync(`node scripts/${file}.js`, { stdio: "inherit", cwd: ROOT });
}
console.log("\nGata. catalog.json este la zi.");
