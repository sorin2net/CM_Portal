const { execSync } = require("child_process");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const steps = [
  ["build-catalog", "scaneaza folderul CM"],
  ["match-youtube", "potriveste cu YouTube (canal CM + LaCafea)"],
  ["match-pass2",   "potriveste pe playlist-uri (Piramida, Rendam, OUTLAST...)"],
  ["apply-manual",  "aplica ID-urile completate manual"],
  ["add-games",     "adauga jocurile de pe canal (Wolfenstein, Dying Light...)"],
];

for (const [file, desc] of steps) {
  console.log(`\n========== ${file}  (${desc}) ==========`);
  execSync(`node scripts/${file}.js`, { stdio: "inherit", cwd: ROOT });
}
console.log("\nGata. catalog.json este la zi.");
