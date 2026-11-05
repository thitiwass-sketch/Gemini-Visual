import React, { useState } from 'react';
import { FIFTY_POINT_QA, QAPoint } from '../data/visualOsData';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, HelpCircle, Filter, Search } from 'lucide-react';

interface QAInspectorProps {
  currentAuditChecks?: { id: string; point: string; status: string; note: string }[];
  currentStatus?: string;
  qaSummary?: string;
  language: 'th' | 'en';
}

export const QAInspector: React.FC<QAInspectorProps> = ({
  currentAuditChecks,
  currentStatus = 'PASS',
  qaSummary,
  language,
}) => {
  const isThai = language === 'th';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const statusMap: Record<string, { labelTh: string; labelEn: string; color: string; icon: React.ReactNode }> = {
    PASS: {
      labelTh: 'ผ่านเกณฑ์มาตรฐาน (PASS)',
      labelEn: 'Pass Standard',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    'PASS WITH FLAGS': {
      labelTh: 'ผ่านโดยมีข้อสังเกต (PASS WITH FLAGS)',
      labelEn: 'Pass with Flags',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    },
    'REVISION REQUIRED': {
      labelTh: 'ต้องปรับปรุงแก้ไข (REVISION REQUIRED)',
      labelEn: 'Revision Required',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
    },
    'STOP — MISSING INPUT': {
      labelTh: 'หยุด — ข้อมูลสำคัญไม่ครบ (STOP — MISSING INPUT)',
      labelEn: 'Stop — Missing Input',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      icon: <HelpCircle className="w-4 h-4 text-purple-400" />,
    },
    'STOP — UNSUPPORTED': {
      labelTh: 'หยุด — ขัดต่อหลักฐานเชิงประจักษ์ (STOP — UNSUPPORTED)',
      labelEn: 'Stop — Unsupported',
      color: 'text-red-500 bg-red-500/15 border-red-500/40',
      icon: <XCircle className="w-4 h-4 text-red-500" />,
    },
  };

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด (50 ข้อ)', labelEn: 'All (50 Items)' },
    { id: 'hierarchy', labelTh: 'ลำดับชั้น & วัตถุประสงค์', labelEn: 'Hierarchy & Subject' },
    { id: 'optics', labelTh: 'มุมมอง แสง & เลนส์', labelEn: 'Optics & Lighting' },
    { id: 'materials', labelTh: 'วัสดุ สี & ฉาก', labelEn: 'Materials & Colors' },
    { id: 'geometry', labelTh: 'เรขาคณิต & กายวิภาค', labelEn: 'Geometry & Anatomy' },
    { id: 'engineering', labelTh: 'วิศวกรรม & มิติสัดส่วน', labelEn: 'Engineering & Dimensions' },
    { id: 'typography', labelTh: 'ตัวอักษร & เลย์เอาต์', labelEn: 'Typography & Layout' },
    { id: 'consistency', labelTh: 'ความสม่ำเสมอ & แบรนด์', labelEn: 'Consistency & Edits' },
    { id: 'evidence', labelTh: 'ความสัตย์จริงของหลักฐาน', labelEn: 'Evidence & Integrity' },
  ];

  const filteredPoints = FIFTY_POINT_QA.filter((pt) => {
    const matchesCat = selectedCategory === 'all' || pt.category === selectedCategory;
    const matchesSearch =
      pt.id.includes(search) ||
      pt.titleTh.toLowerCase().includes(search.toLowerCase()) ||
      pt.titleEn.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeStatusInfo = statusMap[currentStatus] || statusMap['PASS'];

  return (
    <section aria-labelledby="qa-inspector-heading" className="space-y-6">
      {/* Overview Status Banner */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
              <h2 id="qa-inspector-heading" className="text-fluid-h2 font-display font-bold text-white">
                {isThai ? 'เกณฑ์ตรวจสอบ 50-Point Visual QA' : '50-Point Visual QA Audit Engine'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {isThai
                ? 'ระบบประเมินคุณภาพภาพ 50 มิติ ตรวจสอบความถูกต้องของเจตนา ทัศนมิติ กลไกวิศวกรรม และความสัตย์จริงทางวิชาการ (Evidence First)'
                : 'Rigorous 50-point evaluation protocol ensuring optical consistency, engineering plausibility, and research integrity.'}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end shrink-0">
            <span className="text-xs font-mono text-slate-300 mb-1">
              {isThai ? 'สถานะการตรวจประเมินปัจจุบัน:' : 'Current Audit Status:'}
            </span>
            <div
              role="status"
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${activeStatusInfo.color}`}
            >
              <span aria-hidden="true">{activeStatusInfo.icon}</span>
              <span>{isThai ? activeStatusInfo.labelTh : activeStatusInfo.labelEn}</span>
            </div>
          </div>
        </div>

        {qaSummary && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-200 leading-relaxed">
            <span className="font-semibold text-amber-300">{isThai ? 'ข้อสรุป:' : 'Summary:'} </span>
            {qaSummary}
          </div>
        )}
      </div>

      {/* Filter and Search Bar (Smooth Wrapping) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div
          role="group"
          aria-label={isThai ? 'กรองหมวดหมู่ QA' : 'Filter QA points by category'}
          className="flex flex-wrap items-center gap-1.5"
        >
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {isThai ? c.labelTh : c.labelEn}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64 shrink-0">
          <label htmlFor="qa-points-search" className="sr-only">
            {isThai ? 'ค้นหาข้อตรวจสอบ QA' : 'Filter QA points'}
          </label>
          <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="qa-points-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isThai ? 'ค้นหาข้อตรวจ...' : 'Filter QA points...'}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400"
          />
        </div>
      </div>

      {/* 50 Points List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPoints.map((item) => {
          const auditMatch = currentAuditChecks?.find((c) => c.id === item.id || c.id === String(item.num));

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition-colors ${
                auditMatch
                  ? auditMatch.status === 'PASS'
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-amber-300 tabular-nums shrink-0 mt-0.5">
                    #{item.id}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-display font-semibold text-slate-100 break-words">
                      {isThai ? item.titleTh : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 break-words">
                      {isThai ? item.titleEn : item.titleTh}
                    </p>
                  </div>
                </div>

                {/* Status Indicator with Icon + Text (Never color alone) */}
                <div className="shrink-0">
                  {auditMatch ? (
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                        auditMatch.status === 'PASS'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {auditMatch.status === 'PASS' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" aria-hidden="true" />
                      )}
                      <span>{auditMatch.status}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-300 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>STANDARD</span>
                    </span>
                  )}
                </div>
              </div>

              {auditMatch && auditMatch.note && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <span className="text-slate-300 font-semibold">{isThai ? 'ผลการประเมิน: ' : 'Audit Note: '}</span>
                  {auditMatch.note}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
