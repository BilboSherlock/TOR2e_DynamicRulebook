import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { RuleChapter } from '../types';
import {
  Shield,
  Sparkles,
  Home,
  Users,
  Compass,
  BookOpen,
  Coins,
  Dices,
  Swords,
  Award,
  Languages,
  ChevronRight,
  ChevronLeft,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroicCulturesGridProps {
  cultureChapters: RuleChapter[];
  activeCultureId?: string;
  onSelectCulturePage?: (chapterId: string) => void;
  onNavigateSection?: (chapterId: string, sectionId: string) => void;
}

const CULTURE_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Shield: Shield,
  Sparkles: Sparkles,
  Home: Home,
  Users: Users,
  Compass: Compass,
};

export interface AspectTile {
  id: string;
  title: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  sectionId: string;
  content: string;
  isVirtue?: boolean;
}

function splitTitle(title: string): { mainTitle: string; subTitle?: string } {
  if (!title) return { mainTitle: '' };
  const parts = title.split(/\s+[\-—–]\s+/);
  if (parts.length > 1) {
    return {
      mainTitle: parts[0].trim(),
      subTitle: parts.slice(1).join(' - ').trim(),
    };
  }
  return { mainTitle: title };
}

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

function processMarkdownText(content: string): string {
  let text = content;

  // Process quote shortcodes
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

  // Preprocess compendium wikilinks
  text = text.replace(/\[\[Compendium\.[^\]|]+\|([^\]]+)\]\]/g, (_, label) => `[${label}](#compendium-${encodeURIComponent(label)})`);
  text = text.replace(/\[\[Compendium\.([^\]]+)\]\]/g, (_, title) => `[${title}](#compendium-${encodeURIComponent(title)})`);
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, target, label) => `[${label}](#compendium-${encodeURIComponent(target)})`);
  text = text.replace(/\[\[([^\]]+)\]\]/g, (_, title) => `[${title}](#compendium-${encodeURIComponent(title)})`);

  // Key-box / Red-box shortcodes
  text = text.replace(/\[key-box\]/gi, '\n\n<div class="key-box">\n\n').replace(/\[\/key-box\]/gi, '\n\n</div>\n\n');
  text = text.replace(/\[red-box\]/gi, '\n\n<div class="red-box">\n\n').replace(/\[\/red-box\]/gi, '\n\n</div>\n\n');
  text = text.replace(/\[example\]/gi, '\n\n<div class="example-box">\n\n').replace(/\[\/example\]/gi, '\n\n</div>\n\n');

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
}

const renderFloatingText = (text: string, baseClass: string) => {
  return (
    <em className={baseClass}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{ animationDelay: `${index * 0.14}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </em>
  );
};

const MARKDOWN_COMPONENTS = {
  h1: ({ children }: any) => <h1 className="text-center font-cinzel font-bold text-lg sm:text-xl text-[#8E1616] my-3 border-b border-[#8E1616]/30 pb-1">{children}</h1>,
  h2: ({ children }: any) => <h2 className="font-cinzel font-bold text-base sm:text-lg text-[#8E1616] my-3 border-b border-[#D8C8A8] pb-1">{children}</h2>,
  h3: ({ children }: any) => <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#A82222] my-2.5 border-b border-[#D8C8A8]/60 pb-0.5">{children}</h3>,
  h4: ({ children }: any) => <h4 className="font-cinzel font-semibold text-xs sm:text-sm text-[#B22222] my-2 pl-2 border-l-2 border-[#8E1616]">{children}</h4>,
  p: ({ children }: any) => <p className="mb-4 text-[#2D241E] leading-relaxed text-sm sm:text-base font-serif">{children}</p>,
  li: ({ children }: any) => <li className="text-[#2D241E] leading-relaxed text-sm sm:text-base font-serif my-1">{children}</li>,
  em: ({ children }: any) => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    const clean = text.trim();
    const lower = clean.toLowerCase();

    if (lower.includes('ill-favoured') || lower.includes('ill favoured')) {
      const formatted = text.replace(/ill[- ]favoured/gi, 'Ill-Favoured');
      return renderFloatingText(formatted, 'ill-favoured-floating');
    }

    if (lower.includes('favoured')) {
      const formatted = text.replace(/favoured/gi, 'Favoured');
      return renderFloatingText(formatted, 'favoured-floating');
    }

    return <em className="italic">{children}</em>;
  },
  strong: ({ children }: any) => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    const clean = text.trim().toLowerCase().replace(/[^a-z0-9 \-]/g, '');

    const ATTRIBUTE_NAMES = new Set(['strength', 'heart', 'wits']);
    if (ATTRIBUTE_NAMES.has(clean) || clean.endsWith(' attribute')) {
      return <strong className="attribute-highlight">{text.toUpperCase()}</strong>;
    }

    const SKILL_NAMES = new Set([
      'awe', 'athletics', 'awareness', 'hunting', 'song', 'craft',
      'enhearten', 'travel', 'insight', 'healing', 'courtesy', 'battle',
      'persuade', 'stealth', 'scan', 'explore', 'riddle', 'lore',
      'axes', 'bows', 'spears', 'swords', 'brawling', 'daggers',
      'protection', 'valour', 'wisdom', 'parry', 'shadow', 'hope', 'endurance'
    ]);

    if (SKILL_NAMES.has(clean) || clean.endsWith(' roll') || clean.endsWith(' test') || clean.endsWith(' check')) {
      return <strong className="skill-highlight">{text.toUpperCase()}</strong>;
    }

    return <strong className="font-bold text-[#1A1410]">{children}</strong>;
  },
  blockquote: ({ children }: any) => (
    <blockquote className="my-3 px-4 py-2.5 font-fell italic text-sm sm:text-base leading-relaxed text-[#7A5B0B] text-center border-y border-[#D8C8A8] bg-[#EFE5CB]/40">
      {children}
    </blockquote>
  ),
  a: ({ children }: any) => (
    <span className="inline-flex items-center gap-1 font-bold text-[#8E1616] bg-[#E8DCC2] px-2 py-0.5 rounded-[2px] border border-[#C8B693] text-xs">
      {children}
    </span>
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
};

function getIconForTitle(title: string): React.FC<{ className?: string }> {
  const lower = title.toLowerCase();
  if (lower.includes('virtue')) return Sparkles;
  if (lower.includes('overview') || lower.includes('lore') || lower.includes('intro')) return BookOpen;
  if (lower.includes('blessing') || lower.includes('stout')) return Sparkles;
  if (lower.includes('standard') || lower.includes('living') || lower.includes('prosperous')) return Coins;
  if (lower.includes('characteristic') || lower.includes('trait')) return Users;
  if (lower.includes('attribute') || lower.includes('derived') || lower.includes('stat')) return Dices;
  if (lower.includes('skill') || lower.includes('combat') || lower.includes('proficiency')) return Swords;
  if (lower.includes('feature') || lower.includes('distinctive')) return Award;
  if (lower.includes('language') || lower.includes('name') || lower.includes('dalish')) return Languages;
  return Shield;
}

function getCategoryForTitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('virtue')) return 'Virtue';
  if (lower.includes('overview') || lower.includes('lore')) return 'Lore';
  if (lower.includes('blessing')) return 'Blessing';
  if (lower.includes('standard') || lower.includes('living')) return 'Economy';
  if (lower.includes('characteristic')) return 'Traits';
  if (lower.includes('attribute') || lower.includes('derived') || lower.includes('stat')) return 'Attributes';
  if (lower.includes('skill') || lower.includes('combat')) return 'Abilities';
  if (lower.includes('feature')) return 'Features';
  if (lower.includes('language') || lower.includes('name')) return 'Identity';
  return 'Aspect';
}

function parseAspectsFromChapter(chap: RuleChapter): AspectTile[] {
  const aspectTiles: AspectTile[] = [];
  let insideVirtues = false;

  chap.sections.forEach((sec) => {
    const isVirtuesHeader = sec.title.toLowerCase().includes('virtue');
    if (isVirtuesHeader) {
      insideVirtues = true;
    }

    const subHeadingRegex = /^###\s+(.+)$/gm;
    const subHeadingMatches = [...sec.content.matchAll(subHeadingRegex)];

    if (subHeadingMatches.length === 0) {
      aspectTiles.push({
        id: sec.id,
        title: sec.title,
        category: insideVirtues ? 'Virtue' : getCategoryForTitle(sec.title),
        icon: insideVirtues ? Sparkles : getIconForTitle(sec.title),
        sectionId: sec.id,
        content: sec.content,
        isVirtue: insideVirtues,
      });
    } else {
      const rawParts = sec.content.split(/^###\s+/m);

      if (rawParts[0] && rawParts[0].trim().length > 0) {
        aspectTiles.push({
          id: `${sec.id}-intro`,
          title: sec.title,
          category: insideVirtues ? 'Virtue' : getCategoryForTitle(sec.title),
          icon: insideVirtues ? Sparkles : getIconForTitle(sec.title),
          sectionId: sec.id,
          content: rawParts[0].trim(),
          isVirtue: insideVirtues,
        });
      }

      for (let i = 1; i < rawParts.length; i++) {
        const lines = rawParts[i].split('\n');
        const rawTitleLine = lines[0].trim();
        const subContent = lines.slice(1).join('\n').trim();

        const cleanTitle = rawTitleLine
          .replace(/<\/?[^>]+>/g, '')
          .replace(/\[\/?(red-box|key-box)\]/gi, '')
          .trim();

        aspectTiles.push({
          id: `${sec.id}-aspect-${i}`,
          title: cleanTitle,
          category: insideVirtues ? 'Virtue' : getCategoryForTitle(cleanTitle),
          icon: insideVirtues ? Sparkles : getIconForTitle(cleanTitle),
          sectionId: sec.id,
          content: `### ${rawTitleLine}\n\n${subContent}`,
          isVirtue: insideVirtues,
        });
      }
    }
  });

  return aspectTiles;
}

export const HeroicCulturesGrid: React.FC<HeroicCulturesGridProps> = ({
  cultureChapters,
  activeCultureId,
  onSelectCulturePage,
}) => {
  const [selectedCultureId, setSelectedCultureId] = useState<string>(
    activeCultureId || cultureChapters[0]?.id || 'bardings'
  );

  const [activeTab, setActiveTab] = useState<'aspects' | 'virtues'>('aspects');

  useEffect(() => {
    if (activeCultureId && activeCultureId !== selectedCultureId) {
      setSelectedCultureId(activeCultureId);
    }
  }, [activeCultureId]);

  const currentCulture = useMemo(() => {
    return (
      cultureChapters.find((ch) => ch.id === selectedCultureId) ||
      cultureChapters[0]
    );
  }, [cultureChapters, selectedCultureId]);

  const aspectTiles = useMemo(() => {
    if (!currentCulture) return [];
    return parseAspectsFromChapter(currentCulture);
  }, [currentCulture]);

  const culturalAspects = useMemo(() => {
    return aspectTiles.filter((tile) => !tile.isVirtue);
  }, [aspectTiles]);

  const virtueAspects = useMemo(() => {
    return aspectTiles.filter((tile) => tile.isVirtue);
  }, [aspectTiles]);

  const currentTiles = useMemo(() => {
    if (activeTab === 'virtues') {
      return virtueAspects;
    }
    return culturalAspects;
  }, [activeTab, culturalAspects, virtueAspects]);

  const [activeAspectId, setActiveAspectId] = useState<string>('');
  const aspectPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTiles.length > 0) {
      setActiveAspectId(currentTiles[0].id);
    } else {
      setActiveAspectId('');
    }
  }, [selectedCultureId, activeTab, currentTiles]);

  const activeAspect = useMemo(() => {
    return (
      currentTiles.find((tile) => tile.id === activeAspectId) ||
      currentTiles[0] ||
      null
    );
  }, [currentTiles, activeAspectId]);

  const CultureIconComp =
    CULTURE_ICON_MAP[currentCulture?.iconName || 'Shield'] || Shield;

  const activeAspectIndex = currentTiles.findIndex(
    (tile) => tile.id === activeAspect?.id
  );

  const handlePrevAspect = () => {
    if (activeAspectIndex > 0) {
      setActiveAspectId(currentTiles[activeAspectIndex - 1].id);
    }
  };

  const handleNextAspect = () => {
    if (activeAspectIndex < currentTiles.length - 1) {
      setActiveAspectId(currentTiles[activeAspectIndex + 1].id);
    }
  };

  const handleAspectClick = (tileId: string) => {
    setActiveAspectId(tileId);
    if (window.innerWidth < 1024 && aspectPaneRef.current) {
      aspectPaneRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-6 flex flex-col gap-4">
      {/* Top Culture Hub Navigation & Tab Selector */}
      <div className="flex flex-col gap-3">
        {/* Active Culture Banner */}
        <div className="p-3.5 bg-[#EFE5CB] border-2 border-[#D8C8A8] rounded-[2px] shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8E1616] text-[#FAF5EB] rounded-[2px] border border-[#6E1010] shadow-2xs">
              <CultureIconComp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-base sm:text-lg text-[#8E1616] leading-tight">
                {currentCulture?.title}
              </h2>
              <span className="text-[11px] font-serif text-[#6B5748] block mt-0.5">
                Heroic Culture Hub • {culturalAspects.length} Cultural Aspects • {virtueAspects.length} Virtues
              </span>
            </div>
          </div>
        </div>

        {/* Top Tab Selector Switcher: Cultural Aspects vs Virtues */}
        <div className="flex items-center gap-2 p-1.5 bg-[#EFE5CB] border-2 border-[#D8C8A8] rounded-[2px] shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('aspects')}
            className={`flex-1 px-3 py-2 rounded-[2px] text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              activeTab === 'aspects'
                ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-xs ring-1 ring-[#8E1616]/40'
                : 'bg-[#FAF3E0] text-[#28211D] hover:bg-[#E8DCC2] border-[#D4C4A0]'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Cultural Aspects</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                activeTab === 'aspects'
                  ? 'bg-[#FAF5EB]/20 text-[#FAF5EB]'
                  : 'bg-[#E8DCC2] text-[#8E1616]'
              }`}
            >
              {culturalAspects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('virtues')}
            className={`flex-1 px-3 py-2 rounded-[2px] text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
              activeTab === 'virtues'
                ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-xs ring-1 ring-[#8E1616]/40'
                : 'bg-[#FAF3E0] text-[#28211D] hover:bg-[#E8DCC2] border-[#D4C4A0]'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'virtues' ? 'text-[#FAF5EB]' : 'text-[#8E1616]'}`} />
            <span>Virtues</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                activeTab === 'virtues'
                  ? 'bg-[#FAF5EB]/20 text-[#FAF5EB]'
                  : virtueAspects.length > 0
                  ? 'bg-[#8E1616]/15 text-[#8E1616]'
                  : 'bg-[#E8DCC2] text-[#8C7565]'
              }`}
            >
              {virtueAspects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Culture Hub Split Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left Column: Compact Tiles Matrix */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-3">
          {/* Compact Aspect Tiles Container */}
          <div className="bg-[#FAF3E0] border-2 border-[#D8C8A8] rounded-[2px] p-2.5 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-[#D8C8A8] pb-1.5 px-1 text-xs font-cinzel">
              <span className="font-bold text-[#8E1616] uppercase tracking-wider flex items-center gap-1.5">
                {activeTab === 'virtues' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#8E1616]" />
                    <span>Cultural Virtues</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[#8E1616]" />
                    <span>Culture Aspects</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono text-[#8C7565]">
                {currentTiles.length > 0 ? `${activeAspectIndex + 1} of ${currentTiles.length}` : '0'}
              </span>
            </div>

            {currentTiles.length === 0 ? (
              <div className="p-4 text-center text-xs font-serif text-[#6B5748] bg-[#EFE5CB] rounded-[2px] border border-[#D4C4A0]">
                No virtues listed yet for {currentCulture.title}. Select Beornings to view Cultural Virtues!
              </div>
            ) : (
              <>
                {/* Mobile Horizontal Pill Selector */}
                <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-1.5 pb-1 pt-0.5">
                  {currentTiles.map((tile, index) => {
                    const IconComp = tile.icon;
                    const isActive = activeAspectId === tile.id;
                    const isFirstTab = index === 0;
                    const { mainTitle, subTitle } = splitTitle(tile.title);

                    return (
                      <button
                        key={tile.id}
                        type="button"
                        onClick={() => handleAspectClick(tile.id)}
                        className={`shrink-0 px-2.5 py-1.5 rounded-[2px] border text-xs font-cinzel font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-xs'
                            : isFirstTab
                            ? 'bg-[#E2D2A8] text-[#28211D] hover:bg-[#D9C89B] border-[#CBB88C] shadow-2xs'
                            : 'bg-[#EFE5CB] text-[#28211D] hover:bg-[#E8DCC2] border-[#D4C4A0]'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5 shrink-0" />
                        <div className="flex flex-col text-left leading-tight">
                          <span>{mainTitle}</span>
                          {subTitle && (
                            <span
                              className={`text-[9px] font-serif italic font-normal ${
                                isActive ? 'text-[#FAF5EB]/85' : 'text-[#6B5748]'
                              }`}
                            >
                              {subTitle}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop Compact Tiles List */}
                <div className="hidden lg:grid grid-cols-1 gap-1.5">
                  {currentTiles.map((tile, index) => {
                    const IconComp = tile.icon;
                    const isActive = activeAspectId === tile.id;
                    const isFirstTab = index === 0;
                    const { mainTitle, subTitle } = splitTitle(tile.title);

                    return (
                      <motion.button
                        key={tile.id}
                        type="button"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAspectClick(tile.id)}
                        className={`px-3 py-2 rounded-[2px] text-left transition-all cursor-pointer border flex items-center justify-between gap-2 relative overflow-hidden group ${
                          isActive
                            ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-xs ring-1 ring-[#8E1616]/40'
                            : isFirstTab
                            ? 'bg-[#E2D2A8] text-[#28211D] hover:bg-[#D9C89B] border-[#CBB88C] shadow-2xs'
                            : 'bg-[#EFE5CB] text-[#28211D] hover:bg-[#E8DCC2] border-[#D4C4A0]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1 rounded-[2px] shrink-0 ${
                              isActive
                                ? 'bg-[#FAF5EB]/20 text-[#FAF5EB]'
                                : isFirstTab
                                ? 'bg-[#8E1616]/15 text-[#8E1616]'
                                : 'bg-[#D8C8A8]/40 text-[#8E1616]'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex flex-col">
                            <h3
                              className={`font-cinzel font-bold text-xs leading-tight truncate ${
                                isActive ? 'text-[#FAF5EB]' : 'text-[#8E1616] group-hover:text-[#A82222]'
                              }`}
                            >
                              {mainTitle}
                            </h3>
                            {subTitle && (
                              <span
                                className={`text-[10px] font-serif italic font-normal truncate block leading-tight mt-0.5 ${
                                  isActive ? 'text-[#FAF5EB]/85' : 'text-[#6B5748]'
                                }`}
                              >
                                {subTitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Check className="w-3.5 h-3.5 text-[#FAF5EB]" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Aspect / Virtue Reader Pane */}
        <div ref={aspectPaneRef} className="flex-1 min-w-0 w-full">
          <motion.div
            key={`single-${currentCulture.id}-${activeTab}-${activeAspect?.id}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-[#FAF3E0] border-2 border-[#D8C8A8] rounded-[2px] shadow-2xs overflow-hidden flex flex-col min-h-[480px]"
          >
            {/* Reader Header */}
            <div className="p-3.5 bg-[#EFE5CB] border-b-2 border-[#D8C8A8] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#8E1616] text-[#FAF5EB] rounded-[2px] border border-[#6E1010]">
                  {activeAspect ? (
                    <activeAspect.icon className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-[#E8DCC2] px-1.5 py-0.5 rounded-[2px] text-[#6B5748] font-semibold">
                      {currentCulture.title} • {activeAspect?.category || (activeTab === 'virtues' ? 'Virtue' : 'Aspect')}
                    </span>
                  </div>
                  <h2 className="font-cinzel font-bold text-lg sm:text-xl text-[#8E1616] leading-tight mt-0.5">
                    {activeAspect ? splitTitle(activeAspect.title).mainTitle : 'Select an Item'}
                  </h2>
                </div>
              </div>

              {/* Prev / Next Navigation Arrows */}
              {currentTiles.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-cinzel">
                  <button
                    type="button"
                    onClick={handlePrevAspect}
                    disabled={activeAspectIndex <= 0}
                    className="p-1.5 rounded-[2px] bg-[#FAF3E0] border border-[#D4C4A0] text-[#8E1616] hover:bg-[#8E1616] hover:text-[#FAF5EB] disabled:opacity-40 disabled:hover:bg-[#FAF3E0] disabled:hover:text-[#8E1616] transition-all cursor-pointer flex items-center gap-1"
                    title="Previous Item"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline font-bold">Prev</span>
                  </button>
                  <span className="text-xs font-mono text-[#8C7565] px-1">
                    {activeAspectIndex >= 0 ? activeAspectIndex + 1 : 0} / {currentTiles.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextAspect}
                    disabled={activeAspectIndex >= currentTiles.length - 1}
                    className="p-1.5 rounded-[2px] bg-[#FAF3E0] border border-[#D4C4A0] text-[#8E1616] hover:bg-[#8E1616] hover:text-[#FAF5EB] disabled:opacity-40 disabled:hover:bg-[#FAF3E0] disabled:hover:text-[#8E1616] transition-all cursor-pointer flex items-center gap-1"
                    title="Next Item"
                  >
                    <span className="hidden sm:inline font-bold">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Markdown Body */}
            <div className="p-5 sm:p-7 flex-1 markdown-body bg-[#FAF3E0]">
              {activeAspect ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={MARKDOWN_COMPONENTS}
                >
                  {processMarkdownText(activeAspect.content)}
                </ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-[#6B5748] space-y-3">
                  <Sparkles className="w-8 h-8 text-[#8E1616] opacity-60" />
                  <p className="font-serif italic text-base">
                    No Cultural Virtues found for {currentCulture?.title} yet. Select Beornings to explore Virtues!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
