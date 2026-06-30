const fs = require('fs');
const path = './src/components/layout/SiteShellV3.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace context hooks
content = content.replace(/useSiteCopyV4/g, 'useSiteCopyV6');
content = content.replace(/\["en", "zh-TW", "vi", "ms"\]/g, '["en", "zh-TW", "vi", "ms", "ko", "ja"]');

// Language toggle rendering map
content = content.replace(
  /if \(lang === "zh-TW"\) return "繁";/,
  `if (lang === "zh-TW") return "繁";\n    if (lang === "ko") return "KR";\n    if (lang === "ja") return "JP";`
);

// Map old siteCopy references to v6
content = content.replace(/\{siteCopy\.hero\.h1\}/g, '{siteCopy.hero_left.h1}');
content = content.replace(/\{siteCopy\.hero\.sub\}/g, '{siteCopy.hero_left.sub}');
content = content.replace(/\{siteCopy\.hero\.bio\}/g, '{siteCopy.hero_center.body}'); // Mapping bio to center body
content = content.replace(/\{siteCopy\.hero\.cta_primary\}/g, '{siteCopy.hero_left.cta_1}');
content = content.replace(/\{siteCopy\.hero\.cta_secondary\}/g, '{siteCopy.hero_left.cta_2}');
content = content.replace(/\{siteCopy\.hero\.fde_note\}/g, '{siteCopy.fde_annotation.body}');

// Old architecture section -> Panel Keep
content = content.replace(/\{siteCopy\.s05_architecture\.heading\}/g, '{siteCopy.panel_keep.h}');
content = content.replace(/\{siteCopy\.s05_architecture\.customer_side\}/g, '{siteCopy.panel_keep.body}');
content = content.replace(/\{siteCopy\.s05_architecture\.form_note\}/g, '{siteCopy.panel_keep.form_note}');

// Old problem section -> Shift
content = content.replace(/\{siteCopy\.s01_problem\.heading\}/g, '{siteCopy.shift.h}');
content = content.replace(/\{siteCopy\.s01_problem\.stat\}/g, '{siteCopy.shift.body}');

// Remove other old sections that were completely removed from V6
// Wait, I can't just remove them, they are rendered in the JSX.
// We need to replace the entire blocks or just map them.
// Actually, it's better to just regex replace the JSX blocks or replace their references.
// Let's replace the properties to dummy strings or map them if the block is still there.

// What did the user say? "if we remain the leaderboard, do we need to create a new box or replace existing other box" -> I said create a new box.
// So the old boxes (s04_what, s08_howitworks, s07_story, s06_moats) are still there in V3.tsx? 
// Yes, `SiteShellV3.tsx` still has all those blocks.
// I should remove the old blocks and keep only the ones defined in V6. 
// V6 specifies: hero_left, hero_center, fde_annotation, panel_keep, shift, moats, dev_smithy, operators, workforce_rail.
// The Leaderboard is kept as a special case.
