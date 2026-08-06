import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  X,
  ArrowUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RuleChapter, RuleSection } from '../types';
import { slugify } from '../data/rulebookLoader';

function isAttributesTable(node: any): boolean {
  try {
    const thead = node?.children?.find((c: any) => c.tagName === 'thead');
    const tr = thead?.children?.find((c: any) => c.tagName === 'tr');
    const th = tr?.children?.find((c: any) => c.tagName === 'th');
    const textNode = th?.children?.[0];
    const text = textNode?.value || '';
    return text.trim().toLowerCase() === 'roll';
  } catch {
    return false;
  }
}

interface MarkdownViewerProps {
  chapter: RuleChapter;
  section: RuleSection;
  activeSubHeaderId?: string | null;
  onNavigateSection: (chapterId: string, sectionId: string, subHeaderId?: string) => void;
  allChapters: RuleChapter[];
}

export const MarkdownViewerComponent: React.FC<MarkdownViewerProps> = ({
  chapter,
  section,
  activeSubHeaderId,
  onNavigateSection,
  allChapters,
}) => {
  // Breadcrumb dropdown states
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);

  // Close dropdowns on section change or outside click
  useEffect(() => {
    setIsChapterMenuOpen(false);
    setIsSectionMenuOpen(false);
  }, [chapter.id, section.id]);

  // Scroll to active sub-header if provided, or top of section
  useEffect(() => {
    if (activeSubHeaderId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(activeSubHeaderId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [section.id, activeSubHeaderId]);

  // Preprocess Foundry VTT compendium links, quote shortcodes, and box shortcodes
  const processedContent = useMemo(() => {
    let text = section.content;

    // Process quote shortcodes BEFORE wikilinks
    text = text.replace(
      /\[\[subhead-quote\]\]([\s\S]*?)\[\[\/subhead-quote\]\]/gi,
      (_, quoteText) => `\n\n<div class="subhead-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
    );
    text = text.replace(
      /\[subhead-quote\]([\s\S]*?)\[\/subhead-quote\]/gi,
      (_, quoteText) => `\n\n<div class="subhead-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
    );

    text = text.replace(
      /\[\[inline-quote\]\]([\s\S]*?)\[\[\/inline-quote\]\]/gi,
      (_, quoteText) => `\n\n<div class="inline-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
    );
    text = text.replace(
      /\[inline-quote\]([\s\S]*?)\[\/inline-quote\]/gi,
      (_, quoteText) => `\n\n<div class="inline-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
    );

    // Preprocess Foundry VTT compendium links, Wikilinks, and box shortcodes
    text = text.replace(/\[\[Compendium\.[^\]|]+\|([^\]]+)\]\]/g, (_, label) => `[${label}](#compendium-${encodeURIComponent(label)})`);
    text = text.replace(/\[\[Compendium\.([^\]]+)\]\]/g, (_, title) => `[${title}](#compendium-${encodeURIComponent(title)})`);
    text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, target, label) => `[${label}](#compendium-${encodeURIComponent(target)})`);
    text = text.replace(/\[\[([^\]]+)\]\]/g, (_, title) => `[${title}](#compendium-${encodeURIComponent(title)})`);

    // Support key-box, red-box, and example-box container syntaxes with newline separation for proper markdown block parsing
    text = text.replace(/:::\s*key-box/gi, '\n\n<div class="key-box">\n\n');
    text = text.replace(/:::\s*red-box/gi, '\n\n<div class="red-box">\n\n');
    text = text.replace(/:::\s*example/gi, '\n\n<div class="example-box">\n\n');
    text = text.replace(/:::/g, '\n\n</div>\n\n');

    text = text.replace(/<key-box>/gi, '\n\n<div class="key-box">\n\n').replace(/<\/key-box>/gi, '\n\n</div>\n\n');
    text = text.replace(/<red-box>/gi, '\n\n<div class="red-box">\n\n').replace(/<\/red-box>/gi, '\n\n</div>\n\n');
    text = text.replace(/<example>/gi, '\n\n<div class="example-box">\n\n').replace(/<\/example>/gi, '\n\n</div>\n\n');
    text = text.replace(/\[key-box\]/gi, '\n\n<div class="key-box">\n\n').replace(/\[\/key-box\]/gi, '\n\n</div>\n\n');
    text = text.replace(/\[red-box\]/gi, '\n\n<div class="red-box">\n\n').replace(/\[\/red-box\]/gi, '\n\n</div>\n\n');
    text = text.replace(/\[example\]/gi, '\n\n<div class="example-box">\n\n').replace(/\[\/example\]/gi, '\n\n</div>\n\n');

    // Preprocess Letter from Gandalf to wrap it in a custom handwritten glowing container
    text = text.replace(
      /## Letter from Gandalf\s*([\s\S]*?)(?=\n## |\n\* \* \*|$)/gi,
      (match, bodyText) => {
        return `## Letter from Gandalf\n\n<div class="gandalf-letter-body">\n\n${bodyText}\n\n</div>`;
      }
    );

    // Format Favoured and Ill-Favoured consistently
    text = text.replace(/([*_]+)(Ill[- ]Favoured|ill[- ]favoured|ill favoured|Ill favoured)([*_]+)/gi, '*Ill-Favoured*');
    text = text.replace(/(?<![*_a-zA-Z])(Ill[- ]favoured|ill[- ]favoured|ill favoured|Ill[- ]Favoured)(?![*_a-zA-Z])/gi, '*Ill-Favoured*');
    text = text.replace(/([*_]+)(Favoured|favoured)([*_]+)/gi, '*Favoured*');
    text = text.replace(/(?<![*_a-zA-Z])Favoured(?![*_a-zA-Z])/g, '*Favoured*');

    // Format Uppercase Skills to bold Title Case
    text = text.replace(
      /\b(AWE|ATHLETICS|AWARENESS|HUNTING|SONG|CRAFT|ENHEARTEN|TRAVEL|INSIGHT|HEALING|COURTESY|BATTLE|PERSUADE|STEALTH|SCAN|EXPLORE|RIDDLE|LORE|PROTECTION)\b/g,
      (m) => `**${m.charAt(0) + m.slice(1).toLowerCase()}**`
    );
    text = text.replace(/\*{4,}([^*]+)\*{4,}/g, '**$1**');

    return text;
  }, [section.content]);

  // Find matching chapter, section, or subheader for link navigation
  const handleCompendiumNavigate = (targetTitle: string) => {
    const cleanTarget = targetTitle.trim().toLowerCase();
    if (!cleanTarget) return;

    // 1. Exact match on section title
    for (const ch of allChapters) {
      for (const sec of ch.sections) {
        if (sec.title.toLowerCase() === cleanTarget) {
          onNavigateSection(ch.id, sec.id);
          return;
        }
      }
    }

    // 2. Exact match on subheader title inside a section
    for (const ch of allChapters) {
      for (const sec of ch.sections) {
        if (sec.subHeaders) {
          for (const sub of sec.subHeaders) {
            if (sub.title.toLowerCase() === cleanTarget) {
              onNavigateSection(ch.id, sec.id, sub.id);
              return;
            }
          }
        }
      }
    }

    // 3. Exact match on chapter title
    for (const ch of allChapters) {
      if (ch.title.toLowerCase() === cleanTarget) {
        if (ch.sections.length > 0) {
          onNavigateSection(ch.id, ch.sections[0].id);
          return;
        }
      }
    }

    // 4. Partial/includes match on section title
    for (const ch of allChapters) {
      for (const sec of ch.sections) {
        if (sec.title.toLowerCase().includes(cleanTarget) || cleanTarget.includes(sec.title.toLowerCase())) {
          onNavigateSection(ch.id, sec.id);
          return;
        }
      }
    }

    // 5. Partial/includes match on subheader title
    for (const ch of allChapters) {
      for (const sec of ch.sections) {
        if (sec.subHeaders) {
          for (const sub of sec.subHeaders) {
            if (sub.title.toLowerCase().includes(cleanTarget) || cleanTarget.includes(sub.title.toLowerCase())) {
              onNavigateSection(ch.id, sec.id, sub.id);
              return;
            }
          }
        }
      }
    }

    // 6. Partial/includes match on chapter title
    for (const ch of allChapters) {
      if (ch.title.toLowerCase().includes(cleanTarget) || cleanTarget.includes(ch.title.toLowerCase())) {
        if (ch.sections.length > 0) {
          onNavigateSection(ch.id, ch.sections[0].id);
          return;
        }
      }
    }
  };

  // Find active subheader title if applicable
  const activeSubHeaderTitle = useMemo(() => {
    if (!activeSubHeaderId || !section.subHeaders) return null;
    const found = section.subHeaders.find((s) => s.id === activeSubHeaderId);
    return found ? found.title : null;
  }, [activeSubHeaderId, section.subHeaders]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isPast = window.scrollY > 300;
          setShowBackToTop((prev) => (prev !== isPast ? isPast : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flat list of all sections across all chapters for next/prev navigation
  const flatSections = useMemo(() => {
    const list: { chapterId: string; sectionId: string; title: string }[] = [];
    allChapters.forEach((ch) => {
      ch.sections.forEach((sec) => {
        list.push({
          chapterId: ch.id,
          sectionId: sec.id,
          title: `${ch.number}.${sec.title}`,
        });
      });
    });
    return list;
  }, [allChapters]);

  const currentIndex = flatSections.findIndex(
    (s) => s.chapterId === chapter.id && s.sectionId === section.id
  );
  const prevSection = currentIndex > 0 ? flatSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < flatSections.length - 1
      ? flatSections[currentIndex + 1]
      : null;

  return (
    <main className="flex-1 min-w-0 max-w-4xl mx-auto px-3 sm:px-6 py-4 md:py-8 lg:px-8 flex flex-col relative">
      {/* Interactive Navigational Header & Page Frame with Smooth Custom Page Transitions */}
      <div className="relative w-full flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${chapter.id}-${section.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {/* Header: Fades in cleanly with main page unit */}
            <div className="relative z-20 pb-3">
              <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-serif font-semibold text-[#6B5748] flex-wrap">
                {/* Step 1: Supplement Badge */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (chapter.sections.length > 0) {
                      onNavigateSection(chapter.id, chapter.sections[0].id);
                    }
                  }}
                  className="px-2 py-0.5 rounded-[2px] bg-[#E8DCC2] text-[#8E1616] font-bold text-[10px] sm:text-[11px] border border-[#C8B693] hover:bg-[#E0D0AE] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Book Supplement"
                >
                  <BookOpen className="w-3 h-3 text-[#8E1616]" />
                  <span>{chapter.supplement}</span>
                </motion.button>

                <span className="text-[#8E1616] font-bold">/</span>

                {/* Step 2: Chapter Dropdown Step */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsChapterMenuOpen(!isChapterMenuOpen);
                      setIsSectionMenuOpen(false);
                    }}
                    className="px-2 py-0.5 rounded-[2px] bg-[#FAF5EB] text-[#28211D] border border-[#D8C8A8] hover:border-[#8E1616] flex items-center gap-1 cursor-pointer font-cinzel font-bold text-xs"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">
                      Ch {chapter.number}. {chapter.title}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-[#8E1616] transition-transform ${isChapterMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Chapter Dropdown Popover */}
                  <AnimatePresence>
                    {isChapterMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsChapterMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          className="absolute left-0 mt-1.5 w-64 sm:w-80 bg-[#FAF5EB] border-2 border-[#D8C8A8] rounded-[2px] shadow-xl z-40 max-h-72 overflow-y-auto p-1.5 space-y-1"
                        >
                          <div className="text-[10px] font-cinzel font-bold text-[#8E1616] px-2 py-1 border-b border-[#D8C8A8]">
                            Select Chapter
                          </div>
                          {allChapters.map((ch) => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                if (ch.sections.length > 0) {
                                  onNavigateSection(ch.id, ch.sections[0].id);
                                }
                                setIsChapterMenuOpen(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 text-xs rounded-[2px] font-serif transition-colors flex items-center justify-between cursor-pointer ${
                                ch.id === chapter.id
                                  ? 'bg-[#8E1616] text-[#FAF5EB] font-bold'
                                  : 'hover:bg-[#E8DCC2] text-[#28211D]'
                              }`}
                            >
                              <span className="truncate">Ch {ch.number}. {ch.title}</span>
                              <span className="text-[10px] opacity-75 font-mono">{ch.sections.length} sec</span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <span className="text-[#8E1616] font-bold">/</span>

                {/* Step 3: Section Dropdown Step */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsSectionMenuOpen(!isSectionMenuOpen);
                      setIsChapterMenuOpen(false);
                    }}
                    className="px-2 py-0.5 rounded-[2px] bg-[#8E1616] text-[#FAF5EB] font-bold flex items-center gap-1 cursor-pointer text-xs shadow-2xs"
                  >
                    <span className="truncate max-w-[130px] sm:max-w-[240px]">
                      {section.title}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isSectionMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Section Dropdown Popover */}
                  <AnimatePresence>
                    {isSectionMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsSectionMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          className="absolute left-0 mt-1.5 w-64 sm:w-80 bg-[#FAF5EB] border-2 border-[#D8C8A8] rounded-[2px] shadow-xl z-40 max-h-72 overflow-y-auto p-1.5 space-y-1"
                        >
                          <div className="text-[10px] font-cinzel font-bold text-[#8E1616] px-2 py-1 border-b border-[#D8C8A8]">
                            Sections in Ch {chapter.number}
                          </div>
                          {chapter.sections.map((sec) => (
                            <button
                              key={sec.id}
                              onClick={() => {
                                onNavigateSection(chapter.id, sec.id);
                                setIsSectionMenuOpen(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 text-xs rounded-[2px] font-serif transition-colors cursor-pointer ${
                                sec.id === section.id
                                  ? 'bg-[#8E1616] text-[#FAF5EB] font-bold'
                                  : 'hover:bg-[#E8DCC2] text-[#28211D]'
                              }`}
                            >
                              {sec.title}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Optional Step 4: Active SubHeader / Anchor */}
                {activeSubHeaderTitle && (
                  <>
                    <span className="text-[#8E1616] font-bold">/</span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigateSection(chapter.id, section.id)}
                      className="px-2 py-0.5 rounded-[2px] bg-[#B8860B] text-[#FAF5EB] font-bold flex items-center gap-1 cursor-pointer text-xs"
                      title="Backtrack to Section Start"
                    >
                      <span className="truncate max-w-[120px] sm:max-w-[180px]">
                        {activeSubHeaderTitle}
                      </span>
                      <X className="w-3 h-3 hover:scale-125 transition-transform" />
                    </motion.button>
                  </>
                )}
              </nav>
            </div>

            {/* Separating Line: Fixed on the fading page */}
            <div className="relative mb-4 sm:mb-6 overflow-hidden py-0.5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'center' }}
                className="w-full border-b-2 border-[#D8C8A8]"
              />
            </div>

            {/* Body Article: Styled parchment paper container */}
            <div className="bg-[#FAF3E0] border-2 border-[#D8C8A8] rounded-[2px] p-4 sm:p-8 lg:p-10 shadow-xs transition-all mb-8 relative">
              <article className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      return <h1 id={slugify(text)} className="scroll-mt-20 text-center">{children}</h1>;
                    },
                    h2: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      return <h2 id={slugify(text)} className="scroll-mt-20 text-center">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      return <h3 id={slugify(text)} className="scroll-mt-20 text-center">{children}</h3>;
                    },
                    h4: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      return <h4 id={slugify(text)} className="scroll-mt-20 text-left pl-5 md:pl-6">{children}</h4>;
                    },
                    h5: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      return <h5 id={slugify(text)} className="scroll-mt-20 text-center">{children}</h5>;
                    },
                    h6: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      return <h6 id={slugify(text)} className="scroll-mt-20 text-center">{children}</h6>;
                    },
                    p: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      const trimmed = text.trim();
                      const lower = trimmed.toLowerCase();

                      if (lower.startsWith('example:') || lower.startsWith('example ') || lower.startsWith('examples of') || lower === 'example') {
                        return (
                          <div className="example-box my-5 p-4 sm:p-5 bg-[#FAF2E4]/80 border-t-4 border-b-4 border-double border-[#8E1616] rounded-[2px] relative shadow-2xs">
                            <span className="block font-cinzel font-bold text-[#8E1616] text-xs tracking-wider uppercase mb-1.5">
                              ❖ Example
                            </span>
                            <div className="text-[#2D241E] leading-relaxed m-0">{children}</div>
                          </div>
                        );
                      }

                      return <p className="mb-4 text-[#2D241E] leading-relaxed">{children}</p>;
                    },
                    strong: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      const clean = text.trim().toLowerCase().replace(/[^a-z0-9 \-]/g, '');

                      const ATTRIBUTE_NAMES = new Set(['strength', 'heart', 'wits']);

                      if (ATTRIBUTE_NAMES.has(clean) || clean.endsWith(' attribute') || clean.endsWith(' tn')) {
                        return (
                          <strong className="attribute-highlight">
                            {text.toUpperCase()}
                          </strong>
                        );
                      }

                      const SKILL_NAMES = new Set([
                        'awe', 'athletics', 'awareness', 'hunting', 'song', 'craft',
                        'enhearten', 'travel', 'insight', 'healing', 'courtesy', 'battle',
                        'persuade', 'stealth', 'scan', 'explore', 'riddle', 'lore',
                        'axes', 'bows', 'spears', 'swords', 'brawling', 'daggers',
                        'protection', 'valour', 'wisdom', 'parry', 'shadow', 'hope', 'endurance',
                        'protection roll', 'valour roll', 'wisdom roll'
                      ]);

                      const isSkillOrRoll =
                        SKILL_NAMES.has(clean) ||
                        clean.endsWith(' roll') ||
                        clean.endsWith(' test') ||
                        clean.endsWith(' check') ||
                        clean.startsWith('protection') ||
                        clean.startsWith('valour') ||
                        clean.startsWith('wisdom');

                      if (isSkillOrRoll) {
                        return (
                          <strong className="skill-highlight">
                            {text.toUpperCase()}
                          </strong>
                        );
                      }

                      return <strong className="font-bold text-[#1A1410]">{children}</strong>;
                    },
                    em: ({ children }) => {
                      const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
                      const clean = text.trim();
                      const lower = clean.toLowerCase();

                      if (lower.includes('ill-favoured') || lower.includes('ill favoured')) {
                        const formatted = text.replace(/ill[- ]favoured/gi, 'Ill-Favoured');
                        return <em className="ill-favoured-floating">{formatted}</em>;
                      }

                      if (lower.includes('favoured')) {
                        const formatted = text.replace(/favoured/gi, 'Favoured');
                        return <em className="favoured-floating">{formatted}</em>;
                      }

                      return <em>{children}</em>;
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="my-3 sm:my-4 px-3 sm:px-6 py-1.5 sm:py-2.5 font-fell italic text-[1.25rem] sm:text-[1.38rem] leading-relaxed text-[#7A5B0B] text-center max-w-2xl mx-auto border-none bg-transparent shadow-none rounded-none relative">
                        {children}
                      </blockquote>
                    ),
                    div: ({ className, children, ...props }) => {
                      if (className === 'gandalf-letter-body') {
                        return (
                          <div className="gandalf-letter-body my-6 text-center max-w-2xl mx-auto">
                            {children}
                          </div>
                        );
                      }
                      return <div className={className} {...props}>{children}</div>;
                    },
                    a: ({ href, children }) => {
                      if (href && href.startsWith('#compendium-')) {
                        const targetTitle = decodeURIComponent(href.replace('#compendium-', ''));
                        return (
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCompendiumNavigate(targetTitle);
                            }}
                            className="inline-flex items-center gap-1 font-bold text-[#8E1616] bg-[#E8DCC2] px-2 py-0.5 rounded-[2px] border border-[#C8B693] hover:bg-[#E0D0AE] transition-colors cursor-pointer text-xs"
                            title={`Jump to ${targetTitle}`}
                          >
                            <BookOpen className="w-3 h-3 text-[#8E1616] shrink-0 inline" />
                            <span>{children}</span>
                          </motion.button>
                        );
                      }
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#8E1616] underline font-bold">
                          {children}
                        </a>
                      );
                    },
                    hr: () => (
                      <div className="relative my-8 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-[#D8C8A8]" />
                        </div>
                        <div className="relative bg-[#FAF5EB] px-3 text-[#8E1616] text-xs font-cinzel font-bold">
                          ❖ ᚠ ❖
                        </div>
                      </div>
                    ),
                    table: ({ node, children, ...props }: any) => {
                      const isAttr = isAttributesTable(node);
                      return (
                        <div className="my-4 overflow-x-auto no-scrollbar">
                          <table className={`w-full text-left text-sm sm:text-base border-collapse bg-[#FAF5EB] ${isAttr ? 'attributes-table' : ''}`} {...props}>
                            {children}
                          </table>
                        </div>
                      );
                    },
                    thead: ({ node, children }: any) => {
                      const isHeaderEmpty = node?.children?.every((tr: any) =>
                        tr.children?.every((th: any) => {
                          const text = th.children?.[0]?.value || '';
                          return !text.trim();
                        })
                      );
                      if (isHeaderEmpty) return null;
                      return (
                        <thead className="bg-[#EFE5CB] border-b-2 border-[#D8C8A8]">
                          {children}
                        </thead>
                      );
                    },
                    th: ({ children }: any) => (
                      <th className="px-3.5 py-2.5 border-b border-[#D8C8A8] font-cinzel font-bold text-[#8E1616] text-xs sm:text-sm uppercase tracking-wider text-left bg-[#EFE5CB]">
                        {children}
                      </th>
                    ),
                    td: ({ children }: any) => (
                      <td className="px-3.5 py-2.5 border-b border-[#E8DCC2] text-[#2D241E] align-top text-sm sm:text-base leading-relaxed">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </article>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent Bottom Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t-2 border-[#D8C8A8] mt-auto z-10">
        {prevSection ? (
          <motion.button
            whileHover={{ scale: 1.01, x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateSection(prevSection.chapterId, prevSection.sectionId)}
            className="flex items-center gap-3 p-3.5 rounded-[2px] bg-[#FAF5EB] border border-[#D8C8A8] hover:border-[#8E1616] transition-colors text-left group shadow-2xs cursor-pointer min-h-[58px]"
          >
            <ChevronLeft className="w-5 h-5 text-[#8E1616] shrink-0 group-hover:-translate-x-1 transition-transform" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#8E1616] font-bold uppercase tracking-wider block font-cinzel">
                Previous Section
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${prevSection.chapterId}-${prevSection.sectionId}`}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="text-xs font-serif font-bold text-[#28211D] truncate block"
                >
                  {prevSection.title}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.button>
        ) : (
          <div />
        )}

        {nextSection && (
          <motion.button
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateSection(nextSection.chapterId, nextSection.sectionId)}
            className="flex items-center justify-end gap-3 p-3.5 rounded-[2px] bg-[#FAF5EB] border border-[#D8C8A8] hover:border-[#8E1616] transition-colors text-right group sm:col-start-2 shadow-2xs cursor-pointer min-h-[58px]"
          >
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#8E1616] font-bold uppercase tracking-wider block font-cinzel">
                Next Section
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${nextSection.chapterId}-${nextSection.sectionId}`}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="text-xs font-serif font-bold text-[#28211D] truncate block"
                >
                  {nextSection.title}
                </motion.span>
              </AnimatePresence>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8E1616] shrink-0 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      {/* Floating Back to Top Button for Mobile Usability */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-[#8E1616] text-[#FAF5EB] shadow-lg border-2 border-[#FAF5EB] hover:bg-[#A82222] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Scroll back to top"
            title="Scroll back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

export const MarkdownViewer = React.memo(MarkdownViewerComponent);

