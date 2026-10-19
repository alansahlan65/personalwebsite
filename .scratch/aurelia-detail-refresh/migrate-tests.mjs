import fs from 'node:fs';

const media = 'tests/case-media.spec.ts';
let text = fs.readFileSync(media, 'utf8');
// The reusable horizontal-media component remains on PawFriend. Aurelia's
// continuous flow and SVG/recording access now have their own coverage.
text = text.slice(0, text.indexOf('test("authentic screenshots'));
text = text.replaceAll('aurelia-details.webp', 'pawfriend-shortlist.webp')
  .replaceAll('aurelia', 'pawfriend').replaceAll('Aurelia', 'PawFriend')
  .replaceAll('Inside the concept', 'From browsing to a first visit')
  .replaceAll('Skip to implementation notes', 'Skip to build notes')
  .replaceAll('PawFriend, Hospitality case study', 'PawFriend, Pet adoption case study');
fs.writeFileSync(media, text);
const quality = 'tests/interface-quality.spec.ts';
text = fs.readFileSync(quality, 'utf8').replaceAll('await page.goto("/work/aurelia");', 'await page.goto("/work/pawfriend");');
fs.writeFileSync(quality, text);
