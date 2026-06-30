const fs = require('fs');

const path = './src/components/layout/SiteShellV3.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace useSiteCopyV4
content = content.replace(/useSiteCopyV4/g, 'useSiteCopyV6');

// Replace ["en", "zh-TW", "vi", "ms"] with ["en", "zh-TW", "vi", "ms", "ko", "ja"]
content = content.replace(/\["en", "zh-TW", "vi", "ms"\]/g, '["en", "zh-TW", "vi", "ms", "ko", "ja"]');

// Update language name mapping
content = content.replace(
  /if \(lang === "zh-TW"\) return "繁";/,
  `if (lang === "zh-TW") return "繁";\n    if (lang === "ko") return "KR";\n    if (lang === "ja") return "JP";`
);

// Map old siteCopy references to v6 structure
// Hero Left
content = content.replace(/\{siteCopy\.hero\.h1\}/g, '{siteCopy.hero_left.h1}');
content = content.replace(/\{siteCopy\.hero\.sub\}/g, '{siteCopy.hero_left.sub}');
content = content.replace(/\{siteCopy\.hero\.cta_primary\}/g, '{siteCopy.hero_left.cta_1}');
content = content.replace(/\{siteCopy\.hero\.cta_secondary\}/g, '{siteCopy.hero_left.cta_2}');
// FDE Annotation (was fde_note)
content = content.replace(/\{siteCopy\.hero\.fde_note\}/g, '{siteCopy.fde_annotation.body}');
// Architecture -> Panel Keep
content = content.replace(/\{siteCopy\.s05_architecture\.heading\}/g, '{siteCopy.panel_keep.h}');
content = content.replace(/\{siteCopy\.s05_architecture\.customer_side\}/g, '{siteCopy.panel_keep.body}');
content = content.replace(/\{siteCopy\.s05_architecture\.form_note\}/g, '{siteCopy.panel_keep.form_note}');
// The Shift -> Problem
content = content.replace(/\{siteCopy\.s01_problem\.heading\}/g, '{siteCopy.shift.h}');
content = content.replace(/\{siteCopy\.s01_problem\.stat\}/g, '{siteCopy.shift.body}');
// Footer
content = content.replace(/\{siteCopy\.footer\.tagline\}/g, '{siteCopy.footer.closing}');

// Replace hardcoded `t("the_shift")` with `{siteCopy.shift.label}`
content = content.replace(/\{t\("the_shift"\)\}/g, '{siteCopy.shift.label}');
// Replace `t("for_developers")` with `{siteCopy.dev_smithy.label}`
content = content.replace(/\{t\("for_developers"\)\}/g, '{siteCopy.dev_smithy.label}');
// Replace `t("view_docs")` with `{siteCopy.dev_smithy.cta}`
content = content.replace(/\{t\("view_docs"\)\}/g, '{siteCopy.dev_smithy.cta}');
// Replace `t("for_operators")` with `{siteCopy.operators.label}`
content = content.replace(/\{t\("for_operators"\)\}/g, '{siteCopy.operators.label}');
// Replace `t("digital_emp_heading")` with `{siteCopy.workforce_rail.h}`
content = content.replace(/\{t\("digital_emp_heading"\)\}/g, '{siteCopy.workforce_rail.h}');

// We also need to add the Moats grid. The Leaderboard starts around `const activeModels`.
// We will insert the Four Moats right above the Leaderboard.
// Let's find: {/* Row 3 */}
const moatsSection = `
          {/* V6 Moats Section */}
          <OSCard className="col-span-1 md:col-span-3 row-span-1 p-6 relative overflow-hidden group mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
              <h3 className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm">{siteCopy.moats.label}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm leading-relaxed text-theme-text-muted">
              <div>
                <strong className="text-theme-text">01.</strong> {siteCopy.moats.card_1}
              </div>
              <div>
                <strong className="text-theme-text">02.</strong> {siteCopy.moats.card_2}
              </div>
              <div>
                <strong className="text-theme-text">03.</strong> {siteCopy.moats.card_3}
              </div>
              <div>
                <strong className="text-theme-text">04.</strong> {siteCopy.moats.card_4}
              </div>
            </div>
          </OSCard>
`;

content = content.replace(/\{\/\* Row 3 \*\/\}/g, moatsSection + '\n          {/* Row 3 */}');

fs.writeFileSync(path, content);
console.log('SiteShellV3 modified!');
