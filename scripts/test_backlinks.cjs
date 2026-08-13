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

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

function cleanDisplayTitle(title) {
  if (!title) return '';
  return title.replace(/^(\d{1,2})[\s_.-]+/, '').replace(/^ch(apter)?\s*\d+[\s_.-]*/i, '').trim();
}

// Build rulebook structure
const chapters = [];
mdFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative('src/content', filePath);
  let title = '';
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const titleMatch = fmMatch[1].match(/title:\s*["']?([^"\n\r]+)["']?/);
    if (titleMatch) title = titleMatch[1];
  }
  const id = path.basename(filePath).replace(/\.md$/, '');

  // parse sections
  const headingRegex = /^#{1,2}\s+(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];
  const sections = [];

  if (matches.length === 0) {
    sections.push({ id: `${id}-overview`, title: title || 'Overview', content });
  } else {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const rawTitle = match[1].trim();
      const secTitle = cleanDisplayTitle(rawTitle) || rawTitle;
      const startIndex = match.index + match[0].length;
      const endIndex = i + 1 < matches.length ? matches[i + 1].index : content.length;
      const secContent = content.slice(startIndex, endIndex).trim();
      sections.push({
        id: `${id}-sec-${i + 1}`,
        title: secTitle,
        content: `${match[0]}\n\n${secContent}`
      });
    }
  }

  chapters.push({ id, title, sections });
});

function resolveTarget(rawTarget) {
  let clean = rawTarget.trim();
  clean = clean.replace(/^#compendium-/, '');
  clean = decodeURIComponent(clean);

  const parts = clean.split('/');
  const part0 = parts[0] ? parts[0].trim().toLowerCase() : '';
  const part1 = parts[1] ? parts[1].trim().toLowerCase() : '';
  const part2 = parts[2] ? parts[2].trim().toLowerCase() : '';

  let matchedChap = null;
  let matchedSec = null;

  // match chapter
  for (const ch of chapters) {
    if (ch.title.toLowerCase() === part0 || ch.id.toLowerCase() === part0) {
      matchedChap = ch;
      break;
    }
  }

  if (matchedChap && part1) {
    for (const sec of matchedChap.sections) {
      if (sec.title.toLowerCase() === part1 || sec.id.toLowerCase() === part1) {
        matchedSec = sec;
        break;
      }
    }
  }

  if (!matchedChap) {
    // try matching part0 across all sections
    for (const ch of chapters) {
      for (const sec of ch.sections) {
        if (sec.title.toLowerCase() === part0) {
          matchedChap = ch;
          matchedSec = sec;
          break;
        }
      }
      if (matchedChap) break;
    }
  }

  return {
    chapterId: matchedChap ? matchedChap.id : null,
    chapterTitle: matchedChap ? matchedChap.title : null,
    sectionId: matchedSec ? matchedSec.id : (matchedChap && matchedChap.sections.length > 0 ? matchedChap.sections[0].id : null),
    sectionTitle: matchedSec ? matchedSec.title : (matchedChap && matchedChap.sections.length > 0 ? matchedChap.sections[0].title : null),
  };
}

function extractLinks(secContent) {
  const links = [];
  // 1. [[Target]](Label)
  const fullLinkRegex = /\[\[([^\]]+)\]\](?:\(([^)]*)\))?/g;
  let m;
  while ((m = fullLinkRegex.exec(secContent)) !== null) {
    const rawTarget = m[1];
    if (['subhead-quote', '/subhead-quote', 'inline-quote', '/inline-quote'].includes(rawTarget)) continue;
    const label = m[2] || rawTarget;
    const res = resolveTarget(rawTarget);
    links.push({ rawTarget, label, ...res });
  }
  return links;
}

let totalLinksFound = 0;
let totalBacklinksResolved = 0;

chapters.forEach(ch => {
  ch.sections.forEach(sec => {
    const outbound = extractLinks(sec.content);
    totalLinksFound += outbound.length;

    // Check inbound backlinks
    const inbound = [];
    chapters.forEach(otherCh => {
      otherCh.sections.forEach(otherSec => {
        if (otherCh.id === ch.id && otherSec.id === sec.id) return;
        const otherLinks = extractLinks(otherSec.content);
        const pointsToMe = otherLinks.some(l => {
          if (l.sectionId && l.sectionId === sec.id) return true;
          if (l.chapterId && l.chapterId === ch.id && l.sectionTitle && l.sectionTitle.toLowerCase() === sec.title.toLowerCase()) return true;
          return false;
        });
        if (pointsToMe) {
          inbound.push({ chapterTitle: otherCh.title, sectionTitle: otherSec.title });
        }
      });
    });

    totalBacklinksResolved += inbound.length;
  });
});

console.log(`Total Outbound Links across app: ${totalLinksFound}`);
console.log(`Total Inbound Backlinks resolved across app: ${totalBacklinksResolved}`);
