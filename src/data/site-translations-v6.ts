import { SiteCopyTypeV6 } from "./site-copy-v6";
import { siteCopyEnV6 } from "./site-copy-en-v6";
import { siteCopyZhTwV6 } from "./site-copy-zh-TW-v6";
import { siteCopyViV6 } from "./site-copy-vi-v6";
import { siteCopyMsV6 } from "./site-copy-ms-v6";
import { siteCopyKoV6 } from "./site-copy-ko-v6";
import { siteCopyJaV6 } from "./site-copy-ja-v6";

export const siteTranslationsV6: Record<string, SiteCopyTypeV6> = {
  en: siteCopyEnV6,
  "zh-TW": siteCopyZhTwV6,
  vi: siteCopyViV6,
  ms: siteCopyMsV6,
  ko: siteCopyKoV6,
  ja: siteCopyJaV6
};
