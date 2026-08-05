import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Palette,
  Search,
  Eye,
} from 'lucide-react';

interface StyleItem {
  id: string;
  category: 'Badges' | 'Links' | 'Boxes' | 'Typography' | 'Special';
  title: string;
  description: string;
  syntax: string;
  notes?: string;
  renderPreview: () => React.ReactNode;
}

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StyleGuideModal: React.FC<StyleGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const styleItems: StyleItem[] = [
    {
      id: 'skill-badge',
      category: 'Badges',
      title: 'Skill & Roll Badges',
      description: 'Capitalized bold red badge container with hover fill animation. Triggers automatically on skill names and roll types.',
      syntax: '**Awe** or **Protection Roll** or **Wisdom Roll**',
      notes: 'Auto-detected for skills: AWE, ATHLETICS, AWARENESS, HUNTING, SONG, CRAFT, ENHEARTEN, TRAVEL, INSIGHT, HEALING, COURTESY, BATTLE, PERSUADE, STEALTH, SCAN, EXPLORE, RIDDLE, LORE, AXES, BOWS, SPEARS, SWORDS, BRAWLING, DAGGERS, PROTECTION, VALOUR, WISDOM, etc.',
      renderPreview: () => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="skill-highlight">AWE</span>
          <span className="skill-highlight">PROTECTION ROLL</span>
          <span className="skill-highlight">WISDOM ROLL</span>
          <span className="skill-highlight">EXPLORE</span>
        </div>
      ),
    },
    {
      id: 'attribute-badge',
      category: 'Badges',
      title: 'Attribute Badges',
      description: 'Refined noble amber badge for core attributes. Triggers on bold attribute names.',
      syntax: '**Strength** or **Heart** or **Wits**',
      notes: 'Auto-detected for: STRENGTH, HEART, WITS, STRENGTH TN, HEART ATTRIBUTE, etc.',
      renderPreview: () => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="attribute-highlight">STRENGTH</span>
          <span className="attribute-highlight">HEART</span>
          <span className="attribute-highlight">WITS</span>
          <span className="attribute-highlight">STRENGTH TN</span>
        </div>
      ),
    },
    {
      id: 'wikilink-badge',
      category: 'Links',
      title: 'Compendium & Wikilinks',
      description: 'Uniform crimson link badges matching the skill and attribute design language. Clickable with hover state.',
      syntax: '[[Action Resolution]] or [[The Eye of Mordor|Eye of Mordor]]',
      notes: 'Navigates directly to the chapter, section, or subheader matching the title.',
      renderPreview: () => (
        <div className="flex flex-wrap items-center gap-2">
          <a href="#demo-link" className="markdown-body-demo-link">Action Resolution</a>
          <a href="#demo-link" className="markdown-body-demo-link">Eye of Mordor</a>
          <a href="#demo-link" className="markdown-body-demo-link">The Shadow</a>
        </div>
      ),
    },
    {
      id: 'example-box',
      category: 'Boxes',
      title: 'Example Box',
      description: 'Callout box bounded by double red lines top and bottom, featuring a Cinzel header badge.',
      syntax: '[example]\n**Example:**\nScouting ahead for the Company, Hanar the Dwarf...\n[/example]\n\nOR ::: example\nOR paragraph starting with "Example:"',
      renderPreview: () => (
        <div className="example-box my-1 p-4 bg-[#FAF2E4]/80 border-t-4 border-b-4 border-double border-[#8E1616] rounded-[2px] relative shadow-2xs">
          <span className="block font-cinzel font-bold text-[#8E1616] text-xs tracking-wider uppercase mb-1.5">
            ❖ Example
          </span>
          <p className="text-[#2D241E] text-xs leading-relaxed m-0">
            Scouting ahead for the Company, Hanar the Dwarf has a chance to notice a group of Goblins setting up an ambush. He rolls a Feat die plus two Success dice against his <strong className="attribute-highlight">STRENGTH</strong> TN of 13.
          </p>
        </div>
      ),
    },
    {
      id: 'key-box',
      category: 'Boxes',
      title: 'Key Box',
      description: 'Parchment gold notice box with warm double-border styling for key rule summaries and tables.',
      syntax: '[key-box]\n#### Key Rule\nFeat dice score an Automatic Success on an Elven Rune (12).\n[/key-box]\n\nOR ::: key-box',
      renderPreview: () => (
        <div className="key-box my-1 p-3.5 bg-[#FAF3E0] border-2 border-[#D6C4A5] rounded-[2px] shadow-2xs">
          <h5 className="font-cinzel font-bold text-[#8E1616] text-xs uppercase mb-1">
            ❖ Key Rule: Feat Die
          </h5>
          <p className="text-[#2D241E] text-xs leading-relaxed m-0">
            A Feat die showing the Gandal Rune (11) yields an automatic success regardless of the Target Number.
          </p>
        </div>
      ),
    },
    {
      id: 'red-box',
      category: 'Boxes',
      title: 'Red Box / Warning Notice',
      description: 'Deep crimson callout box for critical warnings, Loremaster directives, and Shadow hazards.',
      syntax: '[red-box]\n#### Warning\nHeroes accumulate Shadow points when entering corrupted regions.\n[/red-box]\n\nOR ::: red-box',
      renderPreview: () => (
        <div className="red-box my-1 p-3.5 bg-[#FDF2F2] border-2 border-[#8E1616]/40 rounded-[2px]">
          <h5 className="font-cinzel font-bold text-[#8E1616] text-xs uppercase mb-1">
            ⚠ Danger: Shadow Tests
          </h5>
          <p className="text-[#2D241E] text-xs leading-relaxed m-0">
            Failing a Shadow test increases a Player-hero’s Shadow rating and may lead to becoming Miserable.
          </p>
        </div>
      ),
    },
    {
      id: 'gandalf-letter',
      category: 'Special',
      title: 'Letter from Gandalf',
      description: 'Calligraphic handwritten glowing red script on parchment with aura effect.',
      syntax: '::: gandalf-letter\nTo Frodo Baggins,\nCome at once to Rivendell...\n:::',
      renderPreview: () => (
        <div className="my-1 p-3 bg-[#FAF5EB] border border-[#D6C4A5] rounded-[2px] text-center">
          <p className="font-handwriting text-lg text-[#C81E1E] leading-relaxed drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
            "Look to my coming on the first light of the fifth day..."
          </p>
        </div>
      ),
    },
    {
      id: 'floating-quote',
      category: 'Typography',
      title: 'Centered Floating Quote',
      description: 'Elegant IM Fell English italic quote text, centered with warm amber tone and generous line height.',
      syntax: '> "All that is gold does not glitter, Not all those who wander are lost..."',
      renderPreview: () => (
        <blockquote className="my-1 px-4 py-2 font-fell italic text-sm text-[#7A5B0B] text-center max-w-lg mx-auto">
          "All that is gold does not glitter, Not all those who wander are lost; The old that is strong does not wither, Deep roots are not reached by the frost."
        </blockquote>
      ),
    },
    {
      id: 'red-diamond-list',
      category: 'Typography',
      title: 'Red Diamond Lists',
      description: 'Unordered lists styled with red diamond bullets (◆) and indented nested sub-diamonds (◇).',
      syntax: '* Personality Skills\n  * Awe\n  * Enhearten\n* Movement Skills',
      renderPreview: () => (
        <ul className="text-xs space-y-1.5 pl-5 relative list-none">
          <li className="relative pl-0 text-[#2D241E]">
            <span className="text-[#8E1616] absolute -left-4 top-0 font-bold">◆</span>
            Personality Skills (<span className="skill-highlight">AWE</span>, <span className="skill-highlight">ENHEARTEN</span>)
          </li>
          <li className="relative pl-0 text-[#2D241E]">
            <span className="text-[#8E1616] absolute -left-4 top-0 font-bold">◆</span>
            Movement Skills (<span className="skill-highlight">ATHLETICS</span>, <span className="skill-highlight">TRAVEL</span>)
            <ul className="pl-4 mt-1 space-y-1">
              <li className="relative text-[#2D241E]">
                <span className="text-[#8E1616] absolute -left-3 top-0">◇</span>
                Requires physical aptitude tests
              </li>
            </ul>
          </li>
        </ul>
      ),
    },
    {
      id: 'nav-headers',
      category: 'Typography',
      title: 'Heading Hierarchy & Nav Indentation',
      description: 'H1 (Chapter Header), H2 (Section Header), H3 (Subsection), H4 (Subheader - tabbed in navigation).',
      syntax: '# Chapter Title\n## Section Title\n### Subsection Title\n#### Subheader (Tabbed in Nav)',
      renderPreview: () => (
        <div className="space-y-2 border-l-2 border-[#8E1616]/30 pl-3">
          <h2 className="font-cinzel text-sm font-bold text-[#8E1616] uppercase">H2 Section Title</h2>
          <h3 className="font-cinzel text-xs font-bold text-[#A82222]">H3 Subsection Title</h3>
          <h4 className="font-cinzel text-[11px] font-semibold text-[#B22222] pl-3 italic">#### Subheader (Tabbed in Sidebar Nav)</h4>
        </div>
      ),
    },
  ];

  const categories = ['All', 'Badges', 'Links', 'Boxes', 'Typography', 'Special'];

  const filteredItems = styleItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1410]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-[#FAF5EB] border-2 border-[#8E1616] shadow-2xl rounded-[4px] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#2D241E]"
        >
          {/* Header Bar */}
          <div className="bg-[#8E1616] text-[#FAF5EB] px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-[#6E1010]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[2px] bg-[#FAF5EB] text-[#8E1616] flex items-center justify-center font-bold shadow-2xs">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-cinzel font-bold text-base sm:text-lg tracking-wide flex items-center gap-2">
                  Stylesheet & Formatting Debugger
                </h2>
                <p className="text-[11px] text-[#F3E5D8] font-serif opacity-90">
                  Live preview catalog, style calls, and markdown syntax guide
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[2px] hover:bg-[#6E1010] text-[#FAF5EB] transition-colors cursor-pointer"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-3 sm:p-4 bg-[#EFE6D2] border-b border-[#D8C8A8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-serif rounded-[2px] transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#8E1616] text-[#FAF5EB] font-bold shadow-2xs'
                      : 'bg-[#E5D8C0] text-[#5C4838] hover:bg-[#D8C8A8] hover:text-[#1A1410]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#8C7565] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search styles or syntax..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-[#FAF5EB] border border-[#C8B693] rounded-[2px] text-[#2D241E] focus:outline-none focus:border-[#8E1616]"
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-[#8C7565]">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-serif text-sm">No formatting styles found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF2E4]/60 border border-[#D8C8A8] rounded-[3px] p-4 shadow-2xs hover:border-[#8E1616]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E6D8BE]">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[9.5px] font-mono font-bold uppercase rounded-[2px] bg-[#8E1616] text-[#FAF5EB]">
                        {item.category}
                      </span>
                      <h3 className="font-cinzel font-bold text-sm text-[#8E1616] tracking-wide">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, item.syntax)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded-[2px] bg-[#EFE6D2] border border-[#C8B693] text-[#8E1616] hover:bg-[#8E1616] hover:text-[#FAF5EB] transition-all cursor-pointer self-start sm:self-auto"
                      title="Copy Markdown Call Syntax"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Syntax</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#5C4838] my-2 font-serif leading-relaxed">
                    {item.description}
                  </p>

                  {/* Syntax Box */}
                  <div className="bg-[#1A1410] text-[#EAD8C0] p-2.5 rounded-[2px] font-mono text-[11px] overflow-x-auto my-2.5 border border-[#3A2D23]">
                    <div className="text-[9px] uppercase tracking-wider text-[#A88C78] mb-1 font-sans">
                      Markdown Call Syntax:
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[#F3E5D8] selection:bg-[#8E1616]">
                      {item.syntax}
                    </pre>
                  </div>

                  {item.notes && (
                    <p className="text-[10.5px] text-[#7A5B0B] font-serif italic mb-2.5">
                      💡 {item.notes}
                    </p>
                  )}

                  {/* Live Rendered Output */}
                  <div className="mt-3 pt-2.5 border-t border-dashed border-[#D8C8A8]">
                    <div className="text-[10px] font-cinzel font-bold text-[#8E1616] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Live Rendered Output
                    </div>
                    <div className="bg-[#FAF5EB] p-3 rounded-[2px] border border-[#E6D8BE]">
                      {item.renderPreview()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-[#EFE6D2] px-4 sm:px-6 py-2.5 border-t border-[#D8C8A8] flex items-center justify-between text-[11px] text-[#6B5748] font-serif">
            <span>The One Ring 2E Ruleset Formatting Catalog</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[#8E1616] text-[#FAF5EB] font-cinzel font-bold text-xs rounded-[2px] hover:bg-[#6E1010] transition-colors cursor-pointer"
            >
              Close Debugger
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
