import { SITE_COPY as c, SITE_URL, SITE_NAME } from "@/lib/site";

/* GEO: /llms.txt (llmstxt.org) — a plain-markdown brief for AI engines,
   assembled verbatim from the English site copy so it can never drift from
   what the page says. Built once at build time. */
export const dynamic = "force-static";

const bullets = (s: string, sep: RegExp) =>
  s.split(sep).map((x) => x.replace(/●/g, "").trim()).filter(Boolean).map((x) => `- ${x}`).join("\n");

export function GET() {
  const body = [
    `# ${SITE_NAME}`,
    `> ${c.hero_center.body}`,
    `${c.hero_left.h1} ${c.hero_left.sub}`,
    `## The shift\n${c.shift.h} ${c.shift.body}\n\nDeployment path: ${c.shift.stepper}`,
    `## Stance\n${c.stance.line}`,
    `## The Keep\n${c.panel_keep.h} ${c.panel_keep.body} ${c.panel_keep.form_note}`,
    `## Four moats, ordered by depth\n${[c.moats.card_1, c.moats.card_2, c.moats.card_3, c.moats.card_4].map((m) => `- ${m}`).join("\n")}\n\n${c.moats.routing_strip}`,
    `## AI employees\n${c.workforce_rail.h}\n\n${bullets(c.workforce_rail.items, /\s·\s/)}`,
    `## For operators\n${c.operators.h} ${c.operators.body}`,
    `## For developers\n${c.dev_smithy.h} ${c.dev_smithy.body}`,
    `## Glossary\n${c.fde_annotation.body.replace(/^↳\s*/, "")}`,
    `## Links\n- [${SITE_NAME}](${SITE_URL}): ${c.hero_center.h1}`,
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
