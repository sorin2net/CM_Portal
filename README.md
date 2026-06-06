# Creative Monkeyz Portal

**Un portal-tribut neoficial** care adună într-un singur loc, organizat ca un "Netflix", videoclipurile canalelor de YouTube [Creative Monkeyz](https://www.youtube.com/@CreativeMonkeyzArmy): de la *Robotzi* la gaming, muzică, interviuri, momente de pe stream și reacții.

**Live:** https://sorin2net.github.io/CM_Portal/

*LLTCM, Long Live The Creative Monkeyz.*

---

## Ce este

Creative Monkeyz Portal este o interfață prin care poți răsfoi o colecție mare de clipuri Creative Monkeyz, împărțită pe **categorii**, **subcategorii** și **sezoane**. Alegi o categorie, vezi ce conține și pornești clipul într-un player cu butoane de *pauză, următorul, anteriorul, fullscreen, ieșire*, exact ca pe YouTube.

Videoclipurile **nu sunt găzduite aici**: ele rulează direct din playerul oficial YouTube (embed). Astfel creatorii își păstrează vizualizările, site-ul rămâne mic, gratuit și permanent, iar totul e legal și ordonat ca într-o bibliotecă.

## Ce conține

Peste **740 de videoclipuri** în **11 categorii**:

| Categorie | Conținut |
|---|---|
| **RObotzi** | Sezoanele 1-5 complete (cu titlurile reale ale episoadelor), Extras, Songs |
| **IOBAGG** | Gaming: OUTLAST, PUBG, Resident Evil, Wolfenstein, Dead Space, Dying Light, Titanfall, Battlefield, DOOM, Call of Duty și multe altele |
| **CODIN&RAMO** | Podcasturi, interviuri, conferințe (EECC, Ice Comic Con), DPS, PUNCT, ALTCEVA |
| **3lar** | Toate edițiile, pe ani (2013-2019) |
| **PIRAMIDA, RENDAM, MiEZ** | Seriile muzicale și de divertisment |
| **CSP, NinjaRamo, MONSTRII Recomand** | Gameplay, muzică, recomandări |
| **CM Clips** | Canalul de clips: reacții, știri, gaming, DePeStream, politică |

## Funcționalități

- Răsfoire stil Netflix, cu poze de copertă reale și buton de Înapoi
- Căutare instantanee
- Buton "Random" (un clip la întâmplare)
- "Lista mea" (favorite) și "Continuă vizionarea" (istoric), salvate în browser
- Auto-play pentru episodul următor (binge), cu buton de pornit/oprit
- Rândul "Populare", sortat după numărul de vizualizări
- Pagină dedicată jocului RObotzi Fartravel (cu gameplay)
- Meniu pe mobil și săgeți de derulare pe rânduri
- Linkuri către canalele oficiale Creative Monkeyz

## Scop

Să existe un loc unde fanii pot vedea aproape tot conținutul Creative Monkeyz, sortat și organizat frumos, ușor de navigat: un arhivar de tribut pentru un canal îndrăgit.

## Cum funcționează (tehnic)

Site static, fără server: `HTML + CSS + JavaScript` simplu, care citește un fișier `catalog.json`. Găzduit gratuit pe **GitHub Pages**.

```
index.html        interfata
styles.css        designul
app.js            navigarea, cautarea, playerul
catalog.json      biblioteca (generata automat)
assets/           logo, banner, iconita Fartravel
scripts/          unelte care construiesc catalogul
data/             liste YouTube si completari manuale
publica.bat       buton de actualizare (build + urcare)
```

## Cum se actualizează / extinde

Rulează (sau dă dublu-click pe `publica.bat`):

```bash
node scripts/build-all.js
```

Pipeline-ul: scanează arhiva, potrivește cu YouTube, potrivește pe playlist-uri, aplică completări manuale, pune titluri reale la Robotzi, adaugă jocurile și clipurile de pe canal, aplică vizualizările și verifică pozele.

- **Clip fără link?** Adaugă-l în `data/manual-ids.json` sub forma `"cale/fisier.mp4": "ID_YouTube"`.
- **Vrei numerele de vizualizări actualizate?** Rulează din nou `node scripts/fetch-views.js` (sau comanda de descărcare a vizualizărilor).

## Credite

Tot conținutul aparține creatorilor **[Creative Monkeyz](https://www.youtube.com/@CreativeMonkeyzArmy)**. Dacă îți place, urmărește-i și susține-i pe canalele oficiale.

## Disclaimer

Acesta este un **proiect neoficial, făcut de un fan**, neafiliat cu Creative Monkeyz. Nu găzduiește și nu redistribuie fișiere video, ci doar încorporează clipuri publice de pe YouTube. Toate drepturile aparțin deținătorilor de drept.

*LLTCM, Long Live The Creative Monkeyz.*
