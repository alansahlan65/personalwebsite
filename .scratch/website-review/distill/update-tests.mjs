import fs from 'node:fs/promises';

for(const slug of ['case-media','munchpal','paylecta','pawfriend']) {
  const path=`tests/${slug}.spec.ts`;
  let text=await fs.readFile(path,'utf8');
  text=text.replaceAll('getByRole("link")','getByRole("link", { includeHidden: true })');
  // Source links now follow a native disclosure. The visible summary is the
  // primary media action for runtime layout/preference checks.
  text=text.replace(/(const (?:link|action) = [^\n]*(?:getByRole\("article"\)|panels\.nth)[^\n]*)getByRole\("link", \{ includeHidden: true \}\)/g,'$1locator("summary")');
  text=text.replace(/(await panel\.)getByRole\("link", \{ includeHidden: true \}\)(\.focus\(\))/g,'$1locator("summary")$2');
  text=text.split('\n').map(line=>/panel|sequence\.getByRole\("article"\)/.test(line)&&!/revisions/.test(line)?line.replaceAll('getByRole("img")','locator(".case-media-crop img")'):line).join('\n');
  text=text.replaceAll('await skip.click();','await skip.focus();\n  await page.keyboard.press("Enter");');
  text=text.replace(/(await sequence\.getByRole\("link", \{ name: "Skip[^\n]+?\}\))\.click\(\);/g,'$1.focus();\n    await page.keyboard.press("Enter");');
  if(slug!=='munchpal') {
    const id=slug==='case-media'?'aurelia':slug;
    text=text.replace(/page\.getByRole\("heading", \{ name: "Implementation (?:notes|considerations)", exact: true \}\)/g,`page.locator("#${id}-implementation")`);
  }
  if(slug==='case-media') {
    text=text.replace('await expect(sequence.getByRole("article").nth(index)).toBeInViewport({ ratio: 0.95 });','await expect(sequence.getByRole("article").nth(index).getByRole("link", { includeHidden: true })).toBeInViewport({ ratio: 1 });');
    text=text.replace('await expect(sequence.getByRole("article").nth(1)).toBeInViewport({ ratio: 0.95 });\n  await skip.focus();','await expect(sequence.getByRole("article").nth(1).getByRole("link", { includeHidden: true })).toBeInViewport({ ratio: 1 });\n  await skip.focus();');
    text=text.replace('await sequence.getByRole("link", { name: "Skip to implementation notes" }).tap();','await page.locator("#aurelia-implementation").tap();');
    text=text.replace('const screenshot = page.getByRole("link", { name: "Open filters screenshot" });','await page.locator(".case-media-source summary").first().click();\n  const screenshot = page.getByRole("link", { name: "Open filters screenshot" });');
    text=text.replace('const video = page.locator("video[aria-label=', 'await page.locator("#aurelia-implementation").click();\n  const video = page.locator("video[aria-label=');
  }
  if(slug==='munchpal') {
    text=text.replaceAll('const media = page.getByRole("region", { name: "Explore the prototype" });','await page.getByText("More prototype screens", { exact: true }).click();\n  const media = page.getByRole("region", { name: "Explore the prototype" });');
    text=text.replaceAll('const sequence = page.getByRole("region", { name: "Explore the prototype" });','await page.getByText("More prototype screens", { exact: true }).click();\n  const sequence = page.getByRole("region", { name: "Explore the prototype" });');
    text=text.replace('const results = page.locator(', 'await page.getByText("Test details", { exact: true }).click();\n  const results = page.locator(');
    text=text.replaceAll('See the tasks participants attempted','Test details');
  }
  if(slug==='paylecta') {
    text=text.replace('await expect(page.getByText(/Sole UI\\/UX designer for the dashboard/)).toBeVisible();','await expect(page.getByText("Sole UI/UX designer", { exact: true })).toBeVisible();');
    text=text.replace('await expect(page.getByText("No other designers.", { exact: true })).toBeVisible();','await expect(page.getByText("Responsive dashboards and visual system", { exact: true })).toBeVisible();');
    text=text.replace('await expect(page.getByRole("heading", { name: "Design decisions", exact: true })).toBeVisible();','await expect(page.locator(".case-decisions")).toHaveCount(0);');
  }
  if(slug==='pawfriend') {
    text=text.replace('const video = page.getByLabel("PawFriend live concept browsing and shortlist recording");','await page.locator("#pawfriend-implementation").click();\n  const video = page.getByLabel("PawFriend live concept browsing and shortlist recording");');
  }
  await fs.writeFile(path,text);
}
const inspection='tests/inspection-polish.spec.ts';
let text=await fs.readFile(inspection,'utf8');
text=text.replace('const sequence = page.locator(".case-media");','if (slug === "munchpal") await page.getByText("More prototype screens", { exact: true }).click();\n    const sequence = page.locator(".case-media");');
await fs.writeFile(inspection,text);
console.log('Updated retained source, focus, scope and native disclosure checks.');
