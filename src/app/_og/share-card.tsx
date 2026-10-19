/* eslint-disable @next/next/no-img-element -- Satori (ImageResponse) renders plain <img>; next/image cannot run here */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_COPY } from "@/lib/site";

/* Social share card, rendered at build time. One composition in two crops:
   landscape (1200×630 — Open Graph / X / LinkedIn / Slack) and square
   (1200×1200 — WhatsApp, iMessage, Telegram and other square-crop surfaces).
   Light v4 palette; values mirror the --k-* tokens in globals.css (Satori
   cannot read CSS variables). */

export type ShareVariant = "landscape" | "square";

export const SHARE_SIZES: Record<ShareVariant, { width: number; height: number }> = {
  landscape: { width: 1200, height: 630 },
  square: { width: 1200, height: 1200 },
};

const C = {
  paper: "#F2F2F0",
  ink: "#282828",
  ink3: "#696966",
  line: "#B3B3AF",
  accent: "#00492E",
};

const INSET = 28;
const CROSS = 18;

// Literal paths only: a computed path makes Turbopack trace the whole project.
async function loadAssets() {
  const [interSemi, interBold, mono, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_og/fonts/Inter-600.ttf")),
    readFile(join(process.cwd(), "src/app/_og/fonts/Inter-700.ttf")),
    readFile(join(process.cwd(), "public/fonts/CourierPrime-Regular.ttf")),
    readFile(join(process.cwd(), "public/kairma-logo.svg"), "utf8"),
  ]);
  // The wordmark is a protected hand-lettered asset: recolour it, never typeset it.
  const inked = logo.replace(/fill="black"/g, `fill="${C.ink}"`);
  const wordmark = `data:image/svg+xml;base64,${Buffer.from(inked).toString("base64")}`;
  return { interSemi, interBold, mono, wordmark };
}

// "+" marks on the four frame corners, as on the site's hairline frame.
function Crosshair({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: "absolute", left: x - CROSS / 2, top: y - CROSS / 2, width: CROSS, height: CROSS, display: "flex" }}>
      <div style={{ position: "absolute", left: CROSS / 2, top: 0, width: 1, height: CROSS, background: C.ink3 }} />
      <div style={{ position: "absolute", left: 0, top: CROSS / 2, width: CROSS, height: 1, background: C.ink3 }} />
    </div>
  );
}

export async function renderShareCard(variant: ShareVariant) {
  const { width, height } = SHARE_SIZES[variant];
  const square = variant === "square";
  const { interSemi, interBold, mono, wordmark } = await loadAssets();

  const steps = SITE_COPY.shift.stepper.split(/→|->/).map((s) => s.trim()).filter(Boolean);
  const cta = SITE_COPY.hero_left.cta_1.replace(/→/g, "").trim();
  const sub = SITE_COPY.hero_left.sub.split(". ")[0].replace(/\.$/, "");
  // One sentence per block, so a line never ends on the first word of the next sentence.
  const sentences = SITE_COPY.hero_left.h1.split(/(?<=\.)\s+/);

  const label = { fontFamily: "CourierPrime", fontSize: square ? 20 : 15, textTransform: "uppercase" as const, color: C.ink3 };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.paper, padding: INSET, position: "relative" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1px solid ${C.line}` }}>
          {/* header row: wordmark cell (landscape) + the four stepper steps */}
          <div style={{ display: "flex", height: square ? 88 : 72, borderBottom: `1px solid ${C.line}` }}>
            {!square && (
              <div style={{ display: "flex", alignItems: "center", padding: "0 28px", borderRight: `1px solid ${C.line}` }}>
                <img src={wordmark} width={127} height={34} alt="" />
              </div>
            )}
            {steps.map((step, i) => (
              <div
                key={step}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: square ? "0 28px" : "0 22px",
                  borderRight: i < steps.length - 1 ? `1px solid ${C.line}` : "none",
                  ...label,
                }}
              >
                <span>{`[0${i + 1}]`}</span>
                <span style={{ color: C.ink }}>{step}</span>
              </div>
            ))}
          </div>

          {/* body: square gets the wordmark large in the open field */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: square ? "space-between" : "flex-end",
              padding: square ? "120px 56px 52px" : "40px 40px 36px",
            }}
          >
            {square && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={wordmark} width={560} height={150} alt="" />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: square ? 86 : 62,
                  lineHeight: 1,
                  letterSpacing: square ? -1.72 : -1.24,
                  textTransform: "uppercase",
                  color: C.ink,
                  maxWidth: square ? 1040 : 900,
                }}
              >
                {sentences.map((s) => (
                  <div key={s}>{s}</div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: square ? 44 : 30,
                  paddingTop: square ? 28 : 20,
                  borderTop: `1px solid ${C.line}`,
                }}
              >
                <div style={{ ...label, fontSize: square ? 19 : 16, maxWidth: square ? 720 : 620 }}>{sub}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: square ? 18 : 14, height: square ? 18 : 14, background: C.accent }} />
                  <div style={{ ...label, fontSize: square ? 22 : 16, color: C.accent }}>{cta}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Crosshair x={INSET} y={INSET} />
        <Crosshair x={width - INSET} y={INSET} />
        <Crosshair x={INSET} y={height - INSET} />
        <Crosshair x={width - INSET} y={height - INSET} />
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: "Inter", data: interSemi, weight: 600, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "CourierPrime", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
