import React, { useState } from 'react';
import { COMMAND_CATEGORIES, CommandCategory } from '../data/visualOsData';
import { Search, Plus, Terminal, Check, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface CommandDictionaryProps {
  onInsertCommand: (command: string) => void;
  activeCommands: string[];
  language: 'th' | 'en';
}

export const CommandDictionary: React.FC<CommandDictionaryProps> = ({
  onInsertCommand,
  activeCommands,
  language,
}) => {
  const isThai = language === 'th';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSyntax, setCopiedSyntax] = useState<boolean>(false);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  const visibleCategoryButtons = showAllCategories
    ? COMMAND_CATEGORIES
    : COMMAND_CATEGORIES.slice(0, 8);

  const filteredCategories = COMMAND_CATEGORIES.filter((cat) => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    return true;
  }).map((cat) => {
    const matchingCmds = cat.commands.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.descTh.toLowerCase().includes(search.toLowerCase()) ||
        c.descEn.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, commands: matchingCmds };
  }).filter((cat) => cat.commands.length > 0);

  const totalFilteredCount = filteredCategories.reduce((sum, c) => sum + c.commands.length, 0);

  const copySyntaxExample = () => {
    const syntax = '/MODE + /SUBJECT + /CAMERA + /COMPOSITION + /LIGHTING + /STYLE + /FORMAT';
    navigator.clipboard.writeText(syntax);
    setCopiedSyntax(true);
    setTimeout(() => setCopiedSyntax(false), 2000);
  };

  return (
    <section aria-labelledby="command-dictionary-heading" className="space-y-6">
      {/* Header with syntax combinator guide */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 id="command-dictionary-heading" className="text-fluid-h2 font-display font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{isThai ? 'พจนานุกรมคำสั่งสายตา 352+ คำสั่ง' : '352+ Visual Command Dictionary'}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isThai
                ? 'คำสั่งที่จัดโครงสร้างเพื่อความแม่นยำทางภาพและวิศวกรรม คลิกคำสั่งเพื่อใส่ในคำสั่งงานของคุณ'
                : 'Modular visual commands engineered for structural precision. Click any command to append.'}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <label htmlFor="command-dictionary-search" className="sr-only">
              {isThai ? 'ค้นหาคำสั่งในพจนานุกรม' : 'Search visual command dictionary'}
            </label>
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="command-dictionary-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isThai ? 'ค้นหาคำสั่ง เช่น /iso, /hero...' : 'Search commands (e.g. /iso, /hero)...'}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>
        </div>

        {/* Command Combinator Formula Banner */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-amber-300 font-mono">
              {isThai ? 'ไวยากรณ์ผสมผสาน:' : 'Combination Formula:'}
            </span>
            <code className="bg-slate-900 px-2.5 py-1 rounded text-slate-100 font-mono text-xs border border-slate-800 break-words">
              /MODE + /SUBJECT + /CAMERA + /COMPOSITION + /LIGHTING + /STYLE + /FORMAT
            </code>
          </div>

          <button
            type="button"
            onClick={copySyntaxExample}
            aria-label={isThai ? 'คัดลอกสูตรไวยากรณ์คำสั่ง' : 'Copy command combination formula'}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {copiedSyntax ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            )}
            <span>{copiedSyntax ? (isThai ? 'คัดลอกสูตรแล้ว' : 'Copied') : (isThai ? 'คัดลอกสูตร' : 'Copy Syntax')}</span>
          </button>
        </div>

        {/* Category Filter Buttons (Smooth Wrapping + Accessible Disclosure) */}
        <div
          role="group"
          aria-label={isThai ? 'กรองคำสั่งตามหมวดหมู่' : 'Filter commands by category'}
          className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800"
        >
          <button
            type="button"
            aria-pressed={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {isThai ? `ทุกหมวดหมู่ (${totalFilteredCount})` : `All Categories (${totalFilteredCount})`}
          </button>

          {visibleCategoryButtons.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {isThai ? cat.nameTh : cat.nameEn} ({cat.count})
              </button>
            );
          })}

          {COMMAND_CATEGORIES.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              aria-expanded={showAllCategories}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-amber-300 hover:text-white border border-slate-700 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {showAllCategories
                ? isThai ? 'ย่อหมวดหมู่' : 'Show Fewer Categories'
                : isThai ? `+ ดูทั้ง ${COMMAND_CATEGORIES.length} หมวดหมู่` : `+ View All ${COMMAND_CATEGORIES.length} Categories`}
            </button>
          )}
        </div>
      </div>

      {/* Commands List grouped by category */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-fluid-h3 font-display font-bold text-white flex items-center gap-2">
                <span>{isThai ? cat.nameTh : cat.nameEn}</span>
                <span className="text-xs text-slate-300 font-mono tabular-nums">({cat.commands.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {cat.commands.map((cmd) => {
                const isActive = activeCommands.includes(cmd.name);
                return (
                  <button
                    key={cmd.name}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onInsertCommand(cmd.name)}
                    className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between gap-1.5 group focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="font-mono text-xs font-semibold text-amber-300 group-hover:text-amber-200 break-words">
                        {cmd.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono shrink-0">
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                            <span className="text-emerald-300">{isThai ? 'เลือกแล้ว' : 'Active'}</span>
                          </>
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" aria-hidden="true" />
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed break-words">
                      {isThai ? cmd.descTh : cmd.descEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Conflict Resolution Rules Guide */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mt-8 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <h3 className="text-xs font-display font-bold">
            {isThai ? 'กฎการคลี่คลายข้อขัดแย้งของคำสั่ง (Conflict Resolution Rules)' : 'Command Conflict Resolution Rules'}
          </h3>
        </div>
        <p className="leading-relaxed text-slate-200">
          {isThai
            ? 'หากคำสั่งในพร้อมต์ขัดแย้งกัน ระบบจะจัดลำดับความสำคัญดังนี้: 1) คำสั่งเจาะจงล่าสุดของผู้ใช้ → 2) วัตถุประสงค์ของภารกิจ → 3) ความเป็นไปได้ทางฟิสิกส์/วิศวกรรม → 4) ความชัดเจนของลำดับชั้นสายตา → 5) ค่าปริยายของระบบ'
            : 'If commands conflict, the engine resolves in order: 1) Latest explicit user instruction → 2) Task purpose → 3) Physical/engineering plausibility → 4) Visual clarity → 5) Default system assumptions.'}
        </p>
      </div>
    </section>
  );
};
