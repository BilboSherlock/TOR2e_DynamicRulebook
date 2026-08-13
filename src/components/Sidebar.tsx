import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronRight,
  Dices,
  UserCheck,
  MapPin,
  Home,
  Compass,
  FileText,
  Scroll,
  Shield,
  Award,
  Sparkles,
  ChevronsDown,
  ChevronsUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RuleChapter, RuleSection, SubHeader, SupplementCategory } from '../types';

interface SidebarProps {
  chapters: RuleChapter[];
  activeChapterId: string;
  activeSectionId: string;
  activeSubHeaderId?: string | null;
  onSelectSection: (chapterId: string, sectionId: string, subHeaderId?: string) => void;
  selectedSupplement: SupplementCategory | 'All';
  setSelectedSupplement: (val: SupplementCategory | 'All') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Scroll: <Scroll className="w-4 h-4" />,
  Dices: <Dices className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
};

interface SectionGroup {
  parentSection: RuleSection;
  childSections: RuleSection[];
}

function groupSections(sections: RuleSection[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  let currentGroup: SectionGroup | null = null;

  for (const sec of sections) {
    if (sec.level === 1 || !currentGroup) {
      currentGroup = { parentSection: sec, childSections: [] };
      groups.push(currentGroup);
    } else {
      currentGroup.childSections.push(sec);
    }
  }
  return groups;
}

interface SubHeaderGroup {
  parent: SubHeader;
  children: SubHeader[];
}

function groupSubHeaders(subHeaders: SubHeader[]): SubHeaderGroup[] {
  const subGroups: SubHeaderGroup[] = [];
  let curGroup: SubHeaderGroup | null = null;

  for (const sub of subHeaders) {
    if (sub.level <= 3 || !curGroup) {
      curGroup = { parent: sub, children: [] };
      subGroups.push(curGroup);
    } else {
      curGroup.children.push(sub);
    }
  }
  return subGroups;
}

export const SidebarComponent: React.FC<SidebarProps> = ({
  chapters,
  activeChapterId,
  activeSectionId,
  activeSubHeaderId,
  onSelectSection,
  selectedSupplement,
  setSelectedSupplement,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    [activeChapterId]: true,
  });

  // Auto-expand ONLY the active chapter when active chapter changes
  useEffect(() => {
    setExpandedChapters({
      [activeChapterId]: true,
    });
  }, [activeChapterId]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      if (prev[chapterId]) {
        return {};
      }
      return { [chapterId]: true };
    });
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    chapters.forEach((ch) => {
      allExpanded[ch.id] = true;
    });
    setExpandedChapters(allExpanded);
  };

  const collapseAll = () => {
    setExpandedChapters({});
  };

  const filteredChapters = chapters.filter(
    (ch) =>
      selectedSupplement === 'All' ||
      ch.supplement === selectedSupplement ||
      (selectedSupplement === 'Core Rules' && ch.supplement === 'Starter Set')
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAF3E0] border-r-2 border-[#D8C8A8] text-[#28211D] select-none shadow-xs">
      {/* Top Index Header */}
      <div className="p-3 border-b border-[#D8C8A8] bg-[#EFE5CB] flex items-center justify-between">
        <span className="uppercase font-cinzel font-bold text-[#8E1616] tracking-wider flex items-center gap-1.5 text-xs">
          <BookOpen className="w-4 h-4 text-[#8E1616]" /> Index & Navigation
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={expandAll}
            title="Expand All Chapters"
            className="p-1 rounded hover:bg-[#E2D6B8] text-[#8C7565] hover:text-[#8E1616] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            <ChevronsDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={collapseAll}
            title="Collapse All Chapters"
            className="p-1 rounded hover:bg-[#E2D6B8] text-[#8C7565] hover:text-[#8E1616] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            <ChevronsUp className="w-4 h-4" />
          </button>
          {isOpenMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              title="Close Menu"
              className="lg:hidden p-1 rounded bg-[#8E1616] text-[#FAF5EB] hover:bg-[#A82222] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scroll-smooth">
        {filteredChapters.map((chapter) => {
          const isHeroicCulture = chapter.supplement === 'Heroic Cultures';
          const isChapterActive = chapter.id === activeChapterId;
          const isExpanded = !isHeroicCulture && (expandedChapters[chapter.id] ?? isChapterActive);

          return (
            <div
              key={chapter.id}
              className="rounded-[2px] overflow-hidden transition-colors border border-transparent hover:border-[#D8C8A8]/60"
            >
              {/* Chapter Header */}
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isHeroicCulture) {
                    toggleChapter(chapter.id);
                  }
                  if (chapter.sections.length > 0) {
                    onSelectSection(chapter.id, chapter.sections[0].id);
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-2.5 text-left rounded-[2px] transition-all cursor-pointer ${
                  isChapterActive
                    ? 'bg-[#E8DCC2] text-[#8E1616] border-l-4 border-[#8E1616] shadow-2xs font-bold'
                    : 'hover:bg-[#F2E8D3]/80 text-[#28211D]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`${isChapterActive ? 'text-[#8E1616]' : 'text-[#8C7565]'} shrink-0`}>
                    {ICON_MAP[chapter.iconName || 'BookOpen'] || <BookOpen className="w-4 h-4" />}
                  </span>
                  <div className="truncate">
                    <span className="block font-cinzel font-bold truncate leading-snug text-[13.5px] sm:text-[14.5px]">
                      {chapter.title}
                    </span>
                    <span className="text-[10.5px] text-[#8C7565] font-serif font-medium truncate block mt-0.5">
                      {chapter.supplement}
                    </span>
                  </div>
                </div>

                {!isHeroicCulture && (
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <motion.span
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block"
                    >
                      <ChevronRight className={`w-4 h-4 ${isExpanded ? 'text-[#8E1616]' : 'text-[#8C7565]'}`} />
                    </motion.span>
                  </div>
                )}
              </motion.button>

              {/* Sections Accordion with Smooth Animation */}
              {!isHeroicCulture && (
                <AnimatePresence initial={false}>
                  {isExpanded && (
                  <motion.div
                    key="chapter-sections"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden ml-2 pl-2 my-1 border-l-2 border-[#D8C8A8] space-y-1"
                  >
                  {(() => {
                    const groups = groupSections(chapter.sections);

                    return groups.map((group) => {
                      const { parentSection, childSections } = group;

                      const renderSubHeadersTree = (
                        subHeaders: SubHeader[],
                        chapId: string,
                        secId: string
                      ) => {
                        const subGroups = groupSubHeaders(subHeaders);

                        return (
                          <div className="ml-3 pl-2 my-0.5 border-l-2 border-[#B8860B]/40 space-y-0.5">
                            {subGroups.map((subGrp) => {
                              const isSubParentActive = activeSubHeaderId === subGrp.parent.id;
                              const isSubParentSelected =
                                isSubParentActive ||
                                subGrp.children.some((c) => c.id === activeSubHeaderId);
                              const hasSubChildren = subGrp.children.length > 0;

                              return (
                                <div key={subGrp.parent.id} className="space-y-0.5">
                                  {/* Level 3 SubHeader (###) */}
                                  <motion.button
                                    whileHover={{ x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      onSelectSection(chapId, secId, subGrp.parent.id);
                                      onCloseMobile();
                                    }}
                                    className={`w-full flex items-center justify-between py-1.5 px-2 text-[11.5px] rounded-[2px] transition-all text-left cursor-pointer min-h-[34px] ${
                                      isSubParentActive
                                        ? 'bg-[#B8860B] text-[#FAF5EB] font-bold shadow-2xs'
                                        : isSubParentSelected
                                        ? 'text-[#855B09] bg-[#E8DCC2]/90 font-bold'
                                        : 'text-[#5C4A3C] hover:text-[#8E1616] hover:bg-[#F2E8D3]/60'
                                    }`}
                                  >
                                    <span className="truncate flex items-center gap-1.5 pr-1">
                                      <span className="text-[#B8860B] text-[9.5px] font-mono shrink-0">
                                        └
                                      </span>
                                      <span className="truncate font-serif leading-snug">
                                        {subGrp.parent.title}
                                      </span>
                                    </span>
                                    {hasSubChildren && (
                                      <span
                                        className={`text-[8px] font-mono shrink-0 ml-1 ${
                                          isSubParentActive ? 'text-[#FAF5EB]' : 'text-[#B8860B]'
                                        }`}
                                      >
                                        {isSubParentSelected ? '▼' : '▶'}
                                      </span>
                                    )}
                                  </motion.button>

                                  {/* Level 4 SubHeaders (####) - Left-aligned, tabbed in further with animation for visual differentiation */}
                                  <AnimatePresence initial={false}>
                                    {isSubParentSelected && hasSubChildren && (
                                      <motion.div
                                        key="level4-children"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                        className="overflow-hidden ml-5 pl-2.5 my-0.5 border-l-2 border-[#8E1616]/50 space-y-0.5"
                                      >
                                        {subGrp.children.map((child) => {
                                          const isChildSubActive = activeSubHeaderId === child.id;
                                          return (
                                            <motion.button
                                              whileHover={{ x: 2 }}
                                              whileTap={{ scale: 0.98 }}
                                              key={child.id}
                                              onClick={() => {
                                                onSelectSection(chapId, secId, child.id);
                                                onCloseMobile();
                                              }}
                                              className={`w-full flex items-center gap-1.5 py-0.5 px-2 text-[10.5px] rounded-[2px] transition-all text-left cursor-pointer ${
                                                isChildSubActive
                                                  ? 'bg-[#8E1616] text-[#FAF5EB] font-bold shadow-2xs'
                                                  : 'text-[#8E1616] hover:text-[#A82222] hover:bg-[#FDF3F2] font-serif font-semibold italic'
                                              }`}
                                            >
                                              <span className="text-[#8E1616] text-[8.5px] font-mono shrink-0 font-bold">
                                                └─
                                              </span>
                                              <span className="truncate">{child.title}</span>
                                            </motion.button>
                                          );
                                        })}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        );
                      };

                      // Parent active / selected state
                      const isParentActive =
                        isChapterActive &&
                        activeSectionId === parentSection.id &&
                        !activeSubHeaderId;

                      const isParentSelected =
                        isChapterActive &&
                        (activeSectionId === parentSection.id ||
                          childSections.some((c) => c.id === activeSectionId));

                      return (
                        <div
                          key={parentSection.id}
                          className="space-y-0.5"
                        >
                          {/* Level 1 Parent Header */}
                          <motion.button
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onSelectSection(chapter.id, parentSection.id);
                              onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between py-1.5 px-2 text-xs sm:text-[12.5px] rounded-[2px] transition-all text-left font-bold cursor-pointer ${
                              isParentActive
                                ? 'bg-[#8E1616] text-[#FAF5EB] shadow-xs'
                                : isParentSelected
                                ? 'text-[#8E1616] bg-[#E8DCC2]/90 font-bold'
                                : 'text-[#28211D] hover:text-[#8E1616] hover:bg-[#F2E8D3]/60'
                            }`}
                          >
                            <span className="truncate pr-1 flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-mono font-bold ${
                                  isParentActive ? 'text-[#FAF5EB]' : 'text-[#8E1616]'
                                }`}
                              >
                                •
                              </span>
                              <span className="truncate font-serif">{parentSection.title}</span>
                            </span>
                            {(childSections.length > 0 ||
                              (parentSection.subHeaders &&
                                parentSection.subHeaders.length > 0)) && (
                              <span
                                className={`text-[9px] font-mono shrink-0 ml-1 ${
                                  isParentActive ? 'text-[#FAF5EB]' : 'text-[#8E1616]'
                                }`}
                              >
                                {isParentSelected ? '▼' : '▶'}
                              </span>
                            )}
                          </motion.button>

                          {/* Level 1 Direct SubHeaders (if any) with animation */}
                          <AnimatePresence initial={false}>
                            {isParentSelected &&
                              activeSectionId === parentSection.id &&
                              parentSection.subHeaders &&
                              parentSection.subHeaders.length > 0 && (
                                <motion.div
                                  key="level1-subheaders"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.18, ease: 'easeOut' }}
                                  className="overflow-hidden"
                                >
                                  {renderSubHeadersTree(
                                    parentSection.subHeaders,
                                    chapter.id,
                                    parentSection.id
                                  )}
                                </motion.div>
                              )}
                          </AnimatePresence>

                          {/* Level 2 Child Sections (Only displayed when Level 1 Parent is selected) with animation */}
                          <AnimatePresence initial={false}>
                            {isParentSelected && childSections.length > 0 && (
                              <motion.div
                                key="child-sections"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="overflow-hidden ml-2.5 pl-2 my-0.5 border-l-2 border-[#D8C8A8] space-y-0.5"
                              >
                                {childSections.map((childSec) => {
                                  const isChildActive =
                                    isChapterActive &&
                                    activeSectionId === childSec.id &&
                                    !activeSubHeaderId;

                                  const isChildSelected =
                                    isChapterActive && activeSectionId === childSec.id;

                                  const hasSubHeaders =
                                    childSec.subHeaders && childSec.subHeaders.length > 0;

                                  return (
                                    <div key={childSec.id} className="space-y-0.5">
                                      {/* Level 2 Child Header */}
                                      <motion.button
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                          onSelectSection(chapter.id, childSec.id);
                                          onCloseMobile();
                                        }}
                                        className={`w-full flex items-center justify-between py-1 px-2 text-xs rounded-[2px] transition-all text-left font-semibold cursor-pointer ${
                                          isChildActive
                                            ? 'bg-[#8E1616] text-[#FAF5EB] font-bold shadow-2xs'
                                            : isChildSelected
                                            ? 'text-[#8E1616] font-bold bg-[#E8DCC2]/90'
                                            : 'text-[#28211D] hover:text-[#8E1616] hover:bg-[#F2E8D3]/60'
                                        }`}
                                      >
                                        <span className="truncate pr-1 flex items-center gap-1.5">
                                          <span
                                            className={`text-[10px] font-mono ${
                                              isChildActive ? 'text-[#FAF5EB]' : 'text-[#8E1616]'
                                            }`}
                                          >
                                            ##
                                          </span>
                                          <span className="truncate font-serif">{childSec.title}</span>
                                        </span>
                                        {hasSubHeaders && (
                                          <span className="text-[9px] font-mono shrink-0 ml-1">
                                            {isChildSelected ? '▼' : '▶'}
                                          </span>
                                        )}
                                      </motion.button>

                                      {/* Level 3 & Level 4 SubHeaders */}
                                      <AnimatePresence initial={false}>
                                        {isChildSelected && hasSubHeaders && (
                                          <motion.div
                                            key="child-subheaders"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.18, ease: 'easeOut' }}
                                            className="overflow-hidden"
                                          >
                                            {renderSubHeadersTree(
                                              childSec.subHeaders!,
                                              chapter.id,
                                              childSec.id
                                            )}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    });
                  })()}
                  </motion.div>
                )}
              </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Expanded width for maximum readability */}
      <aside className="hidden lg:block w-80 lg:w-[21.5rem] shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-[#1A1613]/75"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-84 max-w-[88vw] h-full z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Sidebar = React.memo(SidebarComponent);
