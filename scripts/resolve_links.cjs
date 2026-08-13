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

// Index all chapters, sections, subheaders
mdFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative('src/content', filePath);
  let title = '';
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const titleMatch = fmMatch[1].match(/title:\s*["']?([^"\n\r]+)["']?/);
    if (titleMatch) title = titleMatch[1];
  }
  
  // parse headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let hMatch;
  while ((hMatch = headingRegex.exec(content)) !== null) {
    const level = hMatch[1].length;
    let text = hMatch[2].trim().replace(/<\/?[^>]+>/g, '').replace(/\[\/?(red-box|key-box)\]/gi, '').trim();
    text = text.replace(/^(\d{1,2})[\s_.-]+/, '').replace(/^ch(apter)?\s*\d+[\s_.-]*/i, '').trim();
    headings.push({ level, raw: hMatch[2].trim(), title: text, line: content.slice(0, hMatch.index).split('\n').length });
  }

  chapters.push({
    filePath: relPath,
    fileName: path.basename(filePath),
    title,
    headings
  });
});

// Search function to resolve a link target string to (ChapterTitle, SectionTitle, HeaderAnchor)
function resolveTarget(rawTarget, currentFile) {
  // Handle compendium / item format e.g. "Item.dH5JERXRatKLOOw9|Dalish" or "Actor...|Rustic"
  let displayLabel = rawTarget;
  let targetClean = rawTarget;

  if (rawTarget.includes('|')) {
    const parts = rawTarget.split('|');
    displayLabel = parts[1].trim();
    targetClean = parts[1].trim();
  }

  const targetLower = targetClean.toLowerCase().trim();

  // 1. Check if target matches a Chapter title
  for (const ch of chapters) {
    if (ch.title.toLowerCase() === targetLower) {
      return {
        chapterTitle: ch.title,
        fileName: ch.fileName,
        sectionTitle: ch.title,
        headerAnchor: null,
        displayLabel,
        confidence: 'exact-chapter'
      };
    }
  }

  // 2. Check if target matches a level 1 or 2 heading (Section)
  for (const ch of chapters) {
    for (const h of ch.headings) {
      if ((h.level === 1 || h.level === 2) && h.title.toLowerCase() === targetLower) {
        return {
          chapterTitle: ch.title,
          fileName: ch.fileName,
          sectionTitle: h.title,
          headerAnchor: null,
          displayLabel,
          confidence: 'exact-section'
        };
      }
    }
  }

  // 3. Check if target matches a level 3+ heading (Subheader / Header)
  for (const ch of chapters) {
    for (const h of ch.headings) {
      if (h.level >= 3 && h.title.toLowerCase() === targetLower) {
        // find parent section for this heading
        let parentSec = ch.title;
        for (const parentH of ch.headings) {
          if ((parentH.level === 1 || parentH.level === 2) && parentH.line < h.line) {
            parentSec = parentH.title;
          }
        }
        return {
          chapterTitle: ch.title,
          fileName: ch.fileName,
          sectionTitle: parentSec,
          headerAnchor: `#${h.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
          displayLabel,
          confidence: 'exact-header'
        };
      }
    }
  }

  // 4. Partial / Concept matches
  // Common terms:
  if (targetLower.includes('heroic culture')) {
    return { chapterTitle: 'Adventurers', fileName: '03-adventurers.md', sectionTitle: 'Heroic Cultures', headerAnchor: null, displayLabel, confidence: 'concept' };
  }
  if (['poor', 'frugal', 'common', 'prosperous', 'rich', 'very rich', 'standard of living'].includes(targetLower)) {
    return { chapterTitle: 'Characteristics', fileName: '04-characteristics.md', sectionTitle: 'Standard of Living', headerAnchor: null, displayLabel, confidence: 'concept' };
  }
  if (['brawling attack', 'brawling'].includes(targetLower)) {
    return { chapterTitle: 'Adventuring Phases', fileName: '06-adventuring-phases.md', sectionTitle: 'Combat', headerAnchor: '#brawling-attack', displayLabel, confidence: 'concept' };
  }
  if (['awe', 'athletics', 'awareness', 'hunting', 'song', 'craft', 'enhearten', 'travel', 'insight', 'healing', 'courtesy', 'battle', 'persuade', 'stealth', 'scan', 'explore', 'riddle', 'lore'].includes(targetLower)) {
    return { chapterTitle: 'Characteristics', fileName: '04-characteristics.md', sectionTitle: 'Skills', headerAnchor: `#${targetLower}`, displayLabel, confidence: 'concept' };
  }
  if (['bold', 'eager', 'fair', 'fierce', 'generous', 'proud', 'tall', 'wilful', 'cunning', 'lordly', 'secretive', 'stern', 'wary', 'spiritual recovery', 'keen-eyed', 'merry', 'patient', 'subtle', 'swift', 'fair-spoken', 'faithful', 'honourable', 'inquisitive', 'rustic', 'true-hearted', 'dalish', 'reputable'].includes(targetLower)) {
    return { chapterTitle: 'Adventurers', fileName: '03-adventurers.md', sectionTitle: 'Distinctive Features', headerAnchor: `#${targetLower}`, displayLabel, confidence: 'concept' };
  }

  // Fallback match across all headings partial
  for (const ch of chapters) {
    for (const h of ch.headings) {
      if (h.title.toLowerCase().includes(targetLower) || targetLower.includes(h.title.toLowerCase())) {
        return {
          chapterTitle: ch.title,
          fileName: ch.fileName,
          sectionTitle: h.title,
          headerAnchor: null,
          displayLabel,
          confidence: 'partial-heading'
        };
      }
    }
  }

  return {
    chapterTitle: 'General',
    fileName: path.basename(currentFile),
    sectionTitle: targetClean,
    headerAnchor: null,
    displayLabel,
    confidence: 'fallback'
  };
}

// Collect all links across all files
const linkReport = [];

mdFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative('src/content', filePath);
  const lines = content.split('\n');

  lines.forEach((line, lineIdx) => {
    const regex = /\[\[([^\]]+)\]\]/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const inner = match[1];
      if (['subhead-quote', '/subhead-quote', 'inline-quote', '/inline-quote'].includes(inner)) {
        continue;
      }
      const res = resolveTarget(inner, filePath);
      
      // Construct full link string
      // Example: [[Adventuring Phases/Adventuring Phase]](Adventuring Phase)
      // or if header: [[Adventuring Phases/Combat/#brawling-attack]](Brawling Attack)
      let fullLinkTarget = `${res.chapterTitle}/${res.sectionTitle}`;
      if (res.headerAnchor) {
        fullLinkTarget += `/${res.headerAnchor}`;
      }
      
      const newFormattedLink = `[[${fullLinkTarget}]](${res.displayLabel})`;

      linkReport.push({
        file: relPath,
        line: lineIdx + 1,
        original: match[0],
        inner: inner,
        res: res,
        formatted: newFormattedLink
      });
    }
  });
});

console.log(`Total Wikilinks processed: ${linkReport.length}`);
fs.writeFileSync('scripts/link_report.json', JSON.stringify(linkReport, null, 2));
console.log('Saved link report to scripts/link_report.json');
