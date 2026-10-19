import fs from 'node:fs';
import path from 'node:path';

const file = 'graphify-out/graph.html';
const library = fs.readFileSync('graphify-out/vendor/vis-network.min.js', 'utf8');
let html = fs.readFileSync(file, 'utf8');
const script = /<script\b[^>]*src=["'][^"']*vis-network[^"']*["'][^>]*>\s*<\/script>/i;
if (script.test(html)) html = html.replace(script, () => `<script>${library}</script>`);
else if (!html.includes(library)) throw new Error('Expected vis-network library was not found');
fs.writeFileSync(file, html);
fs.writeFileSync('graphify-out/.graphify_root', path.resolve('.'));

const graph = JSON.parse(fs.readFileSync('graphify-out/graph.json','utf8'));
const ids = new Set(graph.nodes.map(node=>node.id));
const brokenEdges = graph.links.filter(edge=>!ids.has(edge.source)||!ids.has(edge.target));
const sources = [...new Set(graph.nodes.map(node=>node.source_file).filter(Boolean))];
const externalSources = sources.filter(source=>!path.isAbsolute(source) && !/\.[a-z\d]+$/i.test(source));
const missingSources = sources.filter(source=>!externalSources.includes(source) && !fs.existsSync(path.resolve(source)));
const audit = {nodes:graph.nodes.length,links:graph.links.length,duplicateIds:graph.nodes.length-ids.size,brokenEdges:brokenEdges.length,missingSources,externalSources,offlineLibraryBytes:Buffer.byteLength(library)};
fs.writeFileSync('.scratch/graph-cleanup/graph-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(audit,null,2));
