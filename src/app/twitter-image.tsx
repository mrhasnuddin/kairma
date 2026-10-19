import { renderShareCard, SHARE_SIZES } from "./_og/share-card";
import { SHARE_ALT } from "@/lib/site";

// X's summary_large_image crops to roughly 2:1, so it gets the landscape card.
export const alt = SHARE_ALT;
export const size = SHARE_SIZES.landscape;
export const contentType = "image/png";

export default function Image() {
  return renderShareCard("landscape");
}
