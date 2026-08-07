import { RuleChapter, RuleSection, SubHeader, SupplementCategory } from '../types';

// Load all markdown files from /src/content dynamically using Vite's eager raw import
const rawMarkdownFiles = import.meta.glob('/src/content/**/*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string }>;

interface Frontmatter {
  id?: string;
  number?: number;
  title?: string;
  supplement?: SupplementCategory;
  description?: string;
  iconName?: string;
  tags?: string[];
}

function parseYamlFrontmatter(text: string): { frontmatter: Frontmatter; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = text.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: text };
  }

  const rawYaml = match[1];
  const body = match[2];
  const frontmatter: Frontmatter = {};

  rawYaml.split(/\r?\n/).forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      // Remove surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      // Handle array tags e.g. ["tag1", "tag2"]
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          const parsedArr = JSON.parse(val.replace(/'/g, '"'));
          if (Array.isArray(parsedArr)) {
            (frontmatter as Record<string, unknown>)[key] = parsedArr;
            return;
          }
        } catch {
          // ignore fallback
        }
      }

      if (key === 'number') {
        frontmatter.number = parseInt(val, 10) || 0;
      } else {
        (frontmatter as Record<string, unknown>)[key] = val;
      }
    }
  });

  return { frontmatter, body };
}

export function cleanDisplayTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/^(\d{1,2})[\s_.-]+/, '')
    .replace(/^ch(apter)?\s*\d+[\s_.-]*/i, '')
    .trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractSubHeaders(content: string): SubHeader[] {
  const subHeadingRegex = /^\s*(#{3,6})\s+(.+)$/gm;
  const matches = [...content.matchAll(subHeadingRegex)];
  return matches.map((m) => {
    const hashes = m[1];
    let title = m[2].trim();
    // Clean any HTML or box shortcodes if present on title line
    title = title.replace(/<\/?[^>]+>/g, '').replace(/\[\/?(red-box|key-box)\]/gi, '').trim();
    title = cleanDisplayTitle(title);
    const level = hashes.length;
    return {
      id: slugify(title),
      title,
      level: level >= 3 ? level : 3,
    };
  });
}

function parseSubsections(body: string, chapterId: string): RuleSection[] {
  // Split section boundaries by # Heading 1 or ## Heading 2 lines
  const headingRegex = /^#{1,2}\s+(.+)$/gm;
  const matches = [...body.matchAll(headingRegex)];

  if (matches.length === 0) {
    // Single section with entire body
    const subHeaders = extractSubHeaders(body);
    return [
      {
        id: `${chapterId}-overview`,
        title: 'Overview',
        summary: 'Overview and details for this section.',
        content: body.trim(),
        level: 1,
        subHeaders,
      },
    ];
  }

  const sections: RuleSection[] = [];
  
  // Content before first # or ## heading (if any)
  const firstIndex = matches[0].index ?? 0;
  if (firstIndex > 0) {
    const introText = body.slice(0, firstIndex).trim();
    if (introText) {
      const subHeaders = extractSubHeaders(introText);
      sections.push({
        id: `${chapterId}-intro`,
        title: 'Introduction',
        summary: introText.replace(/[*_#`]/g, '').slice(0, 120) + '...',
        content: introText,
        level: 1,
        subHeaders,
      });
    }
  }

  // Iterate over each # or ## heading block
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const rawHeading = match[0].trim();
    const rawTitle = match[1].trim();
    const sectionTitle = cleanDisplayTitle(rawTitle) || rawTitle;
    const startIndex = match.index! + match[0].length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index! : body.length;
    const sectionContent = body.slice(startIndex, endIndex).trim();

    const secId = `${chapterId}-sec-${i + 1}`;
    
    // Determine heading level (1 for #, 2 for ##)
    const level = rawHeading.startsWith('##') ? 2 : 1;

    // Extract first paragraph or list line for summary
    const firstLine = sectionContent.split(/\r?\n/).find(l => l.trim().length > 0 && !l.startsWith('#')) || '';
    const summary = firstLine.replace(/[*_#`]/g, '').slice(0, 120) + (firstLine.length > 120 ? '...' : '');

    const subHeaders = extractSubHeaders(sectionContent);

    sections.push({
      id: secId,
      title: sectionTitle,
      summary: summary || sectionTitle,
      content: `${rawHeading}\n\n${sectionContent}`,
      level,
      subHeaders: subHeaders.length > 0 ? subHeaders : undefined,
    });
  }

  return sections;
}

let cachedRulebook: RuleChapter[] | null = null;

export function loadMarkdownRulebook(): RuleChapter[] {
  if (cachedRulebook) return cachedRulebook;

  const loadedChapters: RuleChapter[] = [];

  const fileEntries = Object.entries(rawMarkdownFiles);

  // Sort files by path / number prefix
  fileEntries.sort(([pathA], [pathB]) => pathA.localeCompare(pathB));

  for (const [filePath, mod] of fileEntries) {
    const rawContent = mod.default || '';
    const { frontmatter, body } = parseYamlFrontmatter(rawContent);

    // Derive file name id fallback
    const fileName = filePath.split('/').pop()?.replace(/\.md$/, '') || 'rule';
    const id = frontmatter.id || fileName;
    const rawTitle = frontmatter.title || fileName;
    const title = cleanDisplayTitle(rawTitle) || rawTitle;
    const supplement = frontmatter.supplement || 'Core Rules';
    const description = frontmatter.description || '';
    const iconName = frontmatter.iconName || 'BookOpen';
    const number = frontmatter.number || loadedChapters.length + 1;

    const sections = parseSubsections(body, id);

    loadedChapters.push({
      id,
      number,
      title,
      supplement,
      description,
      iconName,
      sections,
    });
  }

  cachedRulebook = loadedChapters;
  return loadedChapters;
}
