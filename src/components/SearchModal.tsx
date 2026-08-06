import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RuleChapter } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: RuleChapter[];
  onSelectResult: (chapterId: string, sectionId: string) => void;
}

interface SearchMatch {
  chapterId: string;
  chapterTitle: string;
  supplement: string;
  sectionId: string;
  sectionTitle: string;
  matchSnippet: string;
}

export const SearchModalComponent: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard escape shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search across all chapters & sections
  const results: SearchMatch[] = [];
  if (query.trim().length > 1) {
    const cleanQuery = query.toLowerCase().trim();

    chapters.forEach((chapter) => {
      chapter.sections.forEach((section) => {
        const titleMatch = section.title.toLowerCase().includes(cleanQuery);
        const contentLower = section.content.toLowerCase();
        const contentIndex = contentLower.indexOf(cleanQuery);

        if (titleMatch || contentIndex !== -1) {
          let snippet = section.summary || '';
          if (contentIndex !== -1) {
            const start = Math.max(0, contentIndex - 40);
            const end = Math.min(section.content.length, contentIndex + 100);
            snippet = `...${section.content.slice(start, end)}...`;
          }

          results.push({
            chapterId: chapter.id,
            chapterTitle: `Ch ${chapter.number}. ${chapter.title}`,
            supplement: chapter.supplement,
            sectionId: section.id,
            sectionTitle: section.title,
            matchSnippet: snippet,
          });
        }
      });
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1613]/75"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-[#FAF5EB] border-2 border-[#D8C8A8] rounded-[2px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b-2 border-[#D8C8A8] bg-[#F2E8D3]">
              <Search className="w-5 h-5 text-[#8E1616] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search TOR 2e rules (Target Numbers, Stances, Hope, Weary)..."
                className="w-full bg-transparent text-sm sm:text-base text-[#28211D] placeholder-[#8C7565] focus:outline-none font-serif"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-[#8E1616] hover:bg-[#E8DCC2] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {query.trim().length <= 1 ? (
                <div className="text-center py-10 px-4 text-[#6B5748]">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-[#8E1616]" />
                  <p className="text-xs font-cinzel font-bold text-[#8E1616]">Search the Lorebooks & Rules</p>
                  <p className="text-xs mt-1 font-serif">Type at least 2 characters to search across all sections</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {['Combat Stances', 'Journey Roles', 'Hope', 'Miserable', 'Target Number', 'Shadow'].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="text-[11px] px-2.5 py-1 rounded-[2px] bg-[#E8DCC2] text-[#8E1616] font-serif font-bold border border-[#C8B693] cursor-pointer hover:bg-[#E2D2A8] active:scale-95 transition-all"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-10 px-4 text-[#6B5748]">
                  <p className="text-sm font-cinzel font-bold text-[#8E1616]">No rules found matching "{query}"</p>
                  <p className="text-xs mt-1 font-serif">Try searching for keywords like "Stances", "Protection", "Council", or "Weary".</p>
                </div>
              ) : (
                results.map((item, idx) => (
                  <button
                    key={`${item.chapterId}-${item.sectionId}-${idx}`}
                    onClick={() => {
                      onSelectResult(item.chapterId, item.sectionId);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-[2px] bg-[#F2E8D3]/60 hover:bg-[#E8DCC2] active:bg-[#E2D2A8] border border-[#D8C8A8] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-serif font-bold text-[#8E1616] truncate">
                        {item.sectionTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#E8DCC2] text-[#8E1616] shrink-0 font-cinzel font-bold border border-[#C8B693]">
                        {item.supplement}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B5748] flex items-center gap-1 mb-1.5 font-serif">
                      <FileText className="w-3 h-3 text-[#8E1616]" />
                      <span>{item.chapterTitle}</span>
                    </div>
                    <p className="text-xs text-[#28211D] line-clamp-2 italic font-serif bg-[#FAF5EB] p-2 rounded-[2px] border border-[#D8C8A8]">
                      {item.matchSnippet}
                    </p>
                  </button>
                ))
              )}
            </div>

            {/* Footer info */}
            <div className="p-2.5 bg-[#F2E8D3] border-t-2 border-[#D8C8A8] flex items-center justify-between text-[11px] text-[#6B5748] px-4 font-serif">
              <span>{results.length} rules found</span>
              <span>Press ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const SearchModal = React.memo(SearchModalComponent);
