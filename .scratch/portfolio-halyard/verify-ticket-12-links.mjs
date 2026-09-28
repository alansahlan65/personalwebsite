import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const targets = {
  cadit: "https://www.cadit.com/",
  linkedin: "https://www.linkedin.com/in/muhammadsahlanshadiq/",
  github: "https://github.com/alansahlan65",
  behance: "https://www.behance.net/muhammadsahlanshadiq",
  aurelia: "https://aurelia.alansahlanwork.workers.dev/",
  pawfriend: "https://pawfriend-topaz.vercel.app/",
  paylectaPdf: "https://drive.google.com/file/d/19UDppHbm1QU3C_0gCycbTltVKUSxPxmi/view",
  munchpalPdf: "https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view",
};
const results = {};

for (const [name, url] of Object.entries(targets)) {
  try {
    const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(20000) });
    results[name] = { status: response.status, finalUrl: response.url, checkedWith: "HEAD" };
  } catch (error) {
    results[name] = { error: error.message, checkedWith: "HEAD" };
  }
}

await fs.writeFile(path.join(directory, "demos/12-links.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
