const fs = require('fs');
const content = fs.readFileSync('guan-rain-content.md', 'utf-8');
const lines = content.split('\n');
const quotes = [];
for(const line of lines) {
  if (line.startsWith('**№')) {
    const match = line.match(/「(.*?)」 — (.*?)(?: \[.*\])?$/);
    if (match) {
      quotes.push(match[1] + ' — ' + match[2]);
    } else {
      const match2 = line.match(/\"(.*?)\" — (.*?)(?: \[.*\])?$/);
      if (match2) {
        quotes.push(match2[1] + ' — ' + match2[2]);
      }
    }
  }
}
fs.writeFileSync('src/data/canon-rain.ts', 'export const canonRain: string[] = ' + JSON.stringify(quotes, null, 2) + ';\n');
