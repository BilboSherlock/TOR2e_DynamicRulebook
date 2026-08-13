const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.md')) {
      results.push(file);
    }
  });
  return results;
}

const mdFiles = getFiles('src/content');
const chapters = [];

// First build index of all chapters, sections, subheaders
mdFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative('src/content', filePath);
  let title = '';
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const titleMatch = fmMatch[1].match(/title:\s*["']?([^"\n\r]+)["']?/);
    if (titleMatch) title = titleMatch[1];
  }
  
  // parse sections and subheaders
  const headings = [...content.matchAll(/^(#{1,6})\s+(.+)$/gm)];
  const sections = [];
  headings.forEach(h => {
    const level = h[1].length;
    let text = h[2].trim().replace(/<\/?[^>]+>/g, '').replace(/\[\/?(red-box|key-box)\]/gi, '').trim();
    text = text.replace(/^(\d{1,2})[\s_.-]+/, '').replace(/^ch(apter)?\s*\d+[\s_.-]*/i, '').trim();
    sections.push({ level, title: text });
  });

  chapters.push({
    filePath: relPath,
    title,
    sections
  });
});

const allLinks = [];
mdFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative('src/content', filePath);
  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    const regex = /\[\[([^\]]+)\]\]/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const inner = match[1];
      if (inner === 'subhead-quote' || inner === '/subhead-quote' || inner === 'inline-quote' || inner === '/inline-quote') {
        continue;
      }
      allLinks.push({
        file: relPath,
        line: lineIdx + 1,
        fullMatch: match[0],
        inner: inner
      });
    }
  });
});

console.log('Total non-quote wikilinks:', allLinks.length);
allLinks.forEach((l, i) => {
  console.log(`${i+1}. [${l.file}:${l.line}] [[${l.inner}]]`);
});
