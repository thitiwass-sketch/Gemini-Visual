import React, { useState } from 'react';
import { AUTO_MODES, AutoMode } from '../data/visualOsData';
import { Search, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface AutoModesExplorerProps {
  onSelectMode: (mode: AutoMode) => void;
  language: 'th' | 'en';
}

export const AutoModesExplorer: React.FC<AutoModesExplorerProps> = ({ onSelectMode, language }) => {
  const isThai = language === 'th';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด (20)', labelEn: 'All (20)' },
    { id: 'general', labelTh: 'ทั่วไป', labelEn: 'General' },
    { id: 'design', labelTh: 'ออกแบบ & ศิลปะ', labelEn: 'Design & Art' },
    { id: 'technical', labelTh: 'วิศวกรรม & เทคนิค', labelEn: 'Technical & Eng' },
    { id: 'research', labelTh: 'วิจัย & วิชาการ', labelEn: 'Research & Academic' },
    { id: 'marketing', labelTh: 'การตลาด & โฆษณา', labelEn: 'Marketing & Ads' },
    { id: 'workflow', labelTh: 'เวิร์กโฟลว์ & ควบคุม', labelEn: 'Workflow & Control' },
  ];

  const filteredModes = AUTO_MODES.filter((mode) => {
    const matchesCategory = selectedCategory === 'all' || mode.category === selectedCategory;
    const matchesSearch =
      mode.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mode.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mode.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mode.defaultBehaviorTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mode.defaultBehaviorEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section aria-labelledby="auto-modes-heading" className="space-y-6">
      {/* Header section */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 id="auto-modes-heading" className="text-fluid-h2 font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{isThai ? '20 โหมดอัตโนมัติ (Auto Modes Specification)' : '20 Auto Modes Specification'}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isThai
                ? 'เลือกโหมดที่ตรงกับงานของคุณเพื่อตั้งค่าลอจิก ลำดับชั้น และข้อกำหนดทางสายตาอัตโนมัติ'
                : 'Select an auto mode to configure dedicated visual hierarchy, optics, and domain rules.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <label htmlFor="auto-modes-search" className="sr-only">
              {isThai ? 'ค้นหาโหมดอัตโนมัติ' : 'Search auto modes'}
            </label>
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="auto-modes-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isThai ? 'ค้นหาโหมด...' : 'Search modes...'}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>
        </div>

        {/* Category Filter Tabs (Smooth Wrapping) */}
        <div
          role="group"
          aria-label={isThai ? 'กรองโหมดตามหมวดหมู่' : 'Filter auto modes by category'}
          className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {isThai ? cat.labelTh : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModes.map((mode) => (
          <article
            key={mode.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono">
                <span className="font-bold text-amber-300">
                  {mode.code}
                </span>
                <span className="text-slate-300 tabular-nums">
                  MODE #{mode.id}
                </span>
              </div>

              <h3 className="text-fluid-h3 font-display font-semibold text-white">
                {isThai ? mode.nameTh : mode.nameEn}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isThai ? mode.nameEn : mode.nameTh}
              </p>

              <p className="text-xs text-slate-200 mt-3 leading-relaxed">
                {isThai ? mode.defaultBehaviorTh : mode.defaultBehaviorEn}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
              <div>
                <div className="text-xs text-slate-300 mb-1.5 font-medium">
                  {isThai ? 'คำสั่งที่แนะนำ:' : 'Suggested syntax:'}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-300">
                  {mode.suggestedCommands.map((cmd, i) => (
                    <React.Fragment key={i}>
                      <span className="text-amber-300">{cmd}</span>
                      {i < mode.suggestedCommands.length - 1 && (
                        <span className="text-slate-500" aria-hidden="true">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectMode(mode)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-colors flex items-center justify-between focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>{isThai ? 'เปิดใช้งานในสตูดิโอ' : 'Load into Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
