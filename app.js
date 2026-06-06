let CATALOG = null;
let pathStack = [];
let playerList = [];
let playerIndex = 0;
let playerWhere = "";

const $ = (s) => document.querySelector(s);
const content = $("#content");

const YT_ICON = '<svg viewBox="0 0 24 24"><path d="M23 12s0-3.5-.45-5.18a2.78 2.78 0 0 0-1.95-1.96C18.88 4.4 12 4.4 12 4.4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.45 6.82C1 8.5 1 12 1 12s0 3.5.45 5.18a2.78 2.78 0 0 0 1.95 1.96c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.95-1.96C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>';
const FOLDER_ICON = '<svg viewBox="0 0 24 24"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>';

fetch("catalog.json")
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
  if (state.v === "node") {
    const chain = resolvePath(state.path);
    if (chain && chain.length) return doNode(chain);
  }
  doHome();
}
function applyState(state) { history.pushState(state, ""); render(state); }
function navHome() { $("#searchInput").value = ""; applyState({ v: "home" }); }
function navAbout() { applyState({ v: "about" }); }
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

function setActiveNav(which) {
  $("#navHome").classList.toggle("active", which === "home");
  $("#navAbout").classList.toggle("active", which === "about");
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
  const bc = document.createElement("nav");
  bc.className = "breadcrumb";
  const home = document.createElement("a"); home.textContent = "Acasă"; home.onclick = navHome; bc.appendChild(home);
  const sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; bc.appendChild(sep);
  const cur = document.createElement("span"); cur.className = "current"; cur.textContent = "Despre"; bc.appendChild(cur);

  content.innerHTML = "";
  content.appendChild(navBar(bc));
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
        <p>Tot conţinutul aparţine creatorilor <b>Creative Monkeyz</b>. Dacă îţi place, susţine-i pe canalul oficial:</p>
        <div class="chip-links">
          <a class="chip" href="https://www.youtube.com/@CreativeMonkeyzArmy" target="_blank" rel="noopener">${YT_ICON} Creative Monkeyz Army</a>
        </div>
        <p class="muted" style="margin-top:16px">Portal neoficial, neafiliat cu canalul. Realizat din respect pentru munca lor.</p>
      </div>
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
      <div class="chip-links">
        <a class="chip" href="https://www.youtube.com/@CreativeMonkeyzArmy" target="_blank" rel="noopener">${YT_ICON} Canal oficial</a>
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
  $("#playerWhere").textContent = playerWhere;
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
  const bc = document.createElement("nav"); bc.className = "breadcrumb";
  const home = document.createElement("a"); home.textContent = "Acasă"; home.onclick = navHome; bc.appendChild(home);
  const sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; bc.appendChild(sep);
  const cur = document.createElement("span"); cur.className = "current"; cur.textContent = "Căutare"; bc.appendChild(cur);
  content.appendChild(navBar(bc));
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
