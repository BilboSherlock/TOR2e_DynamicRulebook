import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Header } from './components/Header';
const Sidebar = lazy(() => import('./components/Sidebar'));
const MarkdownViewer = lazy(() => import('./components/MarkdownViewer'));
const TableOfContents = lazy(() => import('./components/TableOfContents'));
const HeroicCulturesGrid = lazy(() => import('./components/HeroicCulturesGrid'));
const SearchModal = lazy(() => import('./components/SearchModal'));
const StyleGuideModal = lazy(() => import('./components/StyleGuideModal'));
import { CORE_CHAPTERS } from './data/rulebookData';
import { SupplementCategory } from './types';

type ViewMode = 'toc' | 'heroic-cultures' | 'reader';

export default function App() {
  // Ensure document never has 'dark' class
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // LoreMaster Mode state (default off for Player mode)
  const [isLoreMasterMode, setIsLoreMasterMode] = useState<boolean>(false);

  const isLoreMasterChapter = useCallback((ch: { id: string; title: string }) =>
    ch.id === 'the-loremaster' ||
    ch.id === 'the-world' ||
    ch.title.toLowerCase().includes('loremaster') ||
    ch.title.toLowerCase().includes('the world'), []);

  // Filter chapters based on LoreMaster Mode
  const chapters = useMemo(() => {
    return CORE_CHAPTERS.filter(
      (ch) => isLoreMasterMode || !isLoreMasterChapter(ch)
    );
  }, [isLoreMasterMode, isLoreMasterChapter]);

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
  const coreRulesChapters = useMemo(() => chapters.filter((ch) => ch.supplement === 'Core Rules'), [chapters]);
  const heroicCultureChapters = useMemo(() => chapters.filter((ch) => ch.supplement === 'Heroic Cultures'), [chapters]);

  // Active chapter and section lookup
  const activeChapter = useMemo(() => {
    return chapters.find((ch) => ch.id === activeChapterId) || chapters[0] || CORE_CHAPTERS[0];
  }, [chapters, activeChapterId]);

  const activeSection = useMemo(() => {
    return activeChapter?.sections.find((sec) => sec.id === activeSectionId) ||
      activeChapter?.sections[0] || {
        id: 'default',
        title: 'Empty Section',
        content: '# Section Not Found',
      };
  }, [activeChapter, activeSectionId]);

  // LoreMaster Mode Toggle Handler
  const handleToggleLoreMasterMode = useCallback(() => {
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
  }, [activeChapter, isLoreMasterChapter]);

  // Select section handler
  const handleSelectSection = useCallback((chapterId: string, sectionId: string, subHeaderId?: string) => {
    setActiveChapterId(chapterId);
    setActiveSectionId(sectionId);
    setActiveSubHeaderId(subHeaderId || null);

    const targetChapter = CORE_CHAPTERS.find((ch) => ch.id === chapterId);
    if (targetChapter?.supplement === 'Heroic Cultures') {
      setSelectedSupplement('Heroic Cultures');
      setActiveView('heroic-cultures');
    } else {
      setActiveView('reader');
    }
  }, []);

  // Top nav / supplement tab change handler
  const handleSelectSupplement = useCallback((supplement: SupplementCategory) => {
    setSelectedSupplement(supplement);
    if (supplement === 'Heroic Cultures') {
      setActiveView('heroic-cultures');
    } else {
      setActiveView('toc');
    }
  }, []);

  // Return to home / index
  const handleGoHome = useCallback(() => {
    setSelectedSupplement('Core Rules');
    setActiveView('toc');
  }, []);

  const handleOpenSearch = useCallback(() => setIsSearchOpen(true), []);
  const handleCloseSearch = useCallback(() => setIsSearchOpen(false), []);
  const handleOpenStyleGuide = useCallback(() => setIsStyleGuideOpen(true), []);
  const handleCloseStyleGuide = useCallback(() => setIsStyleGuideOpen(false), []);
  const handleToggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen((prev) => !prev), []);
  const handleCloseMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);

  const handleSelectCulturePage = useCallback((chapId: string) => {
    const targetChap = CORE_CHAPTERS.find((c) => c.id === chapId);
    if (targetChap && targetChap.sections.length > 0) {
      setActiveChapterId(targetChap.id);
      setActiveSectionId(targetChap.sections[0].id);
      setSelectedSupplement('Heroic Cultures');
      setActiveView('heroic-cultures');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#EFE8D3] text-[#28211D] font-serif transition-colors">
      {/* Header Bar */}
      <Header
        selectedSupplement={selectedSupplement}
        onSelectSupplement={handleSelectSupplement}
        onGoHome={handleGoHome}
        onOpenSearch={handleOpenSearch}
        onOpenStyleGuide={handleOpenStyleGuide}
        onToggleMobileSidebar={handleToggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
        activeView={activeView}
        isLoreMasterMode={isLoreMasterMode}
        onToggleLoreMasterMode={handleToggleLoreMasterMode}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* Navigation Sidebar */}
        <Suspense fallback={<div className="p-4">Loading Sidebar…</div>}>
          <Sidebar
            chapters={chapters}
            activeChapterId={activeChapterId}
            activeSectionId={activeSectionId}
            activeSubHeaderId={activeSubHeaderId}
            onSelectSection={handleSelectSection}
            selectedSupplement={selectedSupplement}
            setSelectedSupplement={setSelectedSupplement}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={handleCloseMobileSidebar}
          />
        </Suspense>

        {/* Dynamic Main View Area - High Performance Native Fade View Transition */}
        <div className="flex-1 min-w-0 transition-opacity duration-150 ease-out">
          {activeView === 'toc' && (
            <Suspense fallback={<div className="p-4">Loading Table of Contents…</div>}>
              <TableOfContents
                chapters={coreRulesChapters}
                title="Core Rules"
                onSelectSection={handleSelectSection}
              />
            </Suspense>
          )}

          {activeView === 'heroic-cultures' && (
            <Suspense fallback={<div className="p-4">Loading Heroic Cultures…</div>}>
              <HeroicCulturesGrid
                cultureChapters={heroicCultureChapters}
                activeCultureId={activeChapterId}
                onSelectCulturePage={handleSelectCulturePage}
                onNavigateSection={handleSelectSection}
              />
            </Suspense>
          )}

          {activeView === 'reader' && (
            <Suspense fallback={<div className="p-4">Loading Chapter…</div>}>
              <MarkdownViewer
                chapter={activeChapter}
                section={activeSection}
                activeSubHeaderId={activeSubHeaderId}
                onNavigateSection={handleSelectSection}
                allChapters={chapters}
              />
            </Suspense>
          )}
        </div>

        {/* Search Modal */}
        <Suspense fallback={<div className="p-4">Loading Search…</div>}>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={handleCloseSearch}
            chapters={chapters}
            onSelectResult={handleSelectSection}
          />
        </Suspense>

        {/* Stylesheet & Formatting Debug Display Modal */}
        <Suspense fallback={<div className="p-4">Loading Style Guide…</div>}>
          <StyleGuideModal
            isOpen={isStyleGuideOpen}
            onClose={handleCloseStyleGuide}
          />
        </Suspense>
      </div>
    </div>
  );
}
