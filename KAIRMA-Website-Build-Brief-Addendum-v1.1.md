# KAIRMA — Website Build Brief · ADDENDUM v1.1 (IA revision)

### Append to `KAIRMA-Website-Build-Brief-Antigravity.md`. For Antigravity.

> Changes from v1: (a) add **The Foundry** (live OpenRouter model leaderboard, developer zone); (b) **remove the institutional/Lineage section** for phase 1 → reveal in phase 2; (c) replace it with **The Gallery (museum)** + **Dispatches (events/drops jump-links)**; (d) adopt **hy.pe layout grammar** (bold kinetic type, full-bleed media tiles, marquees, case-cards). All v1 Red Lines (§9) still apply.
> 

---

## A · Revised section map (one-page scroll)

**Zone the page into two registers (resolves the utility-vs-luxury clash):**

| # | Section | Zone / Mode | Status |
| --- | --- | --- | --- |
| 00 | Hero — The Boot | Instrument · Matrix | keep |
| 01 | The Belief — Manifesto | **Museum · Xuan** | keep |
| 02 | The Shift | Instrument · Matrix | keep (or merge into 03) |
| 03 | The Operating System (Agent OS) | Instrument · Matrix | keep |
| 04 | **The Foundry — model leaderboard** | Instrument · Matrix | **NEW** |
| 05 | For Builders — The Guild | Instrument · Matrix | keep · ★ primary CTA |
| 06 | **The Gallery — museum of the AI Renaissance** | **Museum · Xuan** | **NEW (replaces Lineage)** |
| 07 | **Dispatches — drops & gatherings** | Instrument · Matrix | **NEW** |
| 08 | The Invitation — close | Instrument · Matrix | keep |
| — | ~~Lineage (Web3Labs / Microsoft / institutions)~~ | — | **REMOVED → Phase 2** |

> **Phase-2 note for the agent:** build a `Lineage` component but keep it **disabled/commented** with a flag `SHOW_LINEAGE=false`; it will be re-enabled later with restraint (Microsoft via the Web3Labs framework only; do not list YZi Labs).
> 

---

## §04 · THE FOUNDRY — Model leaderboard · Instrument · Matrix Mode

**Strategic framing (critical):** position Kairma **above** the models — the orchestration layer, not a wrapper. The leaderboard proves "we route to the best, model-agnostic," and gives developers a live reason to return. Keep Kairma's frame dominant; competitors' models are the *orchestra*, Kairma is the *conductor*.

**Copy**

- Eyebrow (mono): `THE FOUNDRY · LIVE · MODEL ORCHESTRATION`
- H2: **Kairma conducts the frontier.**
- Lead: *Your employees are bound to no single mind. Kairma routes every task to the model that performs it best — and the frontier moves each week. This is the state of the orchestra, live.*
- Table caption (mono): `ROUTED CANDIDATES · ranked by real usage · via OpenRouter`
- Footnote (honest): `Rankings reflect open usage data; Kairma orchestrates across providers and is not affiliated with the labs shown.`

**Component / data**

- Live table from the **OpenRouter rankings API** (model · lab · usage/score · weekly trend ▲▼). Cache server-side (revalidate hourly); **ship a static snapshot fallback** if the API is unavailable. Respect OpenRouter ToS/attribution.
- Treatment: terminal/instrument — monospace, chrome (`#C0C0C8`) hairline rules on void (`#0B0E0B`), the **top row carries the one green (`#1FAA68`) Kairma-Light glint**. Optional thin marquee of model names above.

**Layout:** full-width panel, bold H2 left (hy.pe-style), table right/below. **Motion:** rows stream in like a readout; trend arrows tick; reduced-motion = static. **Acceptance:** reads "Kairma orchestrates these," NOT "Kairma is built on these"; live + cached fallback; no logo of any lab dominates; instrument aesthetic, not luxury.

---

## §06 · THE GALLERY — Museum of the AI Renaissance · Museum · Xuan Mode

**Concept:** a museum wing on the website. Each exhibit re-inhabits a public-domain masterwork, re-engraved as a living circuit (our cultural-core intaglio + aperture). No tech company has a museum — this is the brand's deepest moat and the clearest proof of the AI-Renaissance thesis. Doubles as the poster gallery; new works ship as drops.

**Copy**

- Eyebrow (mono): `THE GALLERY · SACRED CIRCUITRY`
- H2: **See the canon through Kairma.**
- Lead: *Each work re-inhabits a masterpiece of the human canon, re-engraved as a living circuit — a painting from across the room, a machine up close. New works are released as drops.*
- Per-exhibit **plaque** (museum label): work title + maker-era (e.g. *after Michelangelo, c.1512*) + a one-line manifesto fragment (e.g. *"the spark, re-cast as data"*). Keep plaques to one line; substrate words off.
- CTA (quiet): `Enter the gallery →` / `Follow the drops →` (links to IG/X).

**Art Direction (exhibits — generate per VI, Xuan Mode)**
Use the **intaglio masterwork-through-aperture** set (e.g. Creation of Adam, Dunhuang apsara, Vesalius, Vitruvian, Caravaggio): `fine intaglio engraving, 宣纸红 (#af3621) line on rice-paper-white (#f3eee7), the hatching resolving into PCB traces + chip-form nodes, one 宣纸红 Kairma-Light glint; seen inside a rabbit/cat aperture where apt; no text, PD art only.` Hide a rabbit/cat **easter egg** in one exhibit.

**Layout (hy.pe grammar):** a media-tile gallery grid (varied tile sizes), warm 宣纸 "wall," each work in a thin chrome frame with a plaque beneath; click → lightbox / drop link. **Motion:** gallery-walk parallax; works fade-in on scroll; hover lifts the frame + reveals the plaque. **Responsive:** 2-col → 1-col, plaques inline. **Acceptance:** feels like an exhibition (frames, plaques, walk), not a product grid; every work passes the VI de-AI rules; PD art only.

---

## §07 · DISPATCHES — Drops & gatherings · Instrument · Matrix Mode

**Concept:** replace borrowed institutional credibility with self-generated cultural momentum — the guild's drops and gatherings, as clickable jump-links. This is the asherhyde/hy.pe "case-card" pattern repurposed.

**Copy**

- Eyebrow (mono): `DISPATCHES · DROPS & GATHERINGS`
- H2: **Where the guild gathers.**
- Lead (short): *Hackathons, cohort openings, poster drops, and conversations. Come find the work.*

**Component:** a grid of **event/drop cards**, each = a poster thumbnail (our art) + title + date/status + outbound jump-link (Luma / X Space / IG / hackathon page). Examples (use only real/credibly-upcoming): `Cohort 001 — Applications Open`, `Sacred Circuitry — Poster Drop`, `Builders' Hackathon`, `X Space: The AI Renaissance`. **Honest:** if few, show few + `more soon`; never fake a calendar.

**Layout (hy.pe grammar):** bold case-cards, full-bleed poster media, kinetic hover, optional auto-scroll marquee of past drops. **Motion:** cards reveal; hover scales poster + shows arrow. **Acceptance:** all links resolve; only real/upcoming items; reads as a living brand, not a press page.

---

## B · hy.pe layout grammar to adopt (site-wide)

- **Bold uppercase kinetic display type** for section H2s (large, confident; mono eyebrows above).
- **Full-bleed media tiles** + **marquees** (posters scrolling, model names scrolling) instead of static logo walls.
- **Case-card grids** (used for Gallery + Dispatches).
- **One playful interactive moment** (e.g. a "spin / hover" easter egg, or the déjà-vu cat in the 404) — keep singular, don't clutter.
- Keep the **dark premium base** + the two-mode zoning; chrome-silver rules as the structural through-line.

## C · Updated acceptance (delta)

- [ ]  Institutional/Lineage section **not shown** (flagged off for phase 2); no Microsoft/YZi/logo wall on the live page.
- [ ]  The Foundry frames Kairma as **conductor/orchestrator**, with live OpenRouter data + static fallback + ToS attribution; instrument (not luxury) styling.
- [ ]  The Gallery reads as a **museum** (frames + plaques + walk), exhibits per VI (intaglio/aperture, PD only), one mascot easter egg.
- [ ]  Dispatches: only real/upcoming drops & events; all jump-links resolve.
- [ ]  Page **zones cleanly**: Instrument (Matrix) for OS/Foundry/Builders/Dispatches; Museum (Xuan) for Belief/Gallery.
- [ ]  Primary CTA remains **Apply to Build**; all v1 Red Lines hold (no hardware, no crypto/web3, substrate internal-only, wordmark r-gap, honest current-state).
