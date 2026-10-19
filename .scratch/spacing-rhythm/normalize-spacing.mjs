import fs from "node:fs";
import path from "node:path";

function stylesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? stylesIn(path.join(directory, entry.name))
    : entry.name.endsWith(".css") ? [path.join(directory, entry.name)] : []);
}

const patches = [];
for (const file of stylesIn("app")) {
  const before = fs.readFileSync(file, "utf8");
  const changes = [];
  const after = before.replace(/(?<![\w-])(padding(?:-[\w-]+)?|(?:row-|column-)?gap|margin(?:-[\w-]+)?|--gutter|--menu-row-gap)\s*:\s*([^;{}]+)/g, (declaration, property, value, index) => {
    const isPadding = property.startsWith("padding");
    // Character anatomy and hidden-reader geometry are separate from content spacing.
    if (!isPadding && (value.trim().startsWith("-") || (file.includes("hero-role-play") && value.trim() === "9px"))) return declaration;
    let next = value.replace(/(?<![\w.-])([\d.]+)(rem|px|em)\b/g, (length, amount, unit) => {
      if (unit === "em" && !isPadding) return length;
      const pixels = Number(amount) * (unit === "px" ? 1 : 16);
      if (!pixels || (!isPadding && pixels <= 1) || Math.abs(pixels / 4 - Math.round(pixels / 4)) < 0.001) return length;
      return `${Math.max(4, Math.round(pixels / 4) * 4)}px`;
    });
    next = next.replace(/clamp\(([^()]+)\)/g, (clamp, contents) => {
      if (!/v[wh]/.test(contents)) return clamp;
      const minimum = contents.split(",")[0].trim();
      const pixels = parseFloat(minimum) * (minimum.endsWith("rem") ? 16 : 1);
      const step = property === "--gutter" || pixels >= 32 ? 8 : 4;
      return `round(nearest, ${clamp}, ${step}px)`;
    });
    if (isPadding && file.includes("project-devices")) {
      next = next.replace(/([\d.]+)%/g, (percent) => `round(nearest, ${percent}, 4px)`);
    }
    if (next === value) return declaration;
    changes.push({ line: before.slice(0, index).split("\n").length, property, before: value, after: next });
    return `${property}: ${next}`;
  });
  if (after === before) continue;
  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);
  patches.push(`*** Update File: ${path.resolve(file)}`);
  beforeLines.forEach((line, index) => {
    if (line !== afterLines[index]) patches.push("@@", `-${line}`, `+${afterLines[index]}`);
  });
  console.log(JSON.stringify({ file, changes: changes.length }));
}
fs.writeFileSync(".scratch/spacing-rhythm/spacing.patch", ["*** Begin Patch", ...patches, "*** End Patch"].join("\n"));
