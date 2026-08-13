import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { RuleChapter } from '../types';
import { stripWikilinks } from '../data/rulebookLoader';
import { preprocessMarkdownContent } from '../utils/markdownUtils';
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
  ChevronDown,
  ChevronUp,
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
  return preprocessMarkdownContent(content);
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
  a: ({ href, children }: any) => {
    if (href && href.startsWith('#compendium-')) {
      const targetTitle = decodeURIComponent(href.replace('#compendium-', ''));
      return (
        <span className="inline-flex items-center gap-1 font-bold text-[#8E1616] bg-[#E8DCC2] px-2 py-0.5 rounded-[2px] border border-[#C8B693] text-xs">
          <BookOpen className="w-3 h-3 text-[#8E1616] shrink-0 inline" />
          <span>{children}</span>
        </span>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#8E1616] underline font-bold">
        {children}
      </a>
    );
  },
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

        const cleanTitle = stripWikilinks(
          rawTitleLine
            .replace(/<\/?[^>]+>/g, '')
            .replace(/\[\/?(red-box|key-box)\]/gi, '')
            .trim()
        );

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

export const HeroicCulturesGridComponent: React.FC<HeroicCulturesGridProps> = ({
  cultureChapters,
  activeCultureId,
  onSelectCulturePage,
}) => {
  const [selectedCultureId, setSelectedCultureId] = useState<string>(
    activeCultureId || cultureChapters[0]?.id || 'bardings'
  );

  const [activeTab, setActiveTab] = useState<'aspects' | 'virtues'>('aspects');
  const [isCultureSelectorExpanded, setIsCultureSelectorExpanded] = useState<boolean>(false);

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

  const handlePrevAspect = useCallback(() => {
    if (activeAspectIndex > 0) {
      setActiveAspectId(currentTiles[activeAspectIndex - 1].id);
    }
  }, [activeAspectIndex, currentTiles]);

  const handleNextAspect = useCallback(() => {
    if (activeAspectIndex < currentTiles.length - 1) {
      setActiveAspectId(currentTiles[activeAspectIndex + 1].id);
    }
  }, [activeAspectIndex, currentTiles]);

  const handleAspectClick = useCallback((tileId: string) => {
    setActiveAspectId(tileId);
    if (window.innerWidth < 1024 && aspectPaneRef.current) {
      aspectPaneRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const processedContent = useMemo(() => {
    if (!activeAspect) return '';
    return processMarkdownText(activeAspect.content);
  }, [activeAspect]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-4 md:py-6 flex flex-col gap-4">
      {/* Top Culture Hub Navigation & Tab Selector */}
      <div className="flex flex-col gap-3">
        {/* Culture Selection Bar - Collapsible Grid */}
        <div className="p-3 bg-[#EFE5CB] border-2 border-[#D8C8A8] rounded-[2px] shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-[#D8C8A8] pb-1.5 px-0.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-[#8E1616] text-[#FAF5EB] rounded-[2px] border border-[#6E1010] shadow-2xs shrink-0">
                <CultureIconComp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="font-cinzel font-bold text-sm sm:text-base text-[#8E1616] leading-tight truncate">
                  {currentCulture?.title}
                </h2>
                <span className="text-[10px] sm:text-xs font-serif text-[#6B5748] block truncate">
                  Heroic Culture Hub • {culturalAspects.length} Cultural Aspects • {virtueAspects.length} Virtues
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCultureSelectorExpanded(!isCultureSelectorExpanded)}
              className="px-2.5 py-1.5 rounded-[2px] bg-[#FAF3E0] hover:bg-[#E8DCC2] active:bg-[#E2D2A8] text-[#8E1616] border border-[#D4C4A0] text-xs font-cinzel font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
              title={isCultureSelectorExpanded ? "Hide Culture List" : "Change Heroic Culture"}
            >
              <span>{isCultureSelectorExpanded ? "Hide Cultures" : "Change Culture"}</span>
              {isCultureSelectorExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#8E1616]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#8E1616]" />
              )}
            </button>
          </div>

          {/* Grid of All 11 Heroic Cultures - Shown when expanded or hidable after selection */}
          {isCultureSelectorExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 pt-1 transition-all">
              {cultureChapters.map((culture) => {
                const isSelected = culture.id === selectedCultureId;
                const Icon = CULTURE_ICON_MAP[culture.iconName || 'Shield'] || Shield;
                const shortTitle = culture.title.replace(/^Chapter \d+:\s*/i, '').replace(/The\s+/i, '');

                return (
                  <button
                    key={culture.id}
                    type="button"
                    onClick={() => {
                      setSelectedCultureId(culture.id);
                      setIsCultureSelectorExpanded(false); // Auto-hide after selection is made
                      if (onSelectCulturePage) {
                        onSelectCulturePage(culture.id);
                      }
                    }}
                    className={`px-2 py-1.5 rounded-[2px] border text-xs font-cinzel font-bold transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                      isSelected
                        ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-2xs'
                        : 'bg-[#FAF3E0] text-[#28211D] hover:bg-[#E8DCC2] active:bg-[#E2D2A8] border-[#D4C4A0]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{shortTitle}</span>
                  </button>
                );
              })}
            </div>
          )}
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
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
        {/* Left Column: Compact Tiles Matrix */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-3">
          {/* Compact Aspect Tiles Container */}
          <div className="bg-[#FAF3E0] border-2 border-[#D8C8A8] rounded-[2px] p-2.5 sm:p-3 shadow-2xs flex flex-col gap-2">
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
              /* Responsive Grid: 1 col on mobile portrait, 2 cols on tablet/landscape, 1 col on desktop sidebar */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5">
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
                      className={`w-full px-3 py-2.5 sm:py-3 rounded-[2px] text-left transition-all cursor-pointer border flex items-center justify-between gap-3 relative overflow-hidden group min-h-[50px] active:scale-[0.99] ${
                        isActive
                          ? 'bg-[#8E1616] text-[#FAF5EB] border-[#6E1010] shadow-xs ring-1 ring-[#8E1616]/40'
                          : isFirstTab
                          ? 'bg-[#E2D2A8] text-[#28211D] hover:bg-[#D9C89B] active:bg-[#D0C092] border-[#CBB88C] shadow-2xs'
                          : 'bg-[#EFE5CB] text-[#28211D] hover:bg-[#E8DCC2] active:bg-[#DFCFA8] border-[#D4C4A0]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`p-2 rounded-[2px] shrink-0 ${
                            isActive
                              ? 'bg-[#FAF5EB]/20 text-[#FAF5EB]'
                              : isFirstTab
                              ? 'bg-[#8E1616]/15 text-[#8E1616]'
                              : 'bg-[#D8C8A8]/40 text-[#8E1616]'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <h3
                            className={`font-cinzel font-bold text-xs sm:text-sm leading-snug break-normal text-left ${
                              isActive ? 'text-[#FAF5EB]' : 'text-[#8E1616] group-hover:text-[#A82222]'
                            }`}
                          >
                            {mainTitle}
                          </h3>
                          {subTitle && (
                            <span
                              className={`text-[11px] sm:text-xs font-serif italic font-normal block leading-snug mt-0.5 break-normal text-left ${
                                isActive ? 'text-[#FAF5EB]/90' : 'text-[#6B5748]'
                              }`}
                            >
                              {subTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-1 shrink-0 bg-[#FAF5EB]/20 px-1.5 py-1 rounded-[2px] ml-1">
                          <Check className="w-3.5 h-3.5 text-[#FAF5EB]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Aspect / Virtue Reader Pane */}
        <div ref={aspectPaneRef} className="flex-1 min-w-0 w-full">
          <div className="bg-[#FAF3E0] border-2 border-[#D8C8A8] rounded-[2px] shadow-2xs overflow-hidden flex flex-col min-h-[380px] sm:min-h-[480px] lg:min-h-[520px]">
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
                  {processedContent}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroicCulturesGrid = React.memo(HeroicCulturesGridComponent);
