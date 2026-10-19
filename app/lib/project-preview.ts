import assets from "../../docs/project-preview-assets.json";

const previews = new Map(assets.map(asset => [
  `/images/figma/${asset.slug}/${asset.source}`,
  `/images/figma/${asset.slug}/${asset.preview}`,
]));

/** Display copies compress embedded photos while links keep the original SVG. */
export function projectPreview(image: string) {
  return previews.get(image) ?? image;
}
