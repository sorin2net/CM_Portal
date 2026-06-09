# Creative Monkeyz Portal

**Un portal-tribut neoficial** care adună într-un singur loc, organizat pe categorii și sezoane, videoclipurile canalelor de YouTube [Creative Monkeyz](https://www.youtube.com/@CreativeMonkeyzArmy): de la *Robotzi* la gaming, muzică, interviuri, momente de pe stream și reacții.

**Live:** https://sorin2net.github.io/CM_Portal/

*LLTCM.*

---

## Ce este

Creative Monkeyz Portal este o interfață prin care poți răsfoi o colecție mare de clipuri Creative Monkeyz, împărțită pe **categorii**, **subcategorii** și **sezoane**. Alegi o categorie, vezi ce conține și pornești clipul într-un player cu butoane de *pauză, următorul, anteriorul, fullscreen, ieșire*, exact ca pe YouTube.

Videoclipurile **nu sunt găzduite aici**: ele rulează direct din playerul oficial YouTube (embed). Astfel creatorii își păstrează vizualizările, site-ul rămâne mic, gratuit și permanent, iar totul e legal și ordonat ca într-o bibliotecă.

## Ce conține

Peste **740 de videoclipuri** în **11 categorii**:

| Categorie | Conținut |
|---|---|
| **RObotzi** | Sezoanele 1-5 complete (cu titlurile reale ale episoadelor), Extras, Songs |
| **IOBAGG** | Gaming: OUTLAST, PUBG, Resident Evil, Wolfenstein, Dead Space, Dying Light, Titanfall, Battlefield, DOOM, Call of Duty si multe altele |
| **CODIN&RAMO** | Podcasturi, interviuri, conferinte (EECC, Ice Comic Con), DPS, PUNCT, ALTCEVA |
| **3lar** | Toate editiile, pe ani (2013-2019) |
| **PIRAMIDA, RENDAM, MiEZ** | Seriile muzicale si de divertisment |
| **CSP, NinjaRamo, MONSTRII Recomand** | Gameplay, muzica, recomandari |
| **CM Clips** | Canalul de clips: reactii, stiri, gaming, DePeStream, politica |

## Funcționalități

- Răsfoire pe categorii, cu poze de copertă reale și buton de Înapoi
- Căutare instantanee
- Buton "Random" (un clip la întâmplare) si "Pick-ul zilei" (recomandare care se schimbă zilnic)
- "Lista mea" (favorite) și "Continuă vizionarea" (istoric), salvate în browser
- Auto-play pentru episodul următor (binge), cu buton de pornit/oprit
- Rândul "Populare" (după vizualizări) și durata afișată pe fiecare clip
- Sortare în interiorul unei categorii (A-Z, Z-A, cele mai vizionate, cele mai noi)
- Comutator de culoare de accent (6 teme)
- Pagină dedicată jocului RObotzi Fartravel (cu gameplay)
- Meniu pe mobil și săgeți de derulare pe rânduri
- Instalabilă ca aplicație (PWA), funcționează și offline (interfața)
- Previzualizare frumoasă la share (Open Graph) pe WhatsApp/Facebook
- Linkuri către canalele oficiale Creative Monkeyz
- Mic easter egg: scrie "lltcm" în căutare sau folosește codul Konami

## Instalare ca aplicație (PWA)

Pe telefon sau PC, din browser, alege "Instalează aplicația" / "Add to Home screen". Portalul se deschide ca o aplicație separată, cu iconița Creative Monkeyz, și pornește instant. Interfața funcționează și offline (clipurile au nevoie de internet, fiind de pe YouTube).

Fiind o aplicație web (PWA), poate fi împachetată ulterior și pentru Google Play (printr-un TWA, de exemplu cu PWABuilder sau Bubblewrap).

## Cum funcționează (tehnic)

Site static, fără server: `HTML + CSS + JavaScript` simplu, care citește un fișier `catalog.json`. Găzduit gratuit pe **GitHub Pages**.

```
index.html        interfata
styles.css        designul
app.js            navigarea, cautarea, playerul, functiile
catalog.json      biblioteca (generata automat)
manifest.json     configuratia PWA (aplicatie instalabila)
sw.js             service worker (cache + offline)
assets/           logo, banner, iconite PWA, imagine Open Graph
scripts/          unelte care construiesc catalogul
data/             liste YouTube si completari manuale
publica.bat       buton de actualizare (build + urcare pe GitHub)
```

## Scripturi

Toata constructia catalogului ruleaza cu o singura comanda (sau dublu-click pe `publica.bat`):

```bash
node scripts/build-all.js
```

Pipeline-ul, in ordine:

1. `build-catalog.js` - scaneaza folderul local `CM` si genereaza structura
2. `match-youtube.js` - potriveste fisierele cu clipurile de pe canal
3. `match-pass2.js` - potriveste pe playlist-uri (Piramida, Rendam, OUTLAST cu cifre romane etc.)
4. `apply-manual.js` - aplica ID-urile completate manual din `data/manual-ids.json`
5. `prettify-titles.js` - pune titlurile reale la episoadele Robotzi
6. `add-games.js` - adauga seriile de jocuri de pe canal sub IOBAGG
7. `add-clips.js` - adauga categoria CM Clips (canalul de clips/reactii)
8. `apply-views.js` - aplica vizualizarile, durata si data publicarii (Populare, badge durata, sortari)
9. `check-thumbs.js` - detecteaza pozele goale si le pune un placeholder

Unelte separate (se ruleaza ocazional):

- `fetch-views.js` - descarca metadatele (vizualizari, durata, data), lent, in `data/meta-raw.txt`
- `generate-assets.py` - genereaza imaginea Open Graph, feature graphic-ul si iconitele PWA (necesita Python + Pillow)

## Cum se actualizează / extinde

- **Clip fără link?** Adaugă-l în `data/manual-ids.json` sub forma `"cale/fisier.mp4": "ID_YouTube"`, apoi rulează `node scripts/build-all.js`.
- **Vizualizări actualizate?** Rulează `node scripts/fetch-views.js`, apoi `node scripts/build-all.js`.
- **Publicare:** orice modificare se urcă pe GitHub cu `publica.bat` (sau `git add -A && git commit -m "..." && git push`). GitHub Pages publică automat în circa un minut.

## Credite

Tot conținutul aparține creatorilor **[Creative Monkeyz](https://www.youtube.com/@CreativeMonkeyzArmy)**. Dacă îți place, urmărește-i și susține-i pe canalele oficiale.

## Disclaimer

Acesta este un **proiect neoficial, făcut de un fan**, neafiliat cu Creative Monkeyz. Nu găzduiește și nu redistribuie fișiere video, ci doar încorporează clipuri publice de pe YouTube. Toate drepturile aparțin deținătorilor de drept.

*LLTCM.*
