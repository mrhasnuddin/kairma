import { SiteCopyTypeV4, siteCopyEnV4 } from "./site-copy-v4";
import { siteCopyZhTwV4 } from "./site-copy-zh-TW-v4";
import { siteCopyZhCnV4 } from "./site-copy-zh-CN-v4";
import { siteCopyViV4 } from "./site-copy-vi-v4";
import { siteCopyMsV4 } from "./site-copy-ms-v4";
import { Language } from "./site-translations";

export const siteTranslationsV4: Record<string, SiteCopyTypeV4> = {
  en: siteCopyEnV4,
  "zh-TW": siteCopyZhTwV4,
  "zh-CN": siteCopyZhCnV4,
  vi: siteCopyViV4,
  ms: siteCopyMsV4
};
