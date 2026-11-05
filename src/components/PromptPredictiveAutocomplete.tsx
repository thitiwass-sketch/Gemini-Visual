import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  Check,
  ChevronDown,
  X,
  Compass,
  FileCheck,
  Tag,
  BookOpen,
  PlusCircle,
  HelpCircle,
  Sliders
} from 'lucide-react';
import {
  SpecializedTerm,
  SPECIALIZED_TERMINOLOGY,
  getTermsForMode,
  queryPredictiveTerms
} from '../data/specializedTerminology';

interface PromptPredictiveAutocompleteProps {
  mode: string;
  userPrompt: string;
  onInsertTerm: (term: SpecializedTerm) => void;
  language: 'th' | 'en';
  isTextareaFocused: boolean;
  activeCursorWord?: string;
}

export const PromptPredictiveAutocomplete: React.FC<PromptPredictiveAutocompleteProps> = ({
  mode,
  userPrompt,
  onInsertTerm,
  language,
  isTextareaFocused,
  activeCursorWord = '',
}) => {
  const isThai = language === 'th';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [justInsertedId, setJustInsertedId] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredTerm, setHoveredTerm] = useState<SpecializedTerm | null>(null);

  // Determine mode display name
  const modeInfo = useMemo(() => {
    const norm = mode.toUpperCase();
    if (norm.includes('ENGINEER')) {
      return {
        labelTh: 'วิศวกรรมเครื่องกลและการผลิต',
        labelEn: 'Mechanical & Manufacturing Engineering',
        badge: 'ENGINEERING',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      };
    }
    if (norm.includes('ARCH')) {
      return {
        labelTh: 'สถาปัตยกรรมและโครงสร้างอาคาร',
        labelEn: 'Architecture & Building Structures',
        badge: 'ARCHITECTURE',
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      };
    }
    if (norm.includes('TECH') || norm.includes('CAD')) {
      return {
        labelTh: 'ภาพวาดเทคนิคและเขียนแบบ CAD',
        labelEn: 'Technical Drafting & CAD Wireframe',
        badge: 'TECH DRAFTING',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      };
    }
    if (norm.includes('RESEARCH') || norm.includes('ACADEMIC')) {
      return {
        labelTh: 'ระเบียบวิธีวิจัยและแผนภาพ APA 7th',
        labelEn: 'Research Methodology & APA 7th Figures',
        badge: 'RESEARCH',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      };
    }
    if (norm.includes('3D')) {
      return {
        labelTh: 'โมเดล 3D และทัศนศาสตร์ CGI',
        labelEn: '3D Spatial Modeling & CGI Optics',
        badge: '3D CGI',
        color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      };
    }
    return {
      labelTh: 'วิศวกรรมและข้อกำหนดเฉพาะทาง',
      labelEn: 'Engineering & Specialized Spec',
      badge: mode.replace('/', ''),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    };
  }, [mode]);

  // All terms for current mode
  const modeTerms = useMemo(() => {
    return getTermsForMode(mode);
  }, [mode]);

  // Unique categories in this mode's terms
  const categories = useMemo(() => {
    const set = new Set<string>();
    modeTerms.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [modeTerms]);

  // Filtered terms based on category and search query or userPrompt context
  const filteredTerms = useMemo(() => {
    let list = modeTerms;

    if (searchQuery.trim()) {
      list = queryPredictiveTerms(mode, searchQuery, 20);
    } else if (activeCursorWord && activeCursorWord.length >= 2) {
      // Prioritize terms matching what user is currently typing
      const matched = queryPredictiveTerms(mode, activeCursorWord, 15);
      if (matched.length > 0) {
        list = matched;
      }
    }

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    return list;
  }, [modeTerms, selectedCategory, searchQuery, activeCursorWord, mode]);

  const handleSelect = (term: SpecializedTerm) => {
    onInsertTerm(term);
    setJustInsertedId(term.id);
    setTimeout(() => setJustInsertedId(null), 1500);
  };

  // Check if term already appears in prompt
  const isAlreadyInPrompt = (termText: string) => {
    return userPrompt.toLowerCase().includes(termText.toLowerCase());
  };

  return (
    <div className="w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden transition-colors">
      {/* Autocomplete Header Bar (H3 inside Section H2) */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="flex items-center gap-1.5 font-display font-bold text-slate-100 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            <span>
              {isThai ? 'คำศัพท์เฉพาะทางแนะนำ (Predictive Autocomplete)' : 'Predictive Specialized Terminology'}
            </span>
          </h3>

          <span className="text-slate-400" aria-hidden="true">·</span>

          <span className="font-mono text-xs font-semibold text-amber-300">
            {modeInfo.badge}
          </span>

          <span className="text-xs text-slate-300 hidden sm:inline">
            ({isThai ? modeInfo.labelTh : modeInfo.labelEn})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDrawer(!showDrawer)}
            aria-expanded={showDrawer}
            aria-controls="predictive-terminology-drawer"
            className="text-xs font-medium text-slate-200 hover:text-amber-300 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span>{showDrawer ? (isThai ? 'ย่อแถบคำศัพท์' : 'Collapse') : isThai ? 'ขยายคำศัพท์' : 'Expand'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showDrawer ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {showDrawer && (
        <div id="predictive-terminology-drawer" className="p-3.5 space-y-3">
          {/* Category Tabs & Quick Search */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Category Filter Buttons (Smooth Wrapping) */}
            <div
              role="group"
              aria-label={isThai ? 'กรองหมวดหมู่คำศัพท์เฉพาะทาง' : 'Filter terminology by category'}
              className="flex flex-wrap items-center gap-1.5"
            >
              <button
                type="button"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                className={`text-xs px-2.5 py-1 rounded-md font-mono tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  selectedCategory === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {isThai ? 'ทั้งหมด' : 'All'} ({modeTerms.length})
              </button>

              {categories.map((cat) => {
                const sample = modeTerms.find((t) => t.category === cat);
                const label = isThai ? sample?.categoryLabelTh : sample?.categoryLabelEn;
                const count = modeTerms.filter((t) => t.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-md font-mono tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {label || cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick in-mode search filter */}
            <div className="relative w-full sm:w-64">
              <label htmlFor="terminology-search-input" className="sr-only">
                {isThai ? 'ค้นหาคำศัพท์เฉพาะทาง' : 'Filter specialized terminology'}
              </label>
              <input
                id="terminology-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isThai
                    ? 'ค้นคำศัพท์ (เช่น iso, เพลา, คอนกรีต)...'
                    : 'Filter terms (e.g., ISO, shear, camshaft)...'
                }
                className="w-full px-3 py-1.5 pr-7 text-xs rounded-md bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={isThai ? 'ล้างคำค้นหาคำศัพท์' : 'Clear terminology search query'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Terminology Suggestions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredTerms.map((term) => {
              const inPrompt = isAlreadyInPrompt(term.term);
              const isJustInserted = justInsertedId === term.id;

              return (
                <button
                  key={term.id}
                  type="button"
                  onClick={() => handleSelect(term)}
                  onMouseEnter={() => setHoveredTerm(term)}
                  onMouseLeave={() => setHoveredTerm(null)}
                  onFocus={() => setHoveredTerm(term)}
                  onBlur={() => setHoveredTerm(null)}
                  className={`group relative text-left p-3 rounded-lg border transition-colors flex flex-col justify-between gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isJustInserted
                      ? 'bg-emerald-950/40 border-emerald-500'
                      : inPrompt
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-semibold text-xs text-slate-100 group-hover:text-amber-300 transition-colors">
                        {isThai ? term.termTh : term.termEn}
                      </span>
                      {term.badge && (
                        <span className="text-[11px] font-mono text-amber-300 shrink-0">
                          {term.badge}
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-xs text-amber-300/95 break-words">
                      "{term.term}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800 text-xs text-slate-300">
                    <span className="leading-snug flex-1 min-w-0 break-words">
                      {isThai ? term.descriptionTh : term.descriptionEn}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[11px] shrink-0 flex items-center gap-1 ${
                        inPrompt
                          ? 'bg-slate-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 font-bold'
                      }`}
                    >
                      {inPrompt ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
                          <span>{isThai ? 'ใส่แล้ว' : 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span>{isThai ? '+ ใส่ในพรอมต์' : '+ Insert'}</span>
                        </>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredTerms.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-300 space-y-1.5">
                <BookOpen className="w-6 h-6 mx-auto text-slate-400 mb-1" aria-hidden="true" />
                <p className="text-xs">
                  {isThai ? 'ไม่พบคำศัพท์ที่ตรงกับการค้นหา' : 'No specialized terminology matching your query.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-amber-300 hover:text-white underline px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {isThai ? 'ล้างตัวกรองทั้งหมด' : 'Reset filters'}
                </button>
              </div>
            )}
          </div>

          {/* Active Term Tooltip & Architectural Guidance Footnote */}
          {hoveredTerm ? (
            <div
              role="status"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 flex items-start gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-300 mr-2">
                  {isThai ? hoveredTerm.termTh : hoveredTerm.termEn} ({hoveredTerm.badge || 'SPEC'}):
                </span>
                <span className="text-slate-200">
                  {isThai ? hoveredTerm.descriptionTh : hoveredTerm.descriptionEn}
                </span>
                <span className="block text-xs font-mono text-slate-300 mt-0.5">
                  Syntax: "{hoveredTerm.term}"
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>
                  {isThai
                    ? 'คำศัพท์ทุกคำผ่านเกณฑ์มาตรฐานวิศวกรรม/สถาปัตยกรรม (ISO, GD&T, ACI, APA 7th)'
                    : 'Terminology verified under ISO, GD&T, ACI & APA 7th academic standards.'}
                </span>
              </span>
              <span className="font-mono text-xs text-amber-300 tabular-nums">
                {modeTerms.length} {isThai ? 'คำศัพท์ในคลัง' : 'terms in library'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
