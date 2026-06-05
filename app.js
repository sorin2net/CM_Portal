// ===== Creative Monkeyz Portal — logica interfetei =====

let CATALOG = null;       // catalogul incarcat din catalog.json
let playerList = [];      // lista de videoclipuri din contextul curent (pentru Prev/Next)
let playerIndex = 0;      // pozitia in lista de mai sus

const $ = (sel) => document.querySelector(sel);
const content = $("#content");
const breadcrumb = $("#breadcrumb");

// ---- Pornire ----
fetch("catalog.json")
  .then((r) => r.json())
  .then((data) => {
    CATALOG = data;
    renderHome();
  })
  .catch((err) => {
    content.innerHTML =
      '<p class="empty-msg">Nu am putut incarca catalog.json.<br>' +
      "Deschide pagina printr-un server local (vezi instructiunile).</p>";
    console.error(err);
  });

// ---- Helper: miniatura YouTube sau placeholder ----
function thumbFor(video) {
  if (video.youtubeId) {
    return `<img loading="lazy" src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" alt="">`;
  }
  return ""; // fundal negru gol pentru cele fara link
}

// ---- Card pentru un VIDEOCLIP ----
function videoCard(video, list, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="thumb">
      ${thumbFor(video)}
      ${video.youtubeId ? "" : '<span class="no-id">f&#259;r&#259; link</span>'}
      <div class="play-badge"><span>&#9654;</span></div>
    </div>
    <div class="card-title">${escapeHtml(video.title)}</div>`;
  card.addEventListener("click", () => openPlayer(list, index));
  return card;
}

// ---- Card pentru o SUBCATEGORIE (folder) ----
function folderCard(node) {
  const total = countVideos(node);
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="thumb folder">&#128193;</div>
    <div class="card-title">${escapeHtml(node.name)}</div>
    <div class="card-sub">${total} clipuri</div>`;
  card.addEventListener("click", () => navigateTo(node));
  return card;
}

// ---- Pagina principala (rânduri pe categorii) ----
function renderHome() {
  pathStack = [];
  renderBreadcrumb();
  content.innerHTML = "";

  CATALOG.categories.forEach((cat) => {
    const section = document.createElement("section");
    section.className = "section";
    section.innerHTML = `<h2>${escapeHtml(cat.name)}
      <span class="count">${countVideos(cat)} clipuri</span></h2>`;

    const row = document.createElement("div");
    row.className = "row";
    // intai subcategoriile (foldere), apoi clipurile directe
    cat.subcategories.forEach((sub) => row.appendChild(folderCard(sub)));
    cat.videos.forEach((v, i) => row.appendChild(videoCard(v, cat.videos, i)));

    section.appendChild(row);
    content.appendChild(section);
  });
}

// ---- Navigare in interiorul unei categorii/subcategorii ----
let pathStack = []; // lista de noduri de la radacina pana la nodul curent

function navigateTo(node) {
  pathStack.push(node);
  renderNode(node);
}

function renderNode(node) {
  renderBreadcrumb();
  content.innerHTML = "";

  // Sectiune cu subcategorii (daca exista)
  if (node.subcategories.length) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.innerHTML = `<h2>Sec&#539;iuni <span class="count">${node.subcategories.length}</span></h2>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    node.subcategories.forEach((sub) => grid.appendChild(folderCard(sub)));
    sec.appendChild(grid);
    content.appendChild(sec);
  }

  // Sectiune cu videoclipuri (daca exista)
  if (node.videos.length) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.innerHTML = `<h2>Videoclipuri <span class="count">${node.videos.length}</span></h2>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    node.videos.forEach((v, i) => grid.appendChild(videoCard(v, node.videos, i)));
    sec.appendChild(grid);
    content.appendChild(sec);
  }

  if (!node.subcategories.length && !node.videos.length) {
    content.innerHTML = '<p class="empty-msg">Nimic aici.</p>';
  }
}

// ---- Breadcrumb (Home / Categorie / Subcategorie) ----
function renderBreadcrumb() {
  breadcrumb.innerHTML = "";
  const home = document.createElement("a");
  home.textContent = "Acas&#259;".replace("&#259;", "ă");
  home.onclick = renderHome;
  breadcrumb.appendChild(home);

  pathStack.forEach((node, i) => {
    const sep = document.createElement("span");
    sep.className = "sep"; sep.textContent = "›";
    breadcrumb.appendChild(sep);

    if (i === pathStack.length - 1) {
      const cur = document.createElement("span");
      cur.className = "current"; cur.textContent = node.name;
      breadcrumb.appendChild(cur);
    } else {
      const a = document.createElement("a");
      a.textContent = node.name;
      a.onclick = () => { pathStack = pathStack.slice(0, i + 1); renderNode(node); };
      breadcrumb.appendChild(a);
    }
  });
}

// ===== PLAYER =====
const overlay = $("#playerOverlay");
const playerFrame = $("#playerFrame");
const playerTitle = $("#playerTitle");

function openPlayer(list, index) {
  playerList = list;
  playerIndex = index;
  showCurrentVideo();
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function showCurrentVideo() {
  const video = playerList[playerIndex];
  playerTitle.textContent = video.title;

  if (video.youtubeId) {
    playerFrame.innerHTML =
      `<iframe src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen></iframe>`;
  } else {
    playerFrame.innerHTML =
      '<div class="player-empty">Acest clip nu are &#238;nc&#259; un <b>link YouTube</b>.<br>' +
      "&#206;l ad&#259;ug&#259;m &#238;n Faza 2 (asocierea cu YouTube).</div>";
  }

  // activeaza/dezactiveaza Prev/Next la capete
  $("#btnPrev").disabled = playerIndex <= 0;
  $("#btnNext").disabled = playerIndex >= playerList.length - 1;
}

function closePlayer() {
  overlay.hidden = true;
  playerFrame.innerHTML = ""; // opreste sunetul
  document.body.style.overflow = "";
}

$("#btnClose").onclick = closePlayer;
$("#btnPrev").onclick = () => { if (playerIndex > 0) { playerIndex--; showCurrentVideo(); } };
$("#btnNext").onclick = () => { if (playerIndex < playerList.length - 1) { playerIndex++; showCurrentVideo(); } };
$("#btnFullscreen").onclick = () => {
  const el = playerFrame.querySelector("iframe") || playerFrame;
  if (el.requestFullscreen) el.requestFullscreen();
};

// inchide cu Esc, navigheaza cu sageti
document.addEventListener("keydown", (e) => {
  if (overlay.hidden) return;
  if (e.key === "Escape") closePlayer();
  if (e.key === "ArrowRight") $("#btnNext").click();
  if (e.key === "ArrowLeft") $("#btnPrev").click();
});
overlay.addEventListener("click", (e) => { if (e.target === overlay) closePlayer(); });

// ===== CAUTARE =====
$("#searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { renderHome(); return; }

  const results = [];
  (function walk(node, prefix) {
    node.videos.forEach((v) => {
      if (v.title.toLowerCase().includes(q)) results.push({ v, where: prefix });
    });
    node.subcategories.forEach((s) => walk(s, prefix + " › " + s.name));
  });
  CATALOG.categories.forEach((c) => walk(c, c.name));

  pathStack = [];
  breadcrumb.innerHTML = "";
  content.innerHTML = `<section class="section"><h2>Rezultate
    <span class="count">${results.length}</span></h2></section>`;
  const grid = document.createElement("div");
  grid.className = "grid";
  const list = results.map((r) => r.v);
  results.forEach((r, i) => {
    const card = videoCard(r.v, list, i);
    const sub = document.createElement("div");
    sub.className = "card-sub";
    sub.textContent = r.where;
    card.appendChild(sub);
    grid.appendChild(card);
  });
  content.querySelector(".section").appendChild(grid);
});

// ===== Utilitare =====
$("#brand").addEventListener("click", () => { $("#searchInput").value = ""; renderHome(); });
function countVideos(node) {
  let n = node.videos.length;
  node.subcategories.forEach((s) => (n += countVideos(s)));
  return n;
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
