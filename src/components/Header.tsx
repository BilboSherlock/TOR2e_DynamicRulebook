import React from 'react';
import {
  Search,
  Menu,
  X,
  Palette,
  BookOpen,
  Shield,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SupplementCategory } from '../types';

export interface NavTabConfig {
  id: SupplementCategory;
  label: string;
  icon: React.ReactNode;
}

export const NAV_TABS: NavTabConfig[] = [
  { id: 'Core Rules', label: 'Core Rules', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'Heroic Cultures', label: 'Heroic Cultures', icon: <Shield className="w-3.5 h-3.5" /> },
];

interface HeaderProps {
  selectedSupplement: SupplementCategory | 'All';
  onSelectSupplement: (supplement: SupplementCategory) => void;
  onGoHome: () => void;
  onOpenSearch: () => void;
  onOpenStyleGuide: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  activeView: 'toc' | 'heroic-cultures' | 'reader';
  isLoreMasterMode: boolean;
  onToggleLoreMasterMode: () => void;
}

export const HeaderComponent: React.FC<HeaderProps> = ({
  selectedSupplement,
  onSelectSupplement,
  onGoHome,
  onOpenSearch,
  onOpenStyleGuide,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  activeView,
  isLoreMasterMode,
  onToggleLoreMasterMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF3E0] border-b-2 border-[#D8C8A8] shadow-xs transition-colors">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left branding & mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {activeView !== 'toc' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-[2px] text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0] active:bg-[#E8DCC2] transition-all cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          )}

          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer group min-w-0"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              className="w-8 h-8 rounded-[2px] bg-[#8E1616] text-[#FAF5EB] flex items-center justify-center font-cinzel font-bold text-base shadow-xs border border-[#6E1010] shrink-0"
            >
              ᚠ
            </motion.div>
            <div className="min-w-0">
              <h1 className="font-cinzel font-bold text-xs sm:text-base tracking-tight text-[#8E1616] group-hover:text-[#A82222] transition-colors leading-tight truncate">
                The One Ring <span className="font-fell font-normal text-[#6B5748] text-xs hidden sm:inline sm:ml-1">Second Edition</span>
              </h1>
            </div>
          </button>
        </div>

        {/* Right actions: LM Mode Toggle, Styles Debugger & Quick Search */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* LoreMaster Mode Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleLoreMasterMode}
            className={`px-2 sm:px-2.5 py-1.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-serif min-h-[38px] ${
              isLoreMasterMode
                ? 'bg-[#8E1616] text-[#FAF5EB] border border-[#6E1010] shadow-2xs font-bold'
                : 'text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0] active:bg-[#E8DCC2]'
            }`}
            title={
              isLoreMasterMode
                ? 'LoreMaster Mode Active (The World & The Loremaster visible)'
                : 'Switch to LoreMaster Mode (Unlocks The World & The Loremaster)'
            }
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoreMasterMode ? 'text-[#FFD700]' : 'text-[#8E1616]'}`} />
            <span className="text-xs font-serif font-bold whitespace-nowrap">
              <span className="sm:hidden">LM</span>
              <span className="hidden sm:inline">LoreMaster</span>
            </span>
            <span
              className={`text-[9px] font-mono px-1 py-0.2 rounded-[2px] font-bold uppercase ${
                isLoreMasterMode
                  ? 'bg-[#6E1010] text-[#FFD700]'
                  : 'bg-[#E2D4B5] text-[#6B5748]'
              }`}
            >
              {isLoreMasterMode ? 'ON' : 'OFF'}
            </span>
          </motion.button>

          {/* Style Debugger */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenStyleGuide}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-[2px] text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0] active:bg-[#E8DCC2] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-serif min-h-[38px]"
            title="Open Formatting & Styles Debug Display"
          >
            <Palette className="w-3.5 h-3.5 text-[#8E1616]" />
            <span className="hidden md:inline text-xs font-serif font-semibold">Styles</span>
          </motion.button>

          {/* Quick Search Shortcut Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenSearch}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-[2px] text-[#8E1616] bg-[#EFE5CB] border border-[#D4C4A0] active:bg-[#E8DCC2] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-serif min-h-[38px]"
            title="Search Rulebook (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#8E1616]" />
            <span className="hidden sm:inline text-xs font-serif font-semibold">Search</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 text-[9px] font-mono rounded-[2px] bg-[#E8DCC2] border border-[#C8B693] text-[#8E1616] font-bold">
              Ctrl+K
            </kbd>
          </motion.button>
        </div>
      </div>

      {/* Main Navigation Bar Strip */}
      <div className="bg-[#EFE5CB]/90 border-t border-[#D8C8A8] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center gap-2 py-1.5 text-xs font-cinzel">
          {NAV_TABS.map((tab) => {
            const isSelected =
              (tab.id === 'Core Rules' && (selectedSupplement === 'Core Rules' || activeView === 'toc')) ||
              (tab.id === 'Heroic Cultures' && (selectedSupplement === 'Heroic Cultures' || activeView === 'heroic-cultures'));

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectSupplement(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-[2px] font-bold transition-all flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider min-h-[40px] ${
                  isSelected
                    ? 'bg-[#8E1616] text-[#FAF5EB] shadow-2xs border border-[#6E1010]'
                    : 'text-[#5C4A3C] hover:text-[#8E1616] hover:bg-[#FAF3E0] active:bg-[#E8DCC2] border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
