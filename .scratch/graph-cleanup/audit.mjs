import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';
const root = process.cwd();
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const appFiles = walk(path.join(root, 'app'));
const code = appFiles.filter(file => /\.(tsx?|css)$/.test(file));
const sourceFiles = code.filter(file => /\.tsx?$/.test(file));
const sources = sourceFiles.map(file => ({file, text: fs.readFileSync(file, 'utf8')}));
const sourceText = sources.map(source => source.text).join('\n');
const unusedCss = [];
for (const file of code.filter(file => file.endsWith('.css'))) {
  const css = postcss.parse(fs.readFileSync(file, 'utf8'), {from: file});
  const names = new Map();
  css.walkRules(rule => {
    for (const match of rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
      if (!names.has(match[1])) names.set(match[1], rule.source.start.line);
    }
  });
  for (const [name, line] of names) {
    if (!sourceText.includes(name)) unusedCss.push({file: path.relative(root, file).replaceAll('\\','/'), name, line});
  }
}
const imported = new Set();
for (const source of sources) {
  const ast = ts.createSourceFile(source.file, source.text, ts.ScriptTarget.Latest, true);
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith('.')) continue;
    const base = path.resolve(path.dirname(source.file), specifier);
    for (const candidate of [base, base+'.ts', base+'.tsx', path.join(base,'index.ts'), path.join(base,'index.tsx')]) {
      if (fs.existsSync(candidate)) imported.add(candidate);
    }
  }
}
const unusedModules = sourceFiles.filter(file => !imported.has(file) && !/\/(page|layout|not-found)\.tsx$/.test(file.replaceAll('\\','/'))).map(file=>path.relative(root,file));
const contentFiles = ['app','docs','scripts','tests','plans','.impeccable','public'].flatMap(dir => walk(path.join(root, dir))).filter(file => /\.(tsx?|[cm]?js|json|md|css|txt|html)$/.test(file) && !file.includes(path.sep+'review'+path.sep));
const contents = contentFiles.map(file => fs.readFileSync(file,'utf8')).join('\n');
const unreferencedPublic = walk(path.join(root,'public')).filter(file => !file.endsWith('.json') && !contents.includes(path.basename(file))).map(file=>path.relative(root,file).replaceAll('\\','/'));
const result = { unusedCss, unusedModules, unreferencedPublic };
fs.writeFileSync(path.join(root,'.scratch/graph-cleanup/audit.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
