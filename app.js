let CATALOG = null;
let pathStack = [];
let playerList = [];
let playerIndex = 0;
let playerWhere = "";
let flatVideos = null;
let videoIndex = null;
let ytPlayer = null;
let ytReady = false;
let autoNext = localStorage.getItem("cmp_auto") !== "0";

const $ = (s) => document.querySelector(s);
const content = $("#content");

const YT_ICON = '<svg viewBox="0 0 24 24"><path d="M23 12s0-3.5-.45-5.18a2.78 2.78 0 0 0-1.95-1.96C18.88 4.4 12 4.4 12 4.4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.45 6.82C1 8.5 1 12 1 12s0 3.5.45 5.18a2.78 2.78 0 0 0 1.95 1.96c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.95-1.96C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>';
const FOLDER_ICON = '<svg viewBox="0 0 24 24"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>';
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-6.7-4.3-9.3-8.3C1 10 2 6.2 5.6 6.2c2 0 3.3 1.3 4.4 2.7 1.1-1.4 2.4-2.7 4.4-2.7 3.6 0 4.6 3.8 2.9 6.5C18.7 16.7 12 21 12 21z"/></svg>';

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

(function () { const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); })();
window.onYouTubeIframeAPIReady = function () { ytReady = true; };

fetch("catalog.json?t=" + Date.now())
  .then((r) => r.json())
  .then((data) => {
    CATALOG = data;
    renderFooter();
    updateAutoBtn();
    history.replaceState({ v: "home" }, "");
    doHome();
  })
  .catch((err) => { content.innerHTML = '<p class="empty-msg">Nu am putut incarca catalog.json. Deschide pagina printr-un server local.</p>'; console.error(err); });

window.addEventListener("popstate", (e) => render(e.state || { v: "home" }));

function render(state) {
  if (state.v === "about") return doAbout();
  if (state.v === "fartravel") return doFartravel();
  if (state.v === "node") { const chain = resolvePath(state.path); if (chain && chain.length) return doNode(chain); }
  doHome();
}
function applyState(state) { history.pushState(state, ""); render(state); }
function closeMenu() { $(".nav").classList.remove("open"); }
function navHome() { closeMenu(); $("#searchInput").value = ""; applyState({ v: "home" }); }
function navAbout() { closeMenu(); applyState({ v: "about" }); }
function navFartravel() { closeMenu(); applyState({ v: "fartravel" }); }
function navNode(chain) { applyState({ v: "node", path: chain.map((n) => n.name) }); }
function resolvePath(names) {
  let nodes = CATALOG.categories, chain = [];
  for (const nm of names) { const n = nodes.find((x) => x.name === nm); if (!n) return null; chain.push(n); nodes = n.subcategories; }
  return chain;
}

function stripEmoji(s) { return String(s).replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu, "").replace(/\s{2,}/g, " ").trim(); }
function escapeHtml(s) { return stripEmoji(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function countVideos(node) { let n = node.videos.length; node.subcategories.forEach((s) => (n += countVideos(s))); return n; }
function thumb(id, q) { return `https://img.youtube.com/vi/${id}/${q || "mqdefault"}.jpg`; }
function coverId(node) {
  if (node.__cover !== undefined) return node.__cover;
  let id = null;
  for (const v of node.videos) if (v.youtubeId && !v.noThumb) { id = v.youtubeId; break; }
  if (!id) for (const s of node.subcategories) { const c = coverId(s); if (c) { id = c; break; } }
  node.__cover = id;
  return id;
}
function getVideoIndex() {
  if (videoIndex) return videoIndex;
  videoIndex = {};
  (function w(n, p) {
    n.videos.forEach((v) => { if (v.youtubeId && !videoIndex[v.youtubeId]) videoIndex[v.youtubeId] = { title: v.title, where: p, youtubeId: v.youtubeId, noThumb: v.noThumb }; });
    n.subcategories.forEach((s) => w(s, p ? p + " › " + s.name : s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  return videoIndex;
}
function getPopular(n) {
  const arr = [];
  (function w(node, p) {
    node.videos.forEach((v) => { if (v.youtubeId && v.views) arr.push({ title: v.title, youtubeId: v.youtubeId, where: p, views: v.views, noThumb: v.noThumb }); });
    node.subcategories.forEach((s) => w(s, p ? p + " › " + s.name : s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  arr.sort((a, b) => b.views - a.views);
  const seen = new Set(); const uniq = [];
  for (const v of arr) { if (!seen.has(v.youtubeId)) { seen.add(v.youtubeId); uniq.push(v); } }
  return uniq.slice(0, n);
}
function fmtDur(s) { s = Math.round(s || 0); if (!s) return ""; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0"); }
function getRecent(n) {
  const arr = [];
  (function w(node, p) {
    node.videos.forEach((v) => { if (v.youtubeId && v.date) arr.push({ title: v.title, youtubeId: v.youtubeId, where: p, date: v.date, duration: v.duration, noThumb: v.noThumb }); });
    node.subcategories.forEach((s) => w(s, p ? p + " › " + s.name : s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  arr.sort((a, b) => b.date.localeCompare(a.date));
  const seen = new Set(); const u = [];
  for (const v of arr) { if (!seen.has(v.youtubeId)) { seen.add(v.youtubeId); u.push(v); } }
  return u.slice(0, n);
}
function buildFlat() {
  if (flatVideos) return flatVideos;
  const out = [];
  (function w(node, p) {
    node.videos.forEach((v) => { if (v.youtubeId) out.push({ title: v.title, youtubeId: v.youtubeId, where: p }); });
    node.subcategories.forEach((s) => w(s, p ? p + " › " + s.name : s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  flatVideos = out;
  return out;
}
function playRandom() { const list = buildFlat(); if (list.length) openPlayer(list, Math.floor(Math.random() * list.length), ""); }

const FAV_KEY = "cmp_fav", HIST_KEY = "cmp_hist";
function getFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
function isFav(id) { return getFavs().includes(id); }
function toggleFav(id) { const a = getFavs(); const i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.unshift(id); localStorage.setItem(FAV_KEY, JSON.stringify(a)); }
function getHist() { try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch (e) { return []; } }
function pushHist(id) { if (!id) return; let a = getHist().filter((x) => x !== id); a.unshift(id); localStorage.setItem(HIST_KEY, JSON.stringify(a.slice(0, 30))); }

const WATCHED_KEY = "cmp_watched";
function getWatched() { try { return JSON.parse(localStorage.getItem(WATCHED_KEY)) || {}; } catch (e) { return {}; } }
function isWatched(id) { return !!getWatched()[id]; }
function markWatched(id) { if (!id) return; const w = getWatched(); w[id] = 1; localStorage.setItem(WATCHED_KEY, JSON.stringify(w)); }

const ACCENTS = [
  ["Rosu", "#ff2740", "#c01228"],
  ["Galben", "#ffb800", "#cc8f00"],
  ["Albastru", "#3b82f6", "#2563eb"],
  ["Verde", "#22c55e", "#16a34a"],
  ["Mov", "#a855f7", "#7e22ce"],
  ["Roz", "#ec4899", "#be185d"],
];
function applyAccent(i) {
  const a = ACCENTS[i] || ACCENTS[0];
  document.documentElement.style.setProperty("--red", a[1]);
  document.documentElement.style.setProperty("--red-dim", a[2]);
  localStorage.setItem("cmp_accent", i);
  const b = $("#btnAccent"); if (b) b.style.background = a[1];
}
function initAccent() {
  applyAccent(+(localStorage.getItem("cmp_accent") || 0));
  const pop = $("#accentPop"); if (!pop) return;
  pop.innerHTML = "";
  ACCENTS.forEach((a, i) => { const d = document.createElement("button"); d.className = "accent-dot"; d.style.background = a[1]; d.title = a[0]; d.onclick = () => { applyAccent(i); pop.hidden = true; }; pop.appendChild(d); });
}

function setActiveNav(which) {
  $("#navHome").classList.toggle("active", which === "home");
  $("#navAbout").classList.toggle("active", which === "about");
  $("#navFartravel").classList.toggle("active", which === "fartravel");
}

function backButton() { const b = document.createElement("button"); b.className = "back-btn"; b.innerHTML = "&#8249; &Icirc;napoi"; b.onclick = () => history.back(); return b; }
function navBar(breadcrumbEl) { const bar = document.createElement("div"); bar.className = "navbar"; bar.appendChild(backButton()); bar.appendChild(breadcrumbEl); return bar; }
function simpleBreadcrumb(label) {
  const bc = document.createElement("nav"); bc.className = "breadcrumb";
  const home = document.createElement("a"); home.textContent = "Acasă"; home.onclick = navHome; bc.appendChild(home);
  const sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; bc.appendChild(sep);
  const cur = document.createElement("span"); cur.className = "current"; cur.textContent = label; bc.appendChild(cur);
  return bc;
}

function makeCover(id, noThumb) {
  const cover = document.createElement("div"); cover.className = "cover";
  if (id && !noThumb) {
    const img = document.createElement("img"); img.loading = "lazy"; img.alt = "";
    img.onerror = () => { cover.classList.add("no-thumb"); img.remove(); };
    img.src = thumb(id, "mqdefault");
    cover.appendChild(img);
  } else { cover.classList.add("no-thumb"); }
  return cover;
}
function folderCard(node, chain) {
  const el = document.createElement("div"); el.className = "card";
  el.appendChild(makeCover(coverId(node)));
  const badge = document.createElement("div"); badge.className = "badge-folder"; badge.innerHTML = FOLDER_ICON + countVideos(node); el.appendChild(badge);
  const label = document.createElement("div"); label.className = "card-label"; label.innerHTML = `<div class="card-title">${escapeHtml(node.name)}</div>`; el.appendChild(label);
  el.onclick = () => navNode(chain);
  return el;
}
function videoCard(video, list, index, where) {
  const el = document.createElement("div"); el.className = "card";
  const cover = makeCover(video.youtubeId, video.noThumb);
  const pb = document.createElement("div"); pb.className = "play-badge"; pb.innerHTML = "<i></i>"; cover.appendChild(pb);
  if (video.youtubeId) {
    const fav = document.createElement("button");
    fav.className = "fav-btn" + (isFav(video.youtubeId) ? " on" : "");
    fav.innerHTML = HEART; fav.title = "Lista mea";
    fav.onclick = (e) => { e.stopPropagation(); toggleFav(video.youtubeId); fav.classList.toggle("on"); };
    cover.appendChild(fav);
  }
  if (video.youtubeId && isWatched(video.youtubeId)) { const wb = document.createElement("div"); wb.className = "watched-badge"; wb.innerHTML = "&#10003; v&#259;zut"; cover.appendChild(wb); }
  if (video.duration) { const db = document.createElement("div"); db.className = "dur-badge"; db.textContent = fmtDur(video.duration); cover.appendChild(db); }
  el.appendChild(cover);
  if (!video.youtubeId) { const nl = document.createElement("div"); nl.className = "badge-nolink"; nl.innerHTML = "f&#259;r&#259; link"; el.appendChild(nl); }
  const label = document.createElement("div"); label.className = "card-label";
  label.innerHTML = `<div class="card-title">${escapeHtml(video.title)}</div>${where ? `<div class="card-where">${escapeHtml(where)}</div>` : ""}`;
  el.appendChild(label);
  el.onclick = () => openPlayer(list, index, where || video.where || "");
  return el;
}
function videoRow(items) {
  const row = document.createElement("div"); row.className = "row";
  items.forEach((v, i) => row.appendChild(videoCard(v, items, i, v.where)));
  return row;
}
function wrapRow(row) {
  const wrap = document.createElement("div"); wrap.className = "row-wrap";
  const L = document.createElement("button"); L.className = "row-arrow left"; L.innerHTML = "&#8249;";
  const R = document.createElement("button"); R.className = "row-arrow right"; R.innerHTML = "&#8250;";
  L.onclick = () => row.scrollBy({ left: -row.clientWidth * 0.85, behavior: "smooth" });
  R.onclick = () => row.scrollBy({ left: row.clientWidth * 0.85, behavior: "smooth" });
  wrap.append(L, row, R);
  return wrap;
}
function appendSection(title, count, rowWrapEl, moreFn) {
  const sec = document.createElement("section"); sec.className = "section";
  const head = document.createElement("div"); head.className = "section-head";
  head.innerHTML = `<h2>${escapeHtml(title)}</h2>` + (count ? `<span class="count">${escapeHtml(count)}</span>` : "");
  if (moreFn) { const m = document.createElement("span"); m.className = "more"; m.textContent = "Vezi tot ›"; m.onclick = moreFn; head.appendChild(m); }
  sec.appendChild(head); sec.appendChild(rowWrapEl); content.appendChild(sec);
}

function doHome() {
  setActiveNav("home"); pathStack = []; window.scrollTo(0, 0); content.innerHTML = "";
  const hero = document.createElement("section"); hero.className = "hero";
  hero.innerHTML = `
    <div class="hero-bg"><img src="assets/cm-banner.jpg" alt=""></div>
    <div class="hero-inner">
      <img class="hero-logo" src="assets/cm-logo.jpg" alt="">
      <h1>Creative Monkeyz <b>Portal</b></h1>
      <p>O colec&#539;ie organizat&#259; cu drag a show-urilor Creative Monkeyz: de la Robotzi la gaming, muzic&#259;, interviuri &#537;i momente de pe stream. Toate la un loc, gata de vizionat.</p>
      <div class="hero-stats">
        <div class="hero-stat"><b>${CATALOG.categories.length}</b><span>Categorii</span></div>
        <div class="hero-stat"><b>${CATALOG.stats.videos}</b><span>Videoclipuri</span></div>
        <div class="hero-stat"><b>1.44M</b><span>Abona&#539;i CM</span></div>
      </div>
    </div>`;
  content.appendChild(hero);

  const pickPool = (function () { const p = getPopular(150); return p.length ? p : Object.values(getVideoIndex()); })();
  if (pickPool.length) {
    const pick = pickPool[Math.floor(Date.now() / 86400000) % pickPool.length];
    const feat = document.createElement("section"); feat.className = "featured";
    feat.innerHTML = `
      <div class="feat-thumb">${pick.youtubeId && !pick.noThumb ? `<img src="${thumb(pick.youtubeId, "hqdefault")}" alt="" onerror="this.remove()">` : ""}<div class="play-badge"><i></i></div></div>
      <div class="feat-info"><span class="feat-tag">Pick-ul zilei</span><h3>${escapeHtml(pick.title)}</h3><div class="feat-where">${escapeHtml(pick.where || "")}</div><button class="ctrl feat-play">Red&#259; acum</button></div>`;
    const play = () => openPlayer([pick], 0, pick.where || "");
    feat.querySelector(".feat-thumb").onclick = play;
    feat.querySelector(".feat-play").onclick = play;
    content.appendChild(feat);
  }

  const idx = getVideoIndex();
  const hist = getHist().map((id) => idx[id]).filter(Boolean);
  if (hist.length) appendSection("Continuă vizionarea", null, wrapRow(videoRow(hist)));
  const favs = getFavs().map((id) => idx[id]).filter(Boolean);
  if (favs.length) appendSection("Lista mea", null, wrapRow(videoRow(favs)));
  const recent = getRecent(18);
  if (recent.length) appendSection("Adăugate recent", null, wrapRow(videoRow(recent)));
  const pop = getPopular(24);
  if (pop.length) appendSection("Populare", null, wrapRow(videoRow(pop)));

  CATALOG.categories.forEach((cat) => {
    const row = document.createElement("div"); row.className = "row";
    cat.subcategories.forEach((sub) => row.appendChild(folderCard(sub, [cat, sub])));
    cat.videos.forEach((v, i) => row.appendChild(videoCard(v, cat.videos, i, cat.name)));
    appendSection(cat.name, countVideos(cat) + " clipuri", wrapRow(row), cat.subcategories.length ? () => navNode([cat]) : null);
  });
}

function doNode(chain) {
  setActiveNav(null); pathStack = chain.slice();
  const node = chain[chain.length - 1];
  window.scrollTo(0, 0); content.innerHTML = "";
  content.appendChild(navBar(buildBreadcrumb()));
  const id = coverId(node);
  const head = document.createElement("div"); head.className = "page-head";
  head.innerHTML = `
    ${id ? `<img class="page-head-cover" src="${thumb(id, "hqdefault")}" alt="" onerror="this.remove()">` : ""}
    <div><h1>${escapeHtml(node.name)}</h1><div class="sub">${countVideos(node)} clipuri${node.subcategories.length ? " · " + node.subcategories.length + " sec&#539;iuni" : ""}</div></div>`;
  content.appendChild(head);
  const where = pathStack.map((n) => n.name).join(" › ");
  if (node.subcategories.length) {
    const sec = document.createElement("section"); sec.className = "section";
    sec.innerHTML = `<div class="section-head"><h2>Sec&#539;iuni</h2><span class="count">${node.subcategories.length}</span></div>`;
    const grid = document.createElement("div"); grid.className = "grid";
    node.subcategories.forEach((sub) => grid.appendChild(folderCard(sub, [...pathStack, sub])));
    sec.appendChild(grid); content.appendChild(sec);
  }
  if (node.videos.length) {
    const sec = document.createElement("section"); sec.className = "section";
    sec.innerHTML = `<div class="section-head"><h2>Videoclipuri</h2><span class="count">${node.videos.length}</span>
      <select class="sort-sel"><option value="def">Ordine implicit&#259;</option><option value="az">A - Z</option><option value="za">Z - A</option><option value="views">Cele mai vizionate</option><option value="new">Cele mai noi</option></select></div>`;
    const grid = document.createElement("div"); grid.className = "grid";
    function fill(mode) {
      grid.innerHTML = "";
      let arr = node.videos.slice();
      if (mode === "az") arr.sort((a, b) => a.title.localeCompare(b.title, "ro"));
      else if (mode === "za") arr.sort((a, b) => b.title.localeCompare(a.title, "ro"));
      else if (mode === "views") arr.sort((a, b) => (b.views || 0) - (a.views || 0));
      else if (mode === "new") arr.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      arr.forEach((v, i) => grid.appendChild(videoCard(v, arr, i, where)));
    }
    fill("def");
    sec.querySelector(".sort-sel").onchange = (e) => fill(e.target.value);
    sec.appendChild(grid); content.appendChild(sec);
  }
}

function buildBreadcrumb() {
  const bc = document.createElement("nav"); bc.className = "breadcrumb";
  const home = document.createElement("a"); home.textContent = "Acasă"; home.onclick = navHome; bc.appendChild(home);
  pathStack.forEach((node, i) => {
    const sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; bc.appendChild(sep);
    if (i === pathStack.length - 1) { const cur = document.createElement("span"); cur.className = "current"; cur.textContent = node.name; bc.appendChild(cur); }
    else { const a = document.createElement("a"); a.textContent = node.name; a.onclick = () => navNode(pathStack.slice(0, i + 1)); bc.appendChild(a); }
  });
  return bc;
}

function doAbout() {
  setActiveNav("about"); pathStack = []; window.scrollTo(0, 0); content.innerHTML = "";
  content.appendChild(navBar(simpleBreadcrumb("Despre")));
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="about">
      <div class="about-card">
        <h2>Despre <b>proiect</b></h2>
        <p>Creative Monkeyz Portal este un proiect-tribut neoficial, făcut de un fan. Adună într-un singur loc, organizat pe categorii şi sezoane, show-urile care ne-au făcut să râdem: <b>Robotzi</b>, <b>IOBAGG</b>, <b>3lar</b>, <b>Piramida</b>, <b>Rendam</b>, interviuri, muzică şi zeci de gameplay-uri (Wolfenstein, Dying Light, Dead Space, Call of Duty şi multe altele).</p>
        <p>Videoclipurile rulează direct de pe YouTube, prin player-ul oficial, astfel încât creatorii îşi păstrează vizualizările, iar tu ai totul ordonat ca într-o bibliotecă.</p>
        <p class="muted">${CATALOG.stats.videos} videoclipuri în ${CATALOG.categories.length} categorii.</p>
      </div>
      <div class="about-card">
        <img class="credit-logo" src="assets/cm-logo.jpg" alt="">
        <h2>Credite</h2>
        <p>Tot conţinutul aparţine creatorilor <b>Creative Monkeyz</b>. Dacă îţi place, urmăreşte-i şi susţine-i pe canalele oficiale:</p>
        ${socialsHtml()}
        <p class="muted" style="margin-top:16px">Portal neoficial, neafiliat cu canalul. Realizat din respect pentru munca lor.</p>
        <p class="lltcm-sign">LLTCM · Long Live The Creative Monkeyz</p>
      </div>
    </div>`;
  content.appendChild(wrap);
}

function doFartravel() {
  setActiveNav("fartravel"); pathStack = []; window.scrollTo(0, 0); content.innerHTML = "";
  content.appendChild(navBar(simpleBreadcrumb("Fartravel")));
  const wrap = document.createElement("div"); wrap.className = "fartravel";
  wrap.innerHTML = `
    <div class="ft-card">
      <img class="ft-logo" src="assets/fartravel-icon.png" alt="RObotzi Fartravel">
      <h1>RObotzi <b>Fartravel</b></h1>
      <p class="ft-tag">„How fart can you travel?"</p>
      <p>O aventură prin spaţiu cu <b>MO</b> şi <b>F.O.C.A.</b>, din serialul RObotzi. După ce MO a folosit piese de navă ca să repare o staţie orbitală, cei doi pornesc spre casă pe o rablă spaţială, navigând cu ajutorul „reactorului cu fasole" al lui MO. Ai doar 5 apăsări, aşa că adună boabele spaţiale ca să te realimentezi şi să mergi mai departe. Strânge 20 de boabe şi apare o fasole secretă specială! Disponibil în engleză şi română.</p>
      <div class="ft-video"><iframe src="https://www.youtube.com/embed/iIkoraEr4K4?rel=0&modestbranding=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
      <p class="ft-note">Joc creat de Creative Monkeyz.</p>
    </div>`;
  content.appendChild(wrap);
}

function renderFooter() {
  $("#siteFooter").innerHTML = `
    <div class="footer-inner">
      <div>
        <div class="footer-brand"><img src="assets/cm-logo.jpg" alt=""> Creative Monkeyz Portal</div>
        <p class="footer-note">Proiect-tribut neoficial făcut de un fan. Tot conţinutul aparţine Creative Monkeyz; videoclipurile sunt redate de pe YouTube. Neafiliat oficial cu canalul.</p>
        <p class="lltcm-sign">LLTCM · Long Live The Creative Monkeyz</p>
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
  $("#playerTitle").textContent = stripEmoji(v.title);
  $("#playerWhere").textContent = stripEmoji(v.where || playerWhere);
  pushHist(v.youtubeId);
  markWatched(v.youtubeId);
  if (v.youtubeId) {
    if (ytReady && window.YT && YT.Player) {
      if (ytPlayer && ytPlayer.loadVideoById) ytPlayer.loadVideoById(v.youtubeId);
      else { playerFrame.innerHTML = '<div id="ytplayer"></div>'; ytPlayer = new YT.Player("ytplayer", { videoId: v.youtubeId, playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 }, events: { onStateChange: onYtState } }); }
    } else {
      playerFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    }
  } else {
    ytPlayer = null;
    playerFrame.innerHTML = '<div class="player-empty">Acest clip nu are încă un <b>link YouTube</b>.<br>Face parte din arhiva locală.</div>';
  }
  $("#btnPrev").disabled = playerIndex <= 0;
  $("#btnNext").disabled = playerIndex >= playerList.length - 1;
}
function onYtState(e) { if (e.data === 0 && autoNext && playerIndex < playerList.length - 1) { playerIndex++; showCurrentVideo(); } }
function closePlayer() {
  overlay.hidden = true;
  if (ytPlayer && ytPlayer.destroy) { try { ytPlayer.destroy(); } catch (e) {} }
  ytPlayer = null; playerFrame.innerHTML = ""; document.body.style.overflow = "";
}
function updateAutoBtn() { const b = $("#btnAuto"); if (!b) return; b.textContent = "Auto-play: " + (autoNext ? "ON" : "OFF"); b.classList.toggle("on", autoNext); }

$("#btnClose").onclick = closePlayer;
$("#btnPrev").onclick = () => { if (playerIndex > 0) { playerIndex--; showCurrentVideo(); } };
$("#btnNext").onclick = () => { if (playerIndex < playerList.length - 1) { playerIndex++; showCurrentVideo(); } };
$("#btnFullscreen").onclick = () => { const el = playerFrame.querySelector("iframe") || playerFrame; if (el.requestFullscreen) el.requestFullscreen(); };
$("#btnAuto").onclick = () => { autoNext = !autoNext; localStorage.setItem("cmp_auto", autoNext ? "1" : "0"); updateAutoBtn(); };
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
  if (q === "lltcm" || q === "banana" || q === "maimuta" || q === "aloha") { e.target.value = ""; lltcmRain(); doHome(); return; }
  setActiveNav(null); pathStack = [];
  const results = [];
  (function walk(node, prefix) {
    node.videos.forEach((v) => { if (v.title.toLowerCase().includes(q)) results.push({ v, where: prefix }); });
    node.subcategories.forEach((s) => walk(s, prefix + " › " + s.name));
  })({ videos: [], subcategories: CATALOG.categories }, "");
  window.scrollTo(0, 0); content.innerHTML = "";
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

let logoClicks = 0, logoTimer = null;
$("#brand").onclick = () => {
  navHome();
  logoClicks++; clearTimeout(logoTimer); logoTimer = setTimeout(() => (logoClicks = 0), 1200);
  if (logoClicks >= 7) { logoClicks = 0; lltcmRain(); }
};
$("#navHome").onclick = navHome;
$("#navAbout").onclick = navAbout;
$("#navFartravel").onclick = navFartravel;
$("#btnRandom").onclick = playRandom;
$("#btnMenu").onclick = () => $(".nav").classList.toggle("open");
$("#btnAccent").onclick = (e) => { e.stopPropagation(); const p = $("#accentPop"); p.hidden = !p.hidden; };
document.addEventListener("click", (e) => { const p = $("#accentPop"); if (p && !p.hidden && !p.contains(e.target) && e.target !== $("#btnAccent")) p.hidden = true; });
initAccent();

let deferredPrompt = null;
if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) $("#btnInstall").hidden = true;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; });
window.addEventListener("appinstalled", () => { deferredPrompt = null; $("#btnInstall").hidden = true; });
$("#btnInstall").onclick = async () => {
  if (deferredPrompt) { deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch (e) {} deferredPrompt = null; $("#btnInstall").hidden = true; return; }
  cmpToast("Pentru instalare: in Chrome/Edge deschide meniul (3 puncte) si alege 'Instaleaza aplicatia'. Pe iPhone: Share, apoi 'Add to Home Screen'.", 7000);
};

function lltcmRain() {
  for (let i = 0; i < 40; i++) {
    const b = document.createElement("div");
    b.className = "lltcm-drop"; b.textContent = "LLTCM";
    b.style.left = Math.random() * 100 + "vw";
    b.style.fontSize = 20 + Math.random() * 30 + "px";
    b.style.animationDuration = 2 + Math.random() * 2.8 + "s";
    b.style.animationDelay = Math.random() * 0.7 + "s";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }
  cmpToast("LLTCM. Long Live The Creative Monkeyz");
}
function cmpToast(msg, ms) {
  const t = document.createElement("div"); t.className = "cmp-toast"; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 350); }, ms || 2800);
}
(function () {
  const seq = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let pos = 0;
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === seq[pos]) { pos++; if (pos === seq.length) { pos = 0; lltcmRain(); } }
    else { pos = k === seq[0] ? 1 : 0; }
  });
})();
console.log("%cLLTCM. Long Live The Creative Monkeyz. Incearca codul Konami (sus sus jos jos...) sau scrie 'lltcm' in cautare.", "color:#ff2740;font-weight:bold;font-size:13px");
