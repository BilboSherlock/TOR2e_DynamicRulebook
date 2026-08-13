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
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let hMatch;
  while ((hMatch = headingRegex.exec(content)) !== null) {
    const level = hMatch[1].length;
    let text = hMatch[2].trim().replace(/<\/?[^>]+>/g, '').replace(/\[\/?(red-box|key-box)\]/gi, '').trim();
    text = text.replace(/^(\d{1,2})[\s_.-]+/, '').replace(/^ch(apter)?\s*\d+[\s_.-]*/i, '').trim();
    headings.push({ level, title: text, line: content.slice(0, hMatch.index).split('\n').length });
  }

  chapters.push({
    filePath: relPath,
    fileName: path.basename(filePath),
    title,
    headings
  });
});

function resolveTarget(rawTarget, currentFile) {
  let displayLabel = rawTarget;
  let targetClean = rawTarget;

  if (rawTarget.includes('|')) {
    const parts = rawTarget.split('|');
    displayLabel = parts[1].trim();
    targetClean = parts[1].trim();
  }

  // Clean foundry item prefix e.g. "Actor.vSWhCz54fZmfJM3x.Item.zvMN48EVNQVsfn98"
  if (targetClean.includes('Item.') || targetClean.includes('Actor.')) {
    targetClean = displayLabel;
  }

  const targetLower = targetClean.toLowerCase().trim();

  // 1. Check if target matches a Chapter title
  for (const ch of chapters) {
    if (ch.title.toLowerCase() === targetLower) {
      return {
        chapterTitle: ch.title,
        sectionTitle: ch.title,
        headerAnchor: null,
        displayLabel
      };
    }
  }

  // 2. Check if target matches a level 1 or 2 heading (Section)
  for (const ch of chapters) {
    for (const h of ch.headings) {
      if ((h.level === 1 || h.level === 2) && h.title.toLowerCase() === targetLower) {
        return {
          chapterTitle: ch.title,
          sectionTitle: h.title,
          headerAnchor: null,
          displayLabel
        };
      }
    }
  }

  // 3. Check if target matches a level 3+ heading (Subheader)
  for (const ch of chapters) {
    for (const h of ch.headings) {
      if (h.level >= 3 && h.title.toLowerCase() === targetLower) {
        let parentSec = ch.title;
        for (const parentH of ch.headings) {
          if ((parentH.level === 1 || parentH.level === 2) && parentH.line < h.line) {
            parentSec = parentH.title;
          }
        }
        return {
          chapterTitle: ch.title,
          sectionTitle: parentSec,
          headerAnchor: `#${h.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
          displayLabel
        };
      }
    }
  }

  // 4. Special domain mapping
  if (targetLower.includes('heroic culture')) {
    return { chapterTitle: 'Adventurers', sectionTitle: 'Heroic Cultures', headerAnchor: null, displayLabel };
  }
  if (['poor', 'frugal', 'common', 'prosperous', 'rich', 'very rich'].includes(targetLower)) {
    return { chapterTitle: 'Characteristics', sectionTitle: 'Standard of Living', headerAnchor: `#${targetLower}`, displayLabel };
  }
  if (targetLower === 'standard of living') {
    return { chapterTitle: 'Characteristics', sectionTitle: 'Standard of Living', headerAnchor: null, displayLabel };
  }
  if (['brawling attack', 'brawling'].includes(targetLower)) {
    return { chapterTitle: 'Adventuring Phases', sectionTitle: 'Combat', headerAnchor: '#brawling-attack', displayLabel };
  }
  if (['awe', 'athletics', 'awareness', 'hunting', 'song', 'craft', 'enhearten', 'travel', 'insight', 'healing', 'courtesy', 'battle', 'persuade', 'stealth', 'scan', 'explore', 'riddle', 'lore'].includes(targetLower)) {
    return { chapterTitle: 'Characteristics', sectionTitle: 'Skills', headerAnchor: `#${targetLower}`, displayLabel };
  }
  if (['bold', 'eager', 'fair', 'fierce', 'generous', 'proud', 'tall', 'wilful', 'cunning', 'lordly', 'secretive', 'stern', 'wary', 'spiritual recovery', 'keen-eyed', 'merry', 'patient', 'subtle', 'swift', 'fair-spoken', 'faithful', 'honourable', 'inquisitive', 'rustic', 'true-hearted', 'dalish', 'reputable'].includes(targetLower)) {
    return { chapterTitle: 'Adventurers', sectionTitle: 'Distinctive Features', headerAnchor: `#${targetLower}`, displayLabel };
  }

  // Fallback
  for (const ch of chapters) {
    for (const h of ch.headings) {
      if (h.title.toLowerCase().includes(targetLower) || targetLower.includes(h.title.toLowerCase())) {
        return {
          chapterTitle: ch.title,
          sectionTitle: h.title,
          headerAnchor: null,
          displayLabel
        };
      }
    }
  }

  return {
    chapterTitle: 'General',
    sectionTitle: targetClean,
    headerAnchor: null,
    displayLabel
  };
}

const replacementList = [];

mdFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative('src/content', filePath);

  const regex = /\[\[([^\]]+)\]\]/g;
  let modified = false;

  const newContent = content.replace(regex, (match, inner) => {
    if (['subhead-quote', '/subhead-quote', 'inline-quote', '/inline-quote'].includes(inner)) {
      return match;
    }

    const res = resolveTarget(inner, filePath);
    let fullTarget = `${res.chapterTitle}/${res.sectionTitle}`;
    if (res.headerAnchor) {
      fullTarget += `/${res.headerAnchor}`;
    }

    const formatted = `[[${fullTarget}]](${res.displayLabel})`;
    replacementList.push({
      file: relPath,
      original: match,
      formatted: formatted
    });

    modified = true;
    return formatted;
  });

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
});

console.log(`Successfully replaced ${replacementList.length} wikilinks across files.`);
fs.writeFileSync('scripts/replacements_summary.json', JSON.stringify(replacementList, null, 2));
