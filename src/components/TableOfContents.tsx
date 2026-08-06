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
    <div className="min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-4.5rem)] flex flex-col justify-between max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 overflow-y-auto lg:overflow-hidden">
      {/* Compact Title Header */}
      <div className="text-center shrink-0 mb-3 border-b-2 border-double border-[#8E1616] pb-2">
        <h1 className="font-cinzel font-bold text-base sm:text-xl text-[#8E1616] tracking-wider uppercase">
          {title} — Table of Contents
        </h1>
        <p className="text-[11px] sm:text-xs font-serif text-[#6B5748] mt-0.5">
          Select any chapter or section to begin reading
        </p>
      </div>

      {/* Grid Layout - 1-col on mobile, 2-col on sm, 3-col on lg */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 min-h-0 py-1 overflow-y-auto lg:overflow-hidden">
        {chapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            whileHover={{ y: -2 }}
            onClick={() => {
              if (chapter.sections.length > 0) {
                onSelectSection(chapter.id, chapter.sections[0].id);
              }
            }}
            className="bg-[#FAF3E0] border-2 border-[#D8C8A8] hover:border-[#8E1616] rounded-[2px] p-2.5 sm:p-3 shadow-2xs transition-all flex flex-col justify-between group cursor-pointer min-h-0"
          >
            <div className="min-h-0 flex flex-col">
              {/* Chapter Header */}
              <div className="flex items-center justify-between gap-2 border-b border-[#E8DCC2] pb-1.5 mb-1.5 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 bg-[#EFE5CB] rounded-[2px] border border-[#D4C4A0] shrink-0">
                    {ICON_MAP[chapter.iconName || 'BookOpen'] || <BookOpen className="w-4 h-4 text-[#8E1616]" />}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-cinzel font-bold text-xs sm:text-sm text-[#8E1616] leading-tight truncate group-hover:text-[#A82222]">
                      {chapter.title}
                    </h2>
                    <span className="text-[10px] font-mono text-[#8C7565] block">
                      Chapter {chapter.number}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#8E1616] bg-[#EFE5CB] px-1.5 py-0.5 rounded-[2px] border border-[#D4C4A0] shrink-0 font-semibold">
                  {chapter.sections.length} Sec
                </span>
              </div>

              {/* Sections List Preview */}
              <div className="space-y-0.5 min-h-0 overflow-y-auto text-[11px] font-serif text-[#28211D]">
                {chapter.sections.slice(0, 4).map((section) => (
                  <div
                    key={section.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSection(chapter.id, section.id);
                    }}
                    className="py-0.5 px-1 rounded-[2px] hover:bg-[#EFE5CB] hover:text-[#8E1616] transition-colors flex items-center justify-between group/sec cursor-pointer"
                  >
                    <span className="truncate pr-1">• {section.title}</span>
                    <ChevronRight className="w-3 h-3 text-[#8C7565] group-hover/sec:text-[#8E1616] shrink-0 opacity-60 group-hover/sec:opacity-100" />
                  </div>
                ))}
                {chapter.sections.length > 4 && (
                  <span className="text-[10px] font-mono text-[#8C7565] italic block px-1 pt-0.5">
                    + {chapter.sections.length - 4} more sections...
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Open Chapter Action */}
            <div className="pt-1.5 mt-1.5 border-t border-[#E8DCC2] shrink-0 flex items-center justify-between text-xs font-cinzel text-[#8E1616] font-bold group-hover:text-[#8E1616]">
              <span className="text-[11px] uppercase tracking-wider">Read Chapter</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Rune Bar */}
      <div className="text-center shrink-0 pt-1.5 border-t border-[#D8C8A8]">
        <span className="text-[10px] font-cinzel text-[#8C7565] tracking-widest font-semibold uppercase">
          ❖ Select any chapter tile or section to enter ❖
        </span>
      </div>
    </div>
  );
};
