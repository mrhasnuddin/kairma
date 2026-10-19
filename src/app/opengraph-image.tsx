import { renderShareCard, SHARE_SIZES, type ShareVariant } from "./_og/share-card";
import { SHARE_ALT } from "@/lib/site";

/* Two og:image entries. Landscape is listed first because most platforms
   (Facebook, LinkedIn, Slack, Discord) take the first image; square is there
   for surfaces that crop to 1:1 (WhatsApp, iMessage, Telegram). */
export function generateImageMetadata() {
  return (["landscape", "square"] as const).map((id) => ({
    id,
    alt: SHARE_ALT,
    size: SHARE_SIZES[id],
    contentType: "image/png",
  }));
}

export default async function Image({ id }: { id: Promise<string> }) {
  return renderShareCard((await id) as ShareVariant);
}
