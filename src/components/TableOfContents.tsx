import React from 'react';
import { RuleChapter } from '../types';
import {
  BookOpen,
  Scroll,
  Shield,
  Compass,
  Crown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface TableOfContentsProps {
  chapters: RuleChapter[];
  title?: string;
  onSelectSection: (chapterId: string, sectionId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4 text-[#8E1616]" />,
  Scroll: <Scroll className="w-4 h-4 text-[#8E1616]" />,
  Shield: <Shield className="w-4 h-4 text-[#8E1616]" />,
  Compass: <Compass className="w-4 h-4 text-[#8E1616]" />,
  Crown: <Crown className="w-4 h-4 text-[#8E1616]" />,
  Sparkles: <Sparkles className="w-4 h-4 text-[#8E1616]" />,
};

export const TableOfContentsComponent: React.FC<TableOfContentsProps> = ({
  chapters,
  title = 'Core Rules',
  onSelectSection,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-5 flex flex-col gap-4">
      {/* Header */}
      <div className="text-center border-b-2 border-double border-[#8E1616] pb-2">
        <h1 className="font-cinzel font-bold text-base sm:text-xl text-[#8E1616] tracking-wider uppercase leading-tight">
          {title} — Table of Contents
        </h1>
        <p className="text-xs font-serif text-[#6B5748] mt-0.5">
          Select any chapter or section to begin reading
        </p>
      </div>

      {/* Responsive Grid Layout - 1 Column Portrait, 2 Columns Landscape/Wide */}
      <div className="grid grid-cols-1 landscape:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
        {chapters.map((chapter) => {
          // Filter to top level # headers (level === 1)
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
              className="bg-[#FAF3E0] border-2 border-[#D8C8A8] hover:border-[#8E1616] rounded-[2px] p-3 sm:p-4 shadow-2xs transition-all hover:-translate-y-0.5 active:scale-[0.99] flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                {/* Chapter Header */}
                <div className="flex items-center justify-center gap-2 border-b border-[#E8DCC2] pb-2 text-center">
                  <span className="p-1 sm:p-1.5 bg-[#EFE5CB] rounded-[2px] border border-[#D4C4A0] shrink-0">
                    {ICON_MAP[chapter.iconName || 'BookOpen'] || <BookOpen className="w-4 h-4 text-[#8E1616]" />}
                  </span>
                  <div className="min-w-0 flex flex-col items-center">
                    <h2 className="font-cinzel font-bold text-sm sm:text-base text-[#8E1616] leading-snug break-words group-hover:text-[#A82222] text-center">
                      {chapter.title}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-mono text-[#8C7565] block leading-none mt-0.5">
                      Chapter {chapter.number}
                    </span>
                  </div>
                </div>

                {/* Top-level # Headings */}
                <div className="flex flex-col gap-1.5 text-xs font-serif">
                  {sectionsToDisplay.map((section) => (
                    <div
                      key={section.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSection(chapter.id, section.id);
                      }}
                      className="py-1.5 px-2.5 rounded-[2px] bg-[#EFE5CB]/80 hover:bg-[#8E1616] text-[#28211D] hover:text-[#FAF5EB] border border-[#D4C4A0] hover:border-[#6E1010] transition-all flex items-center justify-between group/sec cursor-pointer leading-tight"
                    >
                      <span className="font-cinzel font-semibold text-xs break-words pr-2">
                        {section.title}
                      </span>
                      <ChevronRight className="w-3 h-3 text-[#8C7565] group-hover/sec:text-[#FAF5EB] shrink-0 opacity-70 group-hover/sec:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Rune Bar */}
      <div className="text-center pt-2 border-t border-[#D8C8A8]">
        <span className="text-[10px] sm:text-xs font-cinzel text-[#8C7565] tracking-widest font-semibold uppercase">
          ❖ Select any chapter tile or section to enter ❖
        </span>
      </div>
    </div>
  );
};

export const TableOfContents = React.memo(TableOfContentsComponent);
