let CATALOG = null;
let pathStack = [];
let playerList = [];
let playerIndex = 0;
let playerWhere = "";
let flatVideos = null;

const $ = (s) => document.querySelector(s);
const content = $("#content");

const YT_ICON = '<svg viewBox="0 0 24 24"><path d="M23 12s0-3.5-.45-5.18a2.78 2.78 0 0 0-1.95-1.96C18.88 4.4 12 4.4 12 4.4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.45 6.82C1 8.5 1 12 1 12s0 3.5.45 5.18a2.78 2.78 0 0 0 1.95 1.96c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.95-1.96C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>';
const FOLDER_ICON = '<svg viewBox="0 0 24 24"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>';

const SOCIALS = [
  ["YouTube", "https://www.youtube.com/@CreativeMonkeyzArmy", '<path d="M23 12s0-3.5-.45-5.18a2.78 2.78 0 0 0-1.95-1.96C18.88 4.4 12 4.4 12 4.4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.45 6.82C1 8.5 1 12 1 12s0 3.5.45 5.18a2.78 2.78 0 0 0 1.95 1.96c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.95-1.96C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z"/>'],
  ["Facebook", "https://www.facebook.com/CreativeMonkeyzOfficial/", '<path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.46-.13-2.43 0-4.1 1.49-4.1 4.2v2.34H7.4V13h2.74v8h3.36z"/>'],
  ["Instagram", "https://www.instagram.com/creativemonkeyzarmy/", '<path d="M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.42.46-.66.26-1.21.6-1.77 1.15-.55.56-.9 1.11-1.15 1.77-.24.63-.41 1.36-.46 2.42C2.01 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.46 2.42.26.66.6 1.21 1.15 1.77.56.55 1.11.9 1.77 1.15.63.24 1.36.41 2.42.46 1.06.05 1.42.06 4.12.06s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.42-.46.66-.26 1.21-.6 1.77-1.15.55-.56.9-1.11 1.15-1.77.24-.63.41-1.36.46-2.42.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.46-2.42-.26-.66-.6-1.21-1.15-1.77-.56-.55-1.11-.9-1.77-1.15-.63-.24-1.36-.41-2.42-.46C15.06 2.01 14.7 2 12 2zm0 1.8c2.65 0 2.97.01 4.02.06.97.04 1.5.2 1.85.34.46.18.8.4 1.15.74.34.35.56.69.74 1.15.14.35.3.88.34 1.85.05 1.05.06 1.37.06 4.02s-.01 2.97-.06 4.02c-.04.97-.2 1.5-.34 1.85-.18.46-.4.8-.74 1.15-.35.34-.69.56-1.15.74-.35.14-.88.3-1.85.34-1.05.05-1.37.06-4.02.06s-2.97-.01-4.02-.06c-.97-.04-1.5-.2-1.85-.34a3.1 3.1 0 01-1.15-.74 3.1 3.1 0 01-.74-1.15c-.14-.35-.3-.88-.34-1.85-.05-1.05-.06-1.37-.06-4.02s.01-2.97.06-4.02c.04-.97.2-1.5.34-1.85.18-.46.4-.8.74-1.15.35-.34.69-.56 1.15-.74.35-.14.88-.3 1.85-.34C9.03 3.81 9.35 3.8 12 3.8zM12 6.87a5.13 5.13 0 100 10.26A5.13 5.13 0 0012 6.87zm0 8.46a3.33 3.33 0 110-6.66 3.33 3.33 0 010 6.66zm6.54-8.66a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/>'],
  ["Twitch", "https://www.twitch.tv/creativemonkeyz", '<path d="M4.3 3L3 6.3v12.4h4.1V21h2.3l2.3-2.3h3.4l4.6-4.6V3H4.3zm15.1 10.3L16.7 16h-3.4l-2.3 2.3V16H7.6V4.8h11.8v8.5zM15.6 7.8h-1.7v4.6h1.7V7.8zm-4.6 0H9.3v4.6H11V7.8z"/>'],
  ["Site oficial", "https://creativemonkeyz.com/", '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.6 15.6 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a7.96 7.96 0 010-4h3.38a16.5 16.5 0 000 4H4.26zm.81 2h2.95c.35 1.27.83 2.47 1.38 3.56A8.03 8.03 0 015.07 16zm2.95-8H5.07a8.03 8.03 0 014.34-3.56A15.6 15.6 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82A14.6 14.6 0 0112 19.96zM14.34 14H9.66a14.7 14.7 0 010-4h4.68a14.7 14.7 0 010 4zm.25 5.56c.55-1.09 1.03-2.29 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14a16.5 16.5 0 000-4h3.38a7.96 7.96 0 010 4h-3.38z"/>'],
];
function socialsHtml() {
  return `<div class="socials">${SOCIALS.map((s) => `<a class="social" href="${s[1]}" target="_blank" rel="noopener" title="${s[0]}" aria-label="${s[0]}"><svg viewBox="0 0 24 24">${s[2]}</svg></a>`).join("")}</div>`;
}

const FARTRAVEL_APK = "https://apkpure.com/robotzi-fartravel/com.creativemonkeyz.robotzifartravel";

fetch("catalog.json?t=" + Date.now())
  .then((r) => r.json())
  .then((data) => {
    CATALOG = data;
    renderFooter();
    history.replaceState({ v: "home" }, "");
    doHome();
  })
  .catch((err) => { content.innerHTML = '<p class="empty-msg">Nu am putut incarca catalog.json. Deschide pagina printr-un server local.</p>'; console.error(err); });

window.addEventListener("popstate", (e) => render(e.state || { v: "home" }));

function render(state) {
  if (state.v === "about") return doAbout();
  if (state.v === "fartravel") return doFartravel();
  if (state.v === "node") {
    const chain = resolvePath(state.path);
    if (chain && chain.length) return doNode(chain);
  }
  doHome();
}
function applyState(state) { history.pushState(state, ""); render(state); }
function navHome() { $("#searchInput").value = ""; applyState({ v: "home" }); }
function navAbout() { applyState({ v: "about" }); }
function navFartravel() { applyState({ v: "fartravel" }); }
function navNode(chain) { applyState({ v: "node", path: chain.map((n) => n.name) }); }
function resolvePath(names) {
  let nodes = CATALOG.categories, chain = [];
  for (const nm of names) { const n = nodes.find((x) => x.name === nm); if (!n) return null; chain.push(n); nodes = n.subcategories; }
  return chain;
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function countVideos(node) { let n = node.videos.length; node.subcategories.forEach((s) => (n += countVideos(s))); return n; }
function thumb(id, q) { return `https://img.youtube.com/vi/${id}/${q || "mqdefault"}.jpg`; }
function coverId(node) {
  if (node.__cover !== undefined) return node.__cover;
  let id = null;
  for (const v of node.videos) if (v.youtubeId) { id = v.youtubeId; break; }
  if (!id) for (const s of node.subcategories) { const c = coverId(s); if (c) { id = c; break; } }
  node.__cover = id;
  return id;
}

function buildFlat() {
  if (flatVideos) return flatVideos;
  const out = [];
  (function w(node, prefix) {
    node.videos.forEach((v) => { if (v.youtubeId) out.push({ title: v.title, youtubeId: v.youtubeId, where: prefix }); });
    node.subcategories.forEach((s) => w(s, prefix ? prefix + " › " + s.name : s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  flatVideos = out;
  return out;
}
function playRandom() {
  const list = buildFlat();
  if (!list.length) return;
  const i = Math.floor(Math.random() * list.length);
  openPlayer(list, i, list[i].where);
}

function setActiveNav(which) {
  $("#navHome").classList.toggle("active", which === "home");
  $("#navAbout").classList.toggle("active", which === "about");
  $("#navFartravel").classList.toggle("active", which === "fartravel");
}

function backButton() {
  const b = document.createElement("button");
  b.className = "back-btn";
  b.innerHTML = "&#8249; &Icirc;napoi";
  b.onclick = () => history.back();
  return b;
}
function navBar(breadcrumbEl) {
  const bar = document.createElement("div");
  bar.className = "navbar";
  bar.appendChild(backButton());
  bar.appendChild(breadcrumbEl);
  return bar;
}
function simpleBreadcrumb(label) {
  const bc = document.createElement("nav"); bc.className = "breadcrumb";
  const home = document.createElement("a"); home.textContent = "Acasă"; home.onclick = navHome; bc.appendChild(home);
  const sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; bc.appendChild(sep);
  const cur = document.createElement("span"); cur.className = "current"; cur.textContent = label; bc.appendChild(cur);
  return bc;
}

function folderCard(node, chain) {
  const id = coverId(node);
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="cover">${id ? `<img loading="lazy" src="${thumb(id)}" alt="">` : ""}</div>
    <div class="badge-folder">${FOLDER_ICON}${countVideos(node)}</div>
    <div class="card-label"><div class="card-title">${escapeHtml(node.name)}</div></div>`;
  el.onclick = () => navNode(chain);
  return el;
}

function videoCard(video, list, index, where) {
  const id = video.youtubeId;
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="cover">
      ${id ? `<img loading="lazy" src="${thumb(id)}" alt="">` : ""}
      <div class="play-badge"><i></i></div>
    </div>
    ${id ? "" : '<div class="badge-nolink">f&#259;r&#259; link</div>'}
    <div class="card-label">
      <div class="card-title">${escapeHtml(video.title)}</div>
      ${where ? `<div class="card-where">${escapeHtml(where)}</div>` : ""}
    </div>`;
  el.onclick = () => openPlayer(list, index, where || "");
  return el;
}

function doHome() {
  setActiveNav("home");
  pathStack = [];
  window.scrollTo(0, 0);
  content.innerHTML = "";

  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <div class="hero-bg"><img src="assets/cm-banner.jpg" alt=""></div>
    <div class="hero-inner">
      <img class="hero-logo" src="assets/cm-logo.jpg" alt="">
      <h1>Creative Monkeyz <b>Portal</b></h1>
      <p>O colec&#539;ie organizat&#259; cu drag a show-urilor Creative Monkeyz — de la Robotzi la gaming, muzic&#259;, interviuri &#537;i momente de pe stream. Toate la un loc, gata de vizionat.</p>
      <div class="hero-stats">
        <div class="hero-stat"><b>${CATALOG.categories.length}</b><span>Categorii</span></div>
        <div class="hero-stat"><b>${CATALOG.stats.videos}</b><span>Videoclipuri</span></div>
        <div class="hero-stat"><b>1.44M</b><span>Abona&#539;i CM</span></div>
      </div>
    </div>`;
  content.appendChild(hero);

  CATALOG.categories.forEach((cat) => {
    const sec = document.createElement("section");
    sec.className = "section";
    const head = document.createElement("div");
    head.className = "section-head";
    head.innerHTML = `<h2>${escapeHtml(cat.name)}</h2><span class="count">${countVideos(cat)} clipuri</span>`;
    if (cat.subcategories.length) {
      const more = document.createElement("span");
      more.className = "more"; more.textContent = "Vezi tot ›";
      more.onclick = () => navNode([cat]);
      head.appendChild(more);
    }
    sec.appendChild(head);
    const row = document.createElement("div");
    row.className = "row";
    cat.subcategories.forEach((sub) => row.appendChild(folderCard(sub, [cat, sub])));
    cat.videos.forEach((v, i) => row.appendChild(videoCard(v, cat.videos, i, cat.name)));
    sec.appendChild(row);
    content.appendChild(sec);
  });
}

function doNode(chain) {
  setActiveNav(null);
  pathStack = chain.slice();
  const node = chain[chain.length - 1];
  window.scrollTo(0, 0);
  content.innerHTML = "";
  content.appendChild(navBar(buildBreadcrumb()));

  const id = coverId(node);
  const head = document.createElement("div");
  head.className = "page-head";
  head.innerHTML = `
    ${id ? `<img class="page-head-cover" src="${thumb(id, "hqdefault")}" alt="">` : ""}
    <div><h1>${escapeHtml(node.name)}</h1><div class="sub">${countVideos(node)} clipuri${node.subcategories.length ? " · " + node.subcategories.length + " sec&#539;iuni" : ""}</div></div>`;
  content.appendChild(head);

  const where = pathStack.map((n) => n.name).join(" › ");
  if (node.subcategories.length) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.innerHTML = `<div class="section-head"><h2>Sec&#539;iuni</h2><span class="count">${node.subcategories.length}</span></div>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    node.subcategories.forEach((sub) => grid.appendChild(folderCard(sub, [...pathStack, sub])));
    sec.appendChild(grid);
    content.appendChild(sec);
  }
  if (node.videos.length) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.innerHTML = `<div class="section-head"><h2>Videoclipuri</h2><span class="count">${node.videos.length}</span></div>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    node.videos.forEach((v, i) => grid.appendChild(videoCard(v, node.videos, i, where)));
    sec.appendChild(grid);
    content.appendChild(sec);
  }
}

function buildBreadcrumb() {
  const bc = document.createElement("nav");
  bc.className = "breadcrumb";
  const home = document.createElement("a");
  home.textContent = "Acasă"; home.onclick = navHome;
  bc.appendChild(home);
  pathStack.forEach((node, i) => {
    const sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; bc.appendChild(sep);
    if (i === pathStack.length - 1) {
      const cur = document.createElement("span"); cur.className = "current"; cur.textContent = node.name; bc.appendChild(cur);
    } else {
      const a = document.createElement("a"); a.textContent = node.name;
      a.onclick = () => navNode(pathStack.slice(0, i + 1)); bc.appendChild(a);
    }
  });
  return bc;
}

function doAbout() {
  setActiveNav("about");
  pathStack = [];
  window.scrollTo(0, 0);
  content.innerHTML = "";
  content.appendChild(navBar(simpleBreadcrumb("Despre")));
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="about">
      <div class="about-card">
        <h2>Despre <b>proiect</b></h2>
        <p>Creative Monkeyz Portal este un proiect-tribut neoficial, făcut de un fan. Adună într-un singur loc, organizat pe categorii şi sezoane, show-urile care ne-au făcut să râdem: <b>Robotzi</b>, <b>IOBAGG</b>, <b>3lar</b>, <b>Piramida</b>, <b>Rendam</b>, interviuri, muzică şi zeci de gameplay-uri (Wolfenstein, Dying Light, Dead Space, Call of Duty şi multe altele).</p>
        <p>Videoclipurile rulează direct de pe YouTube, prin player-ul oficial — aşa creatorii îşi păstrează vizualizările, iar tu ai totul ordonat ca într-o bibliotecă.</p>
        <p class="muted">${CATALOG.stats.videos} videoclipuri în ${CATALOG.categories.length} categorii.</p>
      </div>
      <div class="about-card">
        <img class="credit-logo" src="assets/cm-logo.jpg" alt="">
        <h2>Credite</h2>
        <p>Tot conţinutul aparţine creatorilor <b>Creative Monkeyz</b>. Dacă îţi place, urmăreşte-i şi susţine-i pe canalele oficiale:</p>
        ${socialsHtml()}
        <p class="muted" style="margin-top:16px">Portal neoficial, neafiliat cu canalul. Realizat din respect pentru munca lor.</p>
      </div>
    </div>`;
  content.appendChild(wrap);
}

function doFartravel() {
  setActiveNav("fartravel");
  pathStack = [];
  window.scrollTo(0, 0);
  content.innerHTML = "";
  content.appendChild(navBar(simpleBreadcrumb("Fartravel")));
  const wrap = document.createElement("div");
  wrap.className = "fartravel";
  wrap.innerHTML = `
    <div class="ft-card">
      <img class="ft-logo" src="assets/cm-logo.jpg" alt="">
      <div class="ft-badge">JOC PIERDUT · 2014</div>
      <h1>RObotzi <b>Fartravel</b></h1>
      <p>Jocul mobil lansat de Creative Monkeyz în 2014 şi retras din Google Play în 2017. Îi ghidezi pe <b>MO</b> şi <b>F.O.C.A.</b> prin spaţiu — plutind cu ajutorul gazelor 💨 şi colectând boabe spaţiale pentru combustibil. Un mic giuvaer pierdut, readus la lumină aici.</p>
      <div class="ft-actions">
        <a class="ft-btn primary" href="${FARTRAVEL_APK}" target="_blank" rel="noopener">⬇ Descarcă APK (Android)</a>
        <a class="ft-btn" href="https://www.youtube.com/results?search_query=RObotzi+Fartravel" target="_blank" rel="noopener">Vezi gameplay</a>
      </div>
      <p class="ft-note">Este un joc <b>Android</b> (~33 MB), aşa că nu rulează direct în browser. Îl poţi instala pe un telefon Android sau pe PC cu un emulator (ex. BlueStacks). Sursă terţă (APKPure) — instalează pe propriul risc. Nu mai este disponibil pe Google Play.</p>
    </div>`;
  content.appendChild(wrap);
}

function renderFooter() {
  $("#siteFooter").innerHTML = `
    <div class="footer-inner">
      <div>
        <div class="footer-brand"><img src="assets/cm-logo.jpg" alt=""> Creative Monkeyz Portal</div>
        <p class="footer-note">Proiect-tribut neoficial făcut de un fan. Tot conţinutul aparţine Creative Monkeyz; videoclipurile sunt redate de pe YouTube. Neafiliat oficial cu canalul.</p>
      </div>
      <div>
        <p class="footer-note" style="margin-bottom:10px">Urmăreşte Creative Monkeyz:</p>
        ${socialsHtml()}
      </div>
    </div>`;
}

const overlay = $("#playerOverlay");
const playerFrame = $("#playerFrame");

function openPlayer(list, index, where) {
  playerList = list; playerIndex = index; playerWhere = where || "";
  showCurrentVideo();
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}
function showCurrentVideo() {
  const v = playerList[playerIndex];
  $("#playerTitle").textContent = v.title;
  $("#playerWhere").textContent = v.where || playerWhere;
  if (v.youtubeId) {
    playerFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  } else {
    playerFrame.innerHTML = '<div class="player-empty">Acest clip nu are încă un <b>link YouTube</b>.<br>Face parte din arhiva locală.</div>';
  }
  $("#btnPrev").disabled = playerIndex <= 0;
  $("#btnNext").disabled = playerIndex >= playerList.length - 1;
}
function closePlayer() { overlay.hidden = true; playerFrame.innerHTML = ""; document.body.style.overflow = ""; }

$("#btnClose").onclick = closePlayer;
$("#btnPrev").onclick = () => { if (playerIndex > 0) { playerIndex--; showCurrentVideo(); } };
$("#btnNext").onclick = () => { if (playerIndex < playerList.length - 1) { playerIndex++; showCurrentVideo(); } };
$("#btnFullscreen").onclick = () => { const el = playerFrame.querySelector("iframe") || playerFrame; if (el.requestFullscreen) el.requestFullscreen(); };
overlay.addEventListener("click", (e) => { if (e.target === overlay) closePlayer(); });
document.addEventListener("keydown", (e) => {
  if (overlay.hidden) return;
  if (e.key === "Escape") closePlayer();
  if (e.key === "ArrowRight") $("#btnNext").click();
  if (e.key === "ArrowLeft") $("#btnPrev").click();
});

$("#searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { doHome(); return; }
  setActiveNav(null);
  pathStack = [];
  const results = [];
  (function walk(node, prefix) {
    node.videos.forEach((v) => { if (v.title.toLowerCase().includes(q)) results.push({ v, where: prefix }); });
    node.subcategories.forEach((s) => walk(s, prefix + " › " + s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  window.scrollTo(0, 0);
  content.innerHTML = "";
  content.appendChild(navBar(simpleBreadcrumb("Căutare")));
  const sh = document.createElement("div"); sh.className = "section-head";
  sh.innerHTML = `<h2>Rezultate</h2><span class="count">${results.length}</span>`;
  content.appendChild(sh);
  const grid = document.createElement("div"); grid.className = "grid";
  const list = results.map((r) => r.v);
  results.forEach((r, i) => grid.appendChild(videoCard(r.v, list, i, r.where.replace(/^ › /, ""))));
  content.appendChild(grid);
  if (!results.length) content.innerHTML += '<p class="empty-msg">Niciun rezultat.</p>';
});

$("#brand").onclick = navHome;
$("#navHome").onclick = navHome;
$("#navAbout").onclick = navAbout;
$("#navFartravel").onclick = navFartravel;
$("#btnRandom").onclick = playRandom;
