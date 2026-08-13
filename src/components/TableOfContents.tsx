import React from 'react';
import { RuleChapter, SupplementCategory } from '../types';
import {
  BookOpen,
  Scroll,
  Shield,
  Compass,
  Crown,
  ChevronRight,
  Sparkles,
  Search,
  Palette,
  Globe,
} from 'lucide-react';

interface TableOfContentsProps {
  chapters: RuleChapter[];
  title?: string;
  onSelectSection: (chapterId: string, sectionId: string) => void;
  selectedSupplement?: SupplementCategory | 'All';
  onSelectSupplement?: (supplement: SupplementCategory) => void;
  onSelectMapTab?: () => void;
  onOpenSearch?: () => void;
  onOpenStyleGuide?: () => void;
  isLoreMasterMode?: boolean;
  onToggleLoreMasterMode?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-3.5 h-3.5 text-[#8E1616]" />,
  Scroll: <Scroll className="w-3.5 h-3.5 text-[#8E1616]" />,
  Shield: <Shield className="w-3.5 h-3.5 text-[#8E1616]" />,
  Compass: <Compass className="w-3.5 h-3.5 text-[#8E1616]" />,
  Crown: <Crown className="w-3.5 h-3.5 text-[#8E1616]" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5 text-[#8E1616]" />,
  Globe: <Globe className="w-3.5 h-3.5 text-[#8E1616]" />,
};

export const TableOfContentsComponent: React.FC<TableOfContentsProps> = ({
  chapters,
  title = 'Core Rules',
  onSelectSection,
  onSelectSupplement,
  onSelectMapTab,
  onOpenSearch,
  onOpenStyleGuide,
  isLoreMasterMode = false,
  onToggleLoreMasterMode,
}) => {
  return (
    <div className="w-full h-full max-h-full flex flex-col justify-between overflow-hidden p-1.5 sm:p-2.5 gap-1.5 sm:gap-2">
      {/* Integrated Top Navigation Header Bar */}
      <div className="bg-[#FAF3E0] border-b-2 border-[#D8C8A8] shadow-xs px-2 sm:px-3 py-1 flex items-center justify-between gap-1.5 sm:gap-3 shrink-0 rounded-[2px] min-h-[38px]">
        {/* Left Branding */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] bg-[#8E1616] text-[#FAF5EB] flex items-center justify-center font-cinzel font-bold text-xs sm:text-sm shadow-2xs border border-[#6E1010] shrink-0">
            ᚠ
          </div>
          <h1 className="font-cinzel font-bold text-xs sm:text-sm md:text-base text-[#8E1616] leading-tight truncate">
            The One Ring <span className="hidden sm:inline font-normal text-[#6B5748] text-xs">— Core Rules</span>
          </h1>
        </div>

        {/* Center Nav View Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectSupplement?.('Core Rules')}
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] font-cinzel font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-[#8E1616] text-[#FAF5EB] border border-[#6E1010] shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3 h-3" />
            <span className="hidden xs:inline sm:inline">Core Rules</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSupplement?.('Heroic Cultures')}
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] font-cinzel font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-[#EFE5CB] text-[#5C4A3C] hover:text-[#8E1616] hover:bg-[#FAF3E0] border border-[#D4C4A0] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Shield className="w-3 h-3 text-[#8E1616]" />
            <span className="hidden xs:inline sm:inline">Cultures</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectMapTab?.()}
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] font-cinzel font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-[#EFE5CB] text-[#5C4A3C] hover:text-[#8E1616] hover:bg-[#FAF3E0] border border-[#D4C4A0] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Compass className="w-3 h-3 text-[#8E1616]" />
            <span className="hidden xs:inline sm:inline">Map</span>
          </button>
        </div>

        {/* Right Actions: LoreMaster Toggle, Search & Styles */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleLoreMasterMode}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs font-serif ${
              isLoreMasterMode
                ? 'bg-[#8E1616] text-[#FAF5EB] border border-[#6E1010] font-bold'
                : 'text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0]'
            }`}
            title={isLoreMasterMode ? 'LoreMaster Mode Active' : 'Switch to LoreMaster Mode'}
          >
            <Sparkles className={`w-3 h-3 ${isLoreMasterMode ? 'text-[#FFD700]' : 'text-[#8E1616]'}`} />
            <span className="font-serif font-bold whitespace-nowrap">
              <span className="sm:hidden">LM</span>
              <span className="hidden sm:inline">LoreMaster</span>
            </span>
            <span className={`text-[8px] sm:text-[9px] font-mono px-0.5 rounded-[2px] font-bold uppercase ${
              isLoreMasterMode ? 'bg-[#6E1010] text-[#FFD700]' : 'bg-[#E2D4B5] text-[#6B5748]'
            }`}>
              {isLoreMasterMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1 sm:px-2 sm:py-1 rounded-[2px] text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0] hover:bg-[#E8DCC2] transition-all cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs font-serif"
              title="Search Rulebook"
            >
              <Search className="w-3 h-3 text-[#8E1616]" />
              <span className="hidden md:inline font-semibold">Search</span>
            </button>
          )}

          {onOpenStyleGuide && (
            <button
              type="button"
              onClick={onOpenStyleGuide}
              className="p-1 sm:px-1.5 sm:py-1 rounded-[2px] text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0] hover:bg-[#E8DCC2] transition-all cursor-pointer flex items-center justify-center text-xs"
              title="Style Guide"
            >
              <Palette className="w-3 h-3 text-[#8E1616]" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-Header Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-b border-[#D8C8A8] shrink-0">
        <span className="text-[9px] sm:text-xs font-cinzel text-[#8C7565] tracking-widest font-semibold uppercase truncate pr-2">
          ❖ {title} — TABLE OF CONTENTS ❖
        </span>
        <span className="text-[9px] font-mono text-[#8E1616] font-bold bg-[#EFE5CB] px-1.5 py-0.2 rounded-[2px] border border-[#D4C4A0] shrink-0">
          {chapters.length} CHAPTERS
        </span>
      </div>

      {/* Main Chapter Grid Container - Strictly Fixed to Container Height */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <div className={`w-full h-full min-h-0 grid gap-1.5 sm:gap-2 grid-cols-2 landscape:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 ${
          chapters.length > 8 ? 'grid-rows-5 landscape:grid-rows-2 md:grid-rows-3' : 'grid-rows-4 landscape:grid-rows-2 md:grid-rows-3 lg:grid-rows-2'
        }`}>
          {chapters.map((chapter) => {
            const topLevelSections = chapter.sections.filter((sec) => sec.level === 1);
            const sectionsToDisplay = topLevelSections.length > 0 ? topLevelSections : chapter.sections;

            return (
              <div
                key={chapter.id}
                onClick={() => {
                  if (sectionsToDisplay.length > 0) {
                    onSelectSection(chapter.id, sectionsToDisplay[0].id);
                  }
                }}
                className="bg-[#FAF3E0] border border-[#D8C8A8] hover:border-[#8E1616] rounded-[2px] p-1.5 sm:p-2 shadow-2xs transition-all hover:shadow-xs flex flex-col justify-between group cursor-pointer h-full min-h-0 overflow-hidden"
              >
                {/* Chapter Tile Header */}
                <div className="flex items-center gap-1.5 border-b border-[#E8DCC2] pb-1 shrink-0">
                  <span className="p-0.5 sm:p-1 bg-[#EFE5CB] rounded-[2px] border border-[#D4C4A0] shrink-0 text-[#8E1616]">
                    {ICON_MAP[chapter.iconName || 'BookOpen'] || <BookOpen className="w-3.5 h-3.5 text-[#8E1616]" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8px] sm:text-[9px] font-mono text-[#8C7565] font-bold uppercase leading-none">
                        CH. {chapter.number}
                      </span>
                      <span className="text-[8px] font-cinzel text-[#8E1616] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        READ →
                      </span>
                    </div>
                    <h2 className="font-cinzel font-bold text-[11px] sm:text-xs md:text-sm text-[#8E1616] leading-tight truncate group-hover:text-[#A82222]">
                      {chapter.title}
                    </h2>
                  </div>
                </div>

                {/* Sub-Sections Links (Scrollable internal list if chapter has many sections) */}
                <div className="flex-1 min-h-0 flex flex-col gap-0.5 my-1 overflow-y-auto no-scrollbar">
                  {sectionsToDisplay.map((section) => (
                    <div
                      key={section.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSection(chapter.id, section.id);
                      }}
                      className="py-0.5 px-1.5 rounded-[2px] bg-[#EFE5CB]/90 hover:bg-[#8E1616] text-[#28211D] hover:text-[#FAF5EB] border border-[#D4C4A0] hover:border-[#6E1010] transition-colors flex items-center justify-between group/sec cursor-pointer leading-none min-h-[20px]"
                    >
                      <span className="font-cinzel font-medium text-[9px] sm:text-[10px] md:text-xs truncate pr-1">
                        {section.title}
                      </span>
                      <ChevronRight className="w-2.5 h-2.5 text-[#8C7565] group-hover/sec:text-[#FAF5EB] shrink-0 opacity-70 group-hover/sec:opacity-100" />
                    </div>
                  ))}
                </div>

                {/* Chapter Tile Footer */}
                <div className="pt-0.5 border-t border-[#E8DCC2]/70 shrink-0 flex items-center justify-between text-[8px] sm:text-[9px] font-cinzel text-[#8C7565]">
                  <span className="truncate">{sectionsToDisplay.length} Sections</span>
                  <span className="text-[#8E1616] font-bold group-hover:underline flex items-center gap-0.5">
                    Open <ChevronRight className="w-2 h-2" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TableOfContents = React.memo(TableOfContentsComponent);

