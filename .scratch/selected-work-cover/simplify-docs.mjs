import fs from 'node:fs/promises';

const path='.impeccable/design.json';
const design=JSON.parse(await fs.readFile(path,'utf8'));
const row=design.components.find(component=>component.name==='Selected-work row');
row.html=row.html.replace('ds-project-context-aurelia ','').replace(/<span class="ds-project-context"[^>]*>[\s\S]*?<\/span><\/span>/g,'');
row.css=row.css.replace(/\.ds-project-(?:context|type)\{[^}]*\}/g,'');
await fs.writeFile(path,`${JSON.stringify(design,null,2)}\n`);
