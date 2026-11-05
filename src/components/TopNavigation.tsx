import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Globe,
  History 
} from 'lucide-react';

interface TopNavigationProps {
  activeTab: 'studio' | 'modes' | 'commands' | 'qa' | 'research' | 'series';
  setActiveTab: (tab: 'studio' | 'modes' | 'commands' | 'qa' | 'research' | 'series') => void;
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
  seriesLockActive: boolean;
  historyCount: number;
  onOpenHistory: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  seriesLockActive,
  historyCount,
  onOpenHistory,
}) => {
  const isThai = language === 'th';

  const navItems: {
    id: 'studio' | 'modes' | 'commands' | 'qa' | 'research';
    labelTh: string;
    labelEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'studio',
      labelTh: 'คอนโซลสตูดิโอ',
      labelEn: 'Studio Console',
      icon: <Terminal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'modes',
      labelTh: '20 โหมดอัตโนมัติ',
      labelEn: '20 Auto Modes',
      icon: <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'commands',
      labelTh: 'คำสั่ง 352+',
      labelEn: '352+ Commands',
      icon: <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'qa',
      labelTh: '50-Point QA',
      labelEn: '50-Point QA',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'research',
      labelTh: 'โครงการวิจัย NRRU',
      labelEn: 'Research NRRU',
      icon: <GraduationCap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Title (Single-line wordmark) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            aria-label={isThai ? 'กลับสู่หน้าหลัก GEMINI VISUAL AI OS' : 'Go to GEMINI VISUAL AI OS home'}
            className="text-left group flex items-center gap-2.5 rounded-lg p-1 -ml-1 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
              <Terminal className="w-4 h-4 text-slate-950" aria-hidden="true" />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              GEMINI VISUAL AI OS
            </span>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label={isThai ? 'เมนูหลักของระบบ' : 'Primary workspace navigation'}
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'text-amber-300 bg-slate-900 border border-amber-500/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{isThai ? item.labelTh : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Workspace Controls & Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            aria-label={
              isThai
                ? `เปิดประวัติการสร้างภาพ (${historyCount} รายการ)`
                : `Open Generation History (${historyCount} records)`
            }
            className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <History className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{isThai ? 'ประวัติ' : 'History'}</span>
            <span className="font-mono text-xs text-amber-300 tabular-nums font-semibold">
              ({historyCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('series')}
            aria-pressed={seriesLockActive}
            aria-label={
              isThai
                ? `ตั้งค่าการล็อกชุดภาพ สถานะปัจจุบัน: ${seriesLockActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`
                : `Configure Series Consistency Lock, currently ${seriesLockActive ? 'Active' : 'Inactive'}`
            }
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              seriesLockActive
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">
              {seriesLockActive
                ? isThai ? 'ล็อกชุดภาพ: เปิด' : 'Series Lock: On'
                : isThai ? 'ล็อกชุดภาพ: ปิด' : 'Series Lock: Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            aria-label={isThai ? 'เปลี่ยนภาษาเป็นภาษาอังกฤษ (Switch to English)' : 'Switch language to Thai (เปลี่ยนเป็นภาษาไทย)'}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Globe className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
            <span className="font-mono font-semibold">{language.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Strip (Reflows cleanly with wrapping) */}
      <nav
        aria-label={isThai ? 'เมนูนำทางสำหรับหน้าจอมือถือ' : 'Mobile workspace navigation'}
        className="md:hidden border-t border-slate-800/80 bg-slate-900/60 px-4 py-2 flex flex-wrap items-center gap-1.5"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isActive
                  ? 'text-slate-950 bg-amber-500 font-bold'
                  : 'text-slate-300 bg-slate-950/80 hover:text-white border border-slate-800'
              }`}
            >
              {item.icon}
              <span>{isThai ? item.labelTh : item.labelEn}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

