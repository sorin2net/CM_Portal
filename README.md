# 🐵 Creative Monkeyz Portal

**Un portal-tribut neoficial** care adună într-un singur loc, organizat ca un „Netflix", videoclipurile canalului de YouTube [Creative Monkeyz](https://www.youtube.com/@CreativeMonkeyzArmy) — de la *Robotzi* la gaming, muzică, interviuri și momente de pe stream.

🔗 **Live:** https://sorin2net.github.io/CM_Portal/

---

## Ce este

Creative Monkeyz Portal este o interfață prin care poți răsfoi o colecție mare de clipuri Creative Monkeyz, împărțită pe **categorii**, **subcategorii** și **sezoane**. Alegi o categorie, vezi ce conține și pornești clipul într-un player cu butoane de *pauză / următorul / anteriorul / fullscreen / ieșire* — exact ca pe YouTube.

Videoclipurile **nu sunt găzduite aici**: ele rulează direct din playerul oficial YouTube (embed). Astfel:
- creatorii își păstrează vizualizările;
- site-ul rămâne mic, gratuit și permanent;
- totul e legal și ordonat ca într-o bibliotecă.

## Ce conține

**626 de videoclipuri** în **11 categorii**:

| Categorie | Conținut |
|---|---|
| **RObotzi** | Sezoanele 1–5 complete + Extras + Songs |
| **IOBAGG** | Gaming: OUTLAST, PUBG, Resident Evil, Wolfenstein, Dead Space, Dying Light, Titanfall, Battlefield, DOOM, Call of Duty și multe altele |
| **CODIN&RAMO** | Podcasturi, interviuri, conferințe (EECC, Ice Comic Con), DPS, PUNCT, ALTCEVA |
| **3lar** | Toate edițiile, pe ani (2013–2019) |
| **PIRAMIDA** · **RENDAM** · **MiEZ** | Seriile muzicale și de divertisment |
| **CSP** · **NinjaRamo** · **MONSTRII Recomand** | Gameplay, muzică, recomandări |
| **Altele de pe canal** | Restul clipurilor: giveaways, concursuri, update-uri, diverse |

## Scop

Să existe un loc unde fanii pot vedea **aproape tot** conținutul Creative Monkeyz, sortat și organizat frumos, ușor de navigat — un arhivar de tribut pentru un canal îndrăgit.

## Cum funcționează (tehnic)

Site static, fără server: `HTML + CSS + JavaScript` simplu, care citește un fișier `catalog.json`. Găzduit gratuit pe **GitHub Pages**.

```
index.html        interfața
styles.css        designul
app.js            navigarea, căutarea, playerul
catalog.json      biblioteca (generată automat)
assets/           logo + banner
scripts/          unelte care construiesc catalogul
data/             liste YouTube + completări manuale
publica.bat       buton de actualizare (build + urcare)
```

## Cum se actualizează / extinde

Rulează (sau dă dublu-click pe `publica.bat`):

```bash
node scripts/build-all.js
```

Pipeline-ul: scanează arhiva → potrivește cu YouTube → potrivește pe playlist-uri → aplică completări manuale → adaugă jocurile de pe canal.

- **Clip fără link?** Adaugă-l în `data/manual-ids.json`: `"cale/fisier.mp4": "ID_YouTube"`.
- **Mai multe jocuri/serii?** Se importă automat din listele canalului (`data/*.txt`).

## Credite

Tot conținutul aparține creatorilor **[Creative Monkeyz](https://www.youtube.com/@CreativeMonkeyzArmy)**. Dacă îți place, susține-i pe canalul oficial. ❤️

## Disclaimer

Acesta este un **proiect neoficial, făcut de un fan**, neafiliat cu Creative Monkeyz. Nu găzduiește și nu redistribuie fișiere video — doar încorporează clipuri publice de pe YouTube. Toate drepturile aparțin deținătorilor de drept.
