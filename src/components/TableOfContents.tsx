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
import { motion } from 'motion/react';

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

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  title = 'Core Rules',
  onSelectSection,
}) => {
  return (
    <div className="h-[calc(100vh-3.8rem)] landscape:h-[calc(100vh-3.2rem)] sm:h-[calc(100vh-4.5rem)] flex flex-col justify-between max-w-7xl mx-auto px-2 sm:px-6 py-1 landscape:py-0.5 sm:py-3 overflow-hidden">
      {/* Compact Header */}
      <div className="text-center shrink-0 mb-1 landscape:mb-0.5 border-b-2 border-double border-[#8E1616] pb-0.5">
        <h1 className="font-cinzel font-bold text-xs landscape:text-xs sm:text-lg text-[#8E1616] tracking-wider uppercase leading-tight">
          {title} — Table of Contents
        </h1>
        <p className="text-[9px] landscape:text-[9px] sm:text-xs font-serif text-[#6B5748] hidden xs:block">
          Select any chapter or section to begin reading
        </p>
      </div>

      {/* Responsive Grid Layout - Fits all chapters on 1 single screen without scrolling in both portrait & landscape */}
      <div className="flex-1 grid grid-cols-2 landscape:grid-cols-5 sm:grid-cols-3 lg:grid-cols-3 gap-1 landscape:gap-1.5 sm:gap-2.5 min-h-0 py-0.5 overflow-hidden">
        {chapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            whileHover={{ y: -2 }}
            onClick={() => {
              if (chapter.sections.length > 0) {
                onSelectSection(chapter.id, chapter.sections[0].id);
              }
            }}
            className="bg-[#FAF3E0] border-2 border-[#D8C8A8] hover:border-[#8E1616] rounded-[2px] p-1.5 landscape:p-1 sm:p-2.5 shadow-2xs transition-all flex flex-col justify-between group cursor-pointer h-full min-h-0 overflow-hidden"
          >
            <div className="min-h-0 flex flex-col">
              {/* Chapter Header */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 border-b border-[#E8DCC2] pb-1 mb-1.5 shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="p-0.5 sm:p-1 bg-[#EFE5CB] rounded-[2px] border border-[#D4C4A0] shrink-0">
                    {ICON_MAP[chapter.iconName || 'BookOpen'] || <BookOpen className="w-3.5 h-3.5 text-[#8E1616]" />}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-cinzel font-bold text-xs sm:text-sm text-[#8E1616] leading-tight truncate group-hover:text-[#A82222]">
                      {chapter.title}
                    </h2>
                    <span className="text-[8.5px] sm:text-[10px] font-mono text-[#8C7565] block leading-none">
                      Chapter {chapter.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top-level Headings - Distinct Block Layout */}
              <div className="flex flex-col gap-1 min-h-0 overflow-y-auto no-scrollbar text-[10px] sm:text-[11px] font-serif">
                {chapter.sections.map((section) => (
                  <div
                    key={section.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSection(chapter.id, section.id);
                    }}
                    className="py-1 px-1.5 rounded-[2px] bg-[#EFE5CB]/80 hover:bg-[#8E1616] text-[#28211D] hover:text-[#FAF5EB] border border-[#D4C4A0] hover:border-[#6E1010] transition-all flex items-center justify-between group/sec cursor-pointer leading-tight"
                  >
                    <span className="font-cinzel font-semibold text-[9.5px] sm:text-[11px] truncate pr-1">
                      {section.title}
                    </span>
                    <ChevronRight className="w-2.5 h-2.5 text-[#8C7565] group-hover/sec:text-[#FAF5EB] shrink-0 opacity-70 group-hover/sec:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Rune Bar */}
      <div className="text-center shrink-0 pt-0.5 border-t border-[#D8C8A8]">
        <span className="text-[8px] landscape:text-[8px] sm:text-[10px] font-cinzel text-[#8C7565] tracking-widest font-semibold uppercase">
          ❖ Select any chapter tile or section to enter ❖
        </span>
      </div>
    </div>
  );
};
