import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MarkdownViewer } from './components/MarkdownViewer';
import { TableOfContents } from './components/TableOfContents';
import { HeroicCulturesGrid } from './components/HeroicCulturesGrid';
import { SearchModal } from './components/SearchModal';
import { StyleGuideModal } from './components/StyleGuideModal';
import { CORE_CHAPTERS } from './data/rulebookData';
import { SupplementCategory } from './types';
import { AnimatePresence, motion } from 'motion/react';

type ViewMode = 'toc' | 'heroic-cultures' | 'reader';

export default function App() {
  // Ensure document never has 'dark' class
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // LoreMaster Mode state (default off for Player mode)
  const [isLoreMasterMode, setIsLoreMasterMode] = useState<boolean>(false);

  const isLoreMasterChapter = (ch: { id: string; title: string }) =>
    ch.id === 'the-loremaster' ||
    ch.id === 'the-world' ||
    ch.title.toLowerCase().includes('loremaster') ||
    ch.title.toLowerCase().includes('the world');

  // Filter chapters based on LoreMaster Mode
  const chapters = CORE_CHAPTERS.filter(
    (ch) => isLoreMasterMode || !isLoreMasterChapter(ch)
  );

  // View mode state
  const [activeView, setActiveView] = useState<ViewMode>('toc');

  // Active supplement selection
  const [selectedSupplement, setSelectedSupplement] = useState<SupplementCategory | 'All'>('Core Rules');

  // Navigation chapter/section state
  const [activeChapterId, setActiveChapterId] = useState<string>(CORE_CHAPTERS[0].id);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    CORE_CHAPTERS[0].sections[0].id
  );
  const [activeSubHeaderId, setActiveSubHeaderId] = useState<string | null>(null);

  // Modal visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filtered chapter collections
  const coreRulesChapters = chapters.filter((ch) => ch.supplement === 'Core Rules');
  const heroicCultureChapters = chapters.filter((ch) => ch.supplement === 'Heroic Cultures');

  // Active chapter and section lookup
  const activeChapter =
    chapters.find((ch) => ch.id === activeChapterId) || chapters[0] || CORE_CHAPTERS[0];
  const activeSection =
    activeChapter?.sections.find((sec) => sec.id === activeSectionId) ||
    activeChapter?.sections[0] || {
      id: 'default',
      title: 'Empty Section',
      content: '# Section Not Found',
    };

  // LoreMaster Mode Toggle Handler
  const handleToggleLoreMasterMode = () => {
    setIsLoreMasterMode((prev) => {
      const nextMode = !prev;
      if (!nextMode && isLoreMasterChapter(activeChapter)) {
        const fallbackChapter = CORE_CHAPTERS.find((ch) => !isLoreMasterChapter(ch)) || CORE_CHAPTERS[0];
        setActiveChapterId(fallbackChapter.id);
        setActiveSectionId(fallbackChapter.sections[0].id);
        setActiveSubHeaderId(null);
      }
      return nextMode;
    });
  };

  // Select section handler
  const handleSelectSection = (chapterId: string, sectionId: string, subHeaderId?: string) => {
    setActiveChapterId(chapterId);
    setActiveSectionId(sectionId);
    setActiveSubHeaderId(subHeaderId || null);

    const targetChapter = chapters.find((ch) => ch.id === chapterId);
    if (targetChapter?.supplement === 'Heroic Cultures') {
      setSelectedSupplement('Heroic Cultures');
      setActiveView('heroic-cultures');
    } else {
      setActiveView('reader');
    }
  };

  // Top nav / supplement tab change handler
  const handleSelectSupplement = (supplement: SupplementCategory) => {
    setSelectedSupplement(supplement);
    if (supplement === 'Heroic Cultures') {
      setActiveView('heroic-cultures');
    } else {
      setActiveView('toc');
    }
  };

  // Return to home / index
  const handleGoHome = () => {
    setSelectedSupplement('Core Rules');
    setActiveView('toc');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EFE8D3] text-[#28211D] font-serif transition-colors">
      {/* Header Bar */}
      <Header
        selectedSupplement={selectedSupplement}
        onSelectSupplement={handleSelectSupplement}
        onGoHome={handleGoHome}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        activeView={activeView}
        isLoreMasterMode={isLoreMasterMode}
        onToggleLoreMasterMode={handleToggleLoreMasterMode}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* Navigation Sidebar */}
        <Sidebar
          chapters={chapters}
          activeChapterId={activeChapterId}
          activeSectionId={activeSectionId}
          activeSubHeaderId={activeSubHeaderId}
          onSelectSection={handleSelectSection}
          selectedSupplement={selectedSupplement}
          setSelectedSupplement={setSelectedSupplement}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Main View Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeView === 'toc' && (
              <motion.div
                key="toc-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <TableOfContents
                  chapters={coreRulesChapters}
                  title="Core Rules"
                  onSelectSection={handleSelectSection}
                />
              </motion.div>
            )}

            {activeView === 'heroic-cultures' && (
              <motion.div
                key="heroic-cultures-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <HeroicCulturesGrid
                  cultureChapters={heroicCultureChapters}
                  activeCultureId={activeChapterId}
                  onSelectCulturePage={(chapId) => {
                    const targetChap = chapters.find((c) => c.id === chapId);
                    if (targetChap && targetChap.sections.length > 0) {
                      setActiveChapterId(targetChap.id);
                      setActiveSectionId(targetChap.sections[0].id);
                      setActiveView('reader');
                    }
                  }}
                  onNavigateSection={handleSelectSection}
                />
              </motion.div>
            )}

            {activeView === 'reader' && (
              <motion.div
                key="reader-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <MarkdownViewer
                  chapter={activeChapter}
                  section={activeSection}
                  activeSubHeaderId={activeSubHeaderId}
                  onNavigateSection={handleSelectSection}
                  allChapters={chapters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapters={chapters}
        onSelectResult={handleSelectSection}
      />

      {/* Stylesheet & Formatting Debug Display Modal */}
      <StyleGuideModal
        isOpen={isStyleGuideOpen}
        onClose={() => setIsStyleGuideOpen(false)}
      />
    </div>
  );
}
