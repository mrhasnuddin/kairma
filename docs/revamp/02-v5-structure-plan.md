# v5 plan: Heron's structure, Kairma's original content

Status: plan, nothing built. Supersedes the v4 page order in `01-framework-ia-flow.md` §6.
Inputs: Heron live DOM (re-read 2026-10-19), the live kairma.ai copy, skills `anatomy`, `emil-design-eng`, `design-system-boss` (+ `build-design-system`, `token-mapping`).
Dropped: `gpt-taste` (it bans Heron's `[01]` labels and asks for GSAP pinning).

## 1. What "original content" means here

| Source | What it is | Status in v5 |
|---|---|---|
| `site-copy-*-v6.ts` + `ui-strings.ts` | Everything kairma.ai renders today (main → `SiteShellV3`), six locales | **Canonical.** Used first, wording kept |
| `site-copy.ts` → `pilotModal`, `ecosystemModels`, `boot` | Live modal copy, leaderboard labels, boot lines | Canonical |
| v3 component strings (workforce descriptions in `SiteShellV3.tsx:765`, bulletin carousel, deployment modal) | Live, hard-coded English | Canonical after C1 is settled |
| `site-copy.ts` long form (problem, whyNow, insight, layers, story, begin, footer) | Older pitch-era site copy, not rendered today | **Archive.** Used only where Heron has a slot v6 can't fill, and flagged |
| `site-copy-v7.ts` | My v4 rewrite | Retired. v5 goes back to the original wording |

Copy rule for v5: original wording, with only mechanical cleanup (em dashes become colons or periods, sentence case for headings). Any other edit is listed in the mapping below so you can see it.

### Contradictions in the original copy (need one answer each)

| # | One source says | Another says | Default |
|---|---|---|---|
| C1 | "Data local. Models cloud. Only tasks route." (v6 `panel_keep.h`) | "Open-weights models in your VPC… No data ever phones home to OpenAI, Anthropic" (deployment modal); "custom models run within your enterprise VPC", "locally fine-tuned Llama" (carousel) | v6. Rewrite the modal and carousel lines to match |
| C2 | "The Keep ships today as the Key… Kairma One on the roadmap" (v6) | "Kairma Box, X86 / Windows, ships to customer" (archive) | v6 |
| C3 | "~80% standardized" (v6 moat 2) | "Next agent reuses 70% of the foundation" (archive) | v6, drop 70% |
| C4 | "KOL BD" (v6, all non-English UI strings) | "Creator BD" (English UI string) | KOL BD |

Archive claims that stay **off the page** unless you confirm them for public use: the $1.5T stat, the 2026 / Q4 2027 "window", the cost curves (1/20, 10×), Microsoft alignment, YZi Labs cohort, Web3Labs spin-out story, Shenzhen OEM, "On-premise in 48 hours" in the begin block, office locations. (The pilot modal's "in 48 hours" is live today and stays.)

## 2. Heron's structure, exactly (live DOM, 1440 px)

| # | Heron section | Slots |
|---|---|---|
| — | Header | logo · 4 nav links · CONTACT US button |
| 0 | Loader | hero illustration drawn in by scan lines · progress items |
| 1 | Hero | H1 bottom-left · illustration centre · body with one inline link + one button bottom-right · 3-item ticker · corner crosshairs |
| 2 | Intro | 2-sentence statement · LEARN MORE · square illustration (592 px, ink-mask reveal) · label + one line · logo strip (8) |
| 3 | Problems | label · H2 · body · 4 cards, each: tag word, `[0n]`, isometric icon, title, body |
| ~~4~~ | ~~Map~~ | **Excluded on your instruction**: the sticky scroll story with "RIGHT THERE WITH YOU" |
| 5 | Platform | 2 products, each: `[0n]`, title, body, LEARN MORE, UI mockup; copy sticky beside the mockups |
| 6 | Why us | label · H2 · body · 4 items (one word + one line) with illustrations alternating left/right |
| 7 | Use cases | label · H2 · accordion (8 items: title + one line) · one visual per item |
| 8 | CTA | H2 · body · one button · illustration |
| 9 | Footer | statement · subscribe · link columns · legal · giant wordmark. **Kept as the old Kairma footer** (your earlier call) |

Because the Map is gone, nothing on the page is scroll-driven text. The Intro statement also scrubbed word by word on Heron; v5 uses a one-shot line reveal there instead (gate G3).

## 3. Mapping: Heron slot → Kairma original

**Header**: wordmark · Platform · How deployment works · Why Kairma · Workforce · locale · theme · **Request a pilot**.

**0 Loader**: figure D1 drawn in by scan lines. Progress items = `boot.steps`: "Initializing SOP workflow engine", "Loading local brand data lake", "Connecting cloud model router". Replaces the 观 frontispiece (gate G1).

**1 Hero**
| Slot | Copy | Source |
|---|---|---|
| H1 | We don't ship you AI. We deploy it into your operations. | v6 `hero_left.h1` (today's live H1) |
| Body + inline link | AI employees, forward-deployed into the markets you enter. Outcomes, not headcount. Sovereign. *How deployment works* | v6 `hero_left.sub`, `cta_2` |
| Button | Request a pilot | v6 `cta_1` |
| Ticker (3) | Data local · Models cloud · Only tasks route | v6 `panel_keep.h`, split |
| Illustration | D1, the Keep (closed) | replaces the cobe globe |

**2 Intro**
| Slot | Copy | Source |
|---|---|---|
| Statement | Models got better. Deployment is where outcomes compound. AI employees, forward-deployed into cross-border operations. Run to outcomes. | v6 `shift.body` + `hero_center.body` |
| Button | Learn more → opens How deployment works | v6 `fde_annotation` fills the modal |
| Square illustration | D7, close-up of D1 (the Key in its lock) | — |
| Label + line | Routed across · Model-neutral: routed live across Claude, GPT, Gemini, DeepSeek, Qwen and Kimi, by task and cost. | v6 `moats.routing_strip` |
| Logo strip | the 6 provider marks (honest: these are models we route to, not clients) | `@lobehub/icons`, already installed |

**3 Problems**
| Slot | Copy | Source |
|---|---|---|
| Label | The shift | v6 `shift.label` |
| H2 | Cross-border operations still scale like labor. | v6 `shift.h` |
| Body | The most ambitious brands are bottlenecked by legacy operations, scattered data, and linear headcount costs. | archive `partnersBox.description` |
| [01] *Unstandardized* | BD scripts don't standardize. Pipelines leak. | archive `problem.painPoints[0]` |
| [02] *Disconnected* | Four platforms. Zero integration. | archive `painPoints[1]` |
| [03] *Linear* | Every new market. New hires. Linear cost. | archive `painPoints[2]` |
| [04] *Tool-bound* | Tools make people faster. A workforce does the work. | archive `fdeShift.desc` |
| Icons | D6 a–d | — |

Tag words (italic) are new single words, written to fill Heron's tag slot.

**5 Platform**
| | [01] The Keep | [02] Model router |
|---|---|---|
| Body | Data local. Models cloud. Only tasks route. Your sealed runtime: brand data never leaves. It ships today as the Key, the sovereign drive you hold. Kairma One is on the roadmap. | Model-neutral. Multi-model routing, selected by cost and task. Top models, ranked by weekly usage, via OpenRouter. |
| Source | v6 `panel_keep.h/body/form_note` | v6 `routing_strip`, archive `architecture.cloud.desc`, `ecosystemModels.subtitle` |
| Button | Learn more → How deployment works | Full rankings → openrouter.ai |
| Mockup | D2: Keep cutaway with 4 hotspots (data lake, SOP engine, model router, RPA / API) | live leaderboard table (existing `/api/openrouter`) + D3 pyramid, synced |

The Keep's hotspot lines come from the carousel (Sovereign AI Runtime, Multi-Model Routing, Automated SOP Engine, Enterprise RPA & API), corrected for C1.

**6 Why Kairma**
| Slot | Copy | Source |
|---|---|---|
| Label | Why Kairma | Heron "Why us" |
| H2 | Four moats. Ordered by depth. | v6 `moats.label` |
| Body | The mirror, not the oracle. We don't claim to understand your business better than you. We reflect it back, run it, and keep the accounts. The last mile is human, on purpose. | v6 `stance.line` (restored; v4 dropped it) |
| *Encoded* | SOP engine and data lake: encoded logic, deepens per run. | v6 `card_1` |
| *Productized* | Productized forward deployment: about 80% standardized; a light team closes the last mile. | v6 `card_2` |
| *Compounding* | Deployment-data flywheel: every deployment compounds. | v6 `card_3` |
| *Sovereign* | Sovereignty: your data stays in the Keep. | v6 `card_4` |
| Illustrations | D5 a–d | — |

**7 Use cases**
| Slot | Copy | Source |
|---|---|---|
| Label | The workforce | — |
| H2 | Your first AI employees, deployed, not downloaded. | v6 `workforce_rail.h` |
| KOL BD · Pilot-ready | Autonomous creator and strategic partner business development. | v3 roster |
| Content Ops · FDE configured | End-to-end multi-channel content generation and editorial orchestration. | v3 roster |
| Customer Care · In development | 24/7 ticket resolution and multi-tier escalation. | v3 roster |
| Compliance · Private runtime | Regulatory monitoring, audit trail and policy adherence. | v3 roster |
| Visual | D4, one figure, four states | — |

Heron has 8 items; Kairma has 4. The count follows the content.

**8 CTA**: H2 "Get a workforce deployed into your operation." · body "We land it with you: outcomes, not a hand-off." · **Request a pilot** (v6 `operators`). The developer door ("Forge the next AI employee in the Smithy.", v6 `dev_smithy`) has no slot in Heron's CTA; default is one quiet text line under the button, "Docs coming soon" until a docs URL exists (gate G4).

**9 Footer**: the old `KairmaFooter`, unchanged (gate G5).

Not carried over: the bulletin photo carousel (its text moves into D2), the 3D/HUD chrome ("System: Online", data-group HUD; the groups become leaderboard filters), v4's Keep sticky story.

## 4. Diagrams with `anatomy`

Each diagram is a real machine whose working is the idea (anatomy's core rule), drawn with the kit in SVG, no WebGL. Kit copied to `src/components/iso/`; geometry in `.ts` modules, static art in server components, one `"use client"` live component per figure; `node build --audit` and the line-end check must pass on every figure, in both themes.

| ID | Where | Idea | Machine | Tier | Est. |
|---|---|---|---|---|---|
| D1 | Hero, loader | Data stays sealed; you hold the key | The Keep: a strongbox cabinet on a bench, the Key in its lock, one port at the back with a pneumatic tube leaving | Hero (80–150 parts) | 3 h |
| D2 | Platform [01] | Only tasks cross the line | D1 with its side panel off: sealed data-lake drum (never touches the port), SOP engine as a punched-card cam drum, model router as a rotary diverter with 6 outlets, RPA / API as a relay bank to "your software" sockets; task capsules ride the tube. Readout: raw data out 0 B · tasks routed n | +Hero, reuses D1 | 2 h |
| D3 | Platform [02] | Top models by weekly usage, live | Stepped cartridge rack, tiers 4-3-2-1 (top 10). Each cartridge carries a provider plate; hovering a table row slides its cartridge out; a ranking change re-slots cartridges on a spring. Replaces `PyramidScene.tsx` | Hero | 3 h |
| D4 | Use cases | Four employees, four states | Card cage on the Keep's bus: four role cards with status lamps; the open accordion item slides its card out | Figure (40–80) | 1 h |
| D5 a–d | Why Kairma | The four moats | a: cam drum over a tank whose level rises per run · b: assembly jig, standard parts plus one hand-fitted part · c: flywheel with a deployment counter · d: lock and key (D1 detail) | Figure ×4 | 3–4 h |
| D6 a–d | Problems icons | The four pains | a: pipeline with leaks · b: four sockets, no cable · c: ratchet ruler, one weight per market · d: hand tool beside an automatic machine | small Figures | 2 h |
| D7 | Intro square | — | 4× crop of D1 | reuse | — |

About 14 hours of figure work. Phased: **A** D1, D2, D3 (they replace the globe and the pyramid you named) · **B** D4, D5 · **C** D6.
Colour: anatomy allows one lit accent per figure; ours is `--k-accent` (green light / red dark), used only on the moving subject (task capsules, the selected cartridge).

## 5. Design system (design-system-boss → `playbooks/build.md`)

**Triage** (`build-design-system/scripts/check-system.mjs --no-allowlist --no-self-test --json`, run 2026-10-19): 1,043 findings repo-wide: 400 arbitrary values, 356 raw values, 68 `transition: all`, 49 native controls, 40 palette classes, others. **36** are in `src/components/v4`; the rest are v3 legacy, which gets deleted after v5 sign-off rather than migrated.

What the run changes:
1. **Layers.** Today `--k-*` hold raw hex per theme. Add a primitive layer (stone, green, red ramps) and point the existing `--k-*` names at it per theme. Names stay (`--k-paper`, `--k-ink`, …): the skill's rule is to keep working names.
2. **Motion presets by job**: `instant`, `micro`, `enter`, `exit`, `overlay`, `collapse`, `loader`, `follow`, each with duration, ease, properties and a reduced-motion form. Emil's rules apply: enters ease out, exits shorter, nothing from `scale(0)`, buttons `scale(0.97)` on press, UI under 300 ms.
3. **Figure tones**: anatomy's `lo / mid / hi / lit / faint` mapped to `--k-ink-*` so every figure follows the theme.
4. **Type roles** re-cut for the chosen font pair (§6).
5. **Wave-1 components**: Text, Label (`[0n]` + word), Button (primary, ghost), Link, Accordion, Figure frame (Fig n · title · hint · readout), Section header.
6. **Checks**: `check-system.mjs` + `oklch.mjs` into `scripts/`, scoped to v5 + `globals.css`, each rule seen failing on a planted case, allowlist only shrinks; `npm run check:ds`.

Taste bans (asked once, defaults applied): em dashes, emoji, gradients, exclamation marks **on**; uppercase labels and middle-dot separators **off** (Heron uses both).
Branch: the boss wants its own run branch. That needs the current uncommitted v4 work committed first, which waits for your go.
Verdicts are marked `self-verified` unless you want a separate reviewer agent.

## 6. Font pairs (all Google Fonts, all cover Vietnamese)

| # | Pair | Feel | CJK partner |
|---|---|---|---|
| 1 | IBM Plex Sans + IBM Plex Mono | Engineering ledger; closest match to the anatomy figures | IBM Plex Sans JP / KR, Noto Sans TC |
| 2 | Newsreader + Hanken Grotesk | Editorial serif headlines, quiet grotesk text; nods to v3's Gloock serif | Noto Serif TC / JP / KR for headlines |
| 3 | Archivo Expanded + JetBrains Mono | Wide, architectural, confident | Noto Sans TC / JP / KR |
| 4 | Bricolage Grotesque + Chivo Mono | Warm, characterful, ink-trap details at display size | Noto Sans TC / JP / KR |

Inter goes in every case. Specimens were shown in chat; the pick is gate F.

## 7. Gates (defaults apply if unanswered)

| Gate | Question | Default |
|---|---|---|
| F | Font pair | none, blocks type tokens |
| G1 | Replace the 观 frontispiece with Heron's loader (D1 + boot lines)? | yes, 观 stays in git history |
| G2 | Original wording (v6) instead of the v7 rewrite? | yes |
| G3 | Intro statement: one-shot line reveal instead of Heron's scroll scrub? | one-shot |
| G4 | Developer door as one text line under the CTA? | yes |
| G5 | Keep the old footer instead of Heron's link-column footer? | yes |
| C1–C4 | §1 contradictions | the v6 side |
| B | Commit current v4 work so the design-system run can branch | wait for you |

## 8. Order of work

1. Gates → 2. tokens, checks, wave-1 components → 3. copy file from §3 (six locales from the v6 translations; archive lines need new translations, flagged for native review) → 4. sections in Heron order with figure placeholders → 5. figures A, B, C → 6. verify at 1440 and 390, both themes, reduced motion, `next build`, `check:ds` → 7. delete v3/v4 code after sign-off.

## 9 · As built (2026-10-19)

Decisions taken: font pair 1 (IBM Plex Sans + Mono) · copy rewritten with humanize from the original (sloplint 1/100, no dashes, six locales, non-English drafts for native review) · 观 frontispiece dropped for now · v4 committed as a checkpoint (9a21938) and v5 built on branch `v5`.

- **Page**: loader (Keep drawn in behind a scan line, three boot lines) → hero (Fig. 01) → intro (statement, Key close-up, routed-across strip) → the shift (four problem cards) → platform [03] the Keep (Fig. 02, pick a part) and [04] model router (Fig. 03 rack + live OpenRouter top 10, server-rendered, ISR 5 min) → why Kairma (four moats) → workforce (accordion + Fig. 04 cage) → CTA with the developer line → old reveal footer.
- **Drawings** (anatomy): keep, keep-detail, keep-open, rack, cage, four moats, four problem icons. 13 figures, 35–147 KB each before compression, fetched near the viewport.
- **Cursor**: accent trail, crop marks around pressable things, seal stamp on click; desktop and fine pointers only; off under reduced motion.
- **Frame marks**: default `crop`; preview `?frame=ledger`, `?frame=grid`, `?frame=seal`.
- **Fixed on the way**: the pilot form never sent anything (now opens an email to pilot@kairma.ai, the address from the original copy); the leaderboard's invented fallback models are gone (it says rankings are unavailable instead); the copy now says "daily usage" to match the API (`order=top-daily`).
- **Accessibility audit** (impeccable): fixed focus hidden under the footer curtain, dark red text contrast (4.4 → 4.6:1), the endless ticker (now static), language menu semantics, small table touch targets, focus reachable behind the loader, the intro heading, faint focus rings. Remaining: the kept footer's all-caps line and scanline stripes.
