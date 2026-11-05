import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Terminal,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ArrowUpRight,
  Layers,
  Sliders,
  Plus,
  RotateCcw,
  BookOpen,
  ClipboardCheck,
  GitBranch,
  AlertOctagon,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  APE_EXECUTION_MODES,
  APE_COMMANDS,
  RECOMMENDED_COMMAND_SEQUENCES,
  APE_QUALITY_GATE_ITEMS,
  INITIAL_PROJECT_RECORD,
  INITIAL_TRACEABILITY_MATRIX,
  INITIAL_DEFECT_LOG,
  VERIFICATION_LABELS,
  APE_MASTER_PROMPT_TEXT,
  ApeExecutionModeId,
  RecordFieldStatus,
  VerificationStatusLabel,
  ProjectRecordField,
  TraceabilityItem,
  DefectRecordItem,
  DefectSeverity,
} from '../data/apeOsData';

interface ApeOsWorkbenchProps {
  language: 'th' | 'en';
  onSendToStudio: (prompt: string, commands: string[]) => void;
}

export const ApeOsWorkbench: React.FC<ApeOsWorkbenchProps> = ({
  language,
  onSendToStudio,
}) => {
  const isThai = language === 'th';

  const [activeSubView, setActiveSubView] = useState<
    'router' | 'record' | 'gates' | 'templates'
  >('router');

  // 1. Router & Request Builder State
  const [selectedExecMode, setSelectedExecMode] = useState<ApeExecutionModeId>('STANDARD');
  const [selectedCommandGroup, setSelectedCommandGroup] = useState<
    'all' | 'core' | 'product-ux' | 'engineering' | 'verification'
  >('all');
  const [activePipelineCommands, setActivePipelineCommands] = useState<string[]>([
    '/auto',
    '/requirements',
    '/ui-design',
    '/qa',
  ]);
  const [showAllCommands, setShowAllCommands] = useState<boolean>(false);

  // Request Builder Fields
  const [reqGoal, setReqGoal] = useState<string>(
    'Design and verify an industrial engineering research & visual specification platform for NRRU.'
  );
  const [reqUsers, setReqUsers] = useState<string>(
    'Faculty researchers, industrial engineers, and product designers (Thai/English).'
  );
  const [reqTasks, setReqTasks] = useState<string>(
    'Synthesize 20-variable specs, autocomplete technical terminology, inspect 30-day analytics, and evaluate release gates.'
  );
  const [reqConstraints, setReqConstraints] = useState<string>(
    'WCAG 2.2 AA target, 60-30-10 color palette, server-side API key protection, honest verification labels.'
  );
  const [reqCriteria, setReqCriteria] = useState<string>(
    'Zero TypeScript/build errors, >=4.5:1 text contrast, explicit P0/P1 release gate evaluation.'
  );
  const [copiedRequest, setCopiedRequest] = useState<boolean>(false);

  // 2. Project Record & Traceability State
  const [projectRecord, setProjectRecord] = useState<ProjectRecordField[]>(INITIAL_PROJECT_RECORD);
  const [traceabilityList, setTraceabilityList] = useState<TraceabilityItem[]>(
    INITIAL_TRACEABILITY_MATRIX
  );
  const [defectLog, setDefectLog] = useState<DefectRecordItem[]>(INITIAL_DEFECT_LOG);

  // New Requirement Form State
  const [newReqText, setNewReqText] = useState<string>('');
  const [newAcText, setNewAcText] = useState<string>('');
  const [newArtifactText, setNewArtifactText] = useState<string>('');
  const [newReqPriority, setNewReqPriority] = useState<'P0' | 'P1' | 'P2'>('P1');

  // New Defect Form State
  const [newDefectArea, setNewDefectArea] = useState<string>('');
  const [newDefectSeverity, setNewDefectSeverity] = useState<DefectSeverity>('P2 Medium');
  const [newDefectEvidence, setNewDefectEvidence] = useState<string>('');

  // 3. 32-Item Quality Gates State
  const [gateScores, setGateScores] = useState<Record<number, 2 | 1 | 0 | 'NA'>>(() => {
    const initial: Record<number, 2 | 1 | 0 | 'NA'> = {};
    APE_QUALITY_GATE_ITEMS.forEach((item) => {
      initial[item.id] = item.defaultScore;
    });
    return initial;
  });
  const [selectedGateFilter, setSelectedGateFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'D' | 'E'>(
    'ALL'
  );
  const [copiedReleaseReport, setCopiedReleaseReport] = useState<boolean>(false);
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState<boolean>(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Filtered commands
  const filteredCommands = useMemo(() => {
    if (selectedCommandGroup === 'all') return APE_COMMANDS;
    return APE_COMMANDS.filter((c) => c.group === selectedCommandGroup);
  }, [selectedCommandGroup]);

  const visibleCommands = showAllCommands ? filteredCommands : filteredCommands.slice(0, 12);

  const togglePipelineCommand = (cmd: string) => {
    setActivePipelineCommands((prev) =>
      prev.includes(cmd) ? prev.filter((c) => c !== cmd) : [...prev, cmd]
    );
  };

  // Cycle Project Record Field Status
  const cycleRecordStatus = (id: string) => {
    const order: RecordFieldStatus[] = ['CONFIRMED', 'ASSUMED', 'PROPOSED', 'OPEN', 'BLOCKED'];
    setProjectRecord((prev) =>
      prev.map((field) => {
        if (field.id !== id) return field;
        const nextIdx = (order.indexOf(field.status) + 1) % order.length;
        return { ...field, status: order[nextIdx] };
      })
    );
  };

  // Cycle Traceability Verification Status
  const cycleVerificationStatus = (reqId: string) => {
    const order: VerificationStatusLabel[] = [
      'VERIFIED',
      'EXECUTED',
      'STATICALLY REVIEWED',
      'REASONED',
      'NOT CHECKED',
      'BLOCKED',
    ];
    setTraceabilityList((prev) =>
      prev.map((item) => {
        if (item.reqId !== reqId) return item;
        const nextIdx = (order.indexOf(item.verificationStatus) + 1) % order.length;
        return { ...item, verificationStatus: order[nextIdx] };
      })
    );
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqText.trim() || !newAcText.trim()) return;
    const nextNum = String(traceabilityList.length + 1).padStart(3, '0');
    const newItem: TraceabilityItem = {
      reqId: `REQ-${nextNum}`,
      requirement: newReqText.trim(),
      priority: newReqPriority,
      source: 'User',
      acId: `AC-${nextNum}`,
      acceptanceCriterion: newAcText.trim(),
      artifact: newArtifactText.trim() || 'Proposed Artifact',
      testId: `TEST-${nextNum}`,
      verificationMethod: 'Proposed Test Case',
      verificationStatus: 'NOT CHECKED',
    };
    setTraceabilityList([...traceabilityList, newItem]);
    setNewReqText('');
    setNewAcText('');
    setNewArtifactText('');
  };

  const handleAddDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDefectArea.trim()) return;
    const nextNum = String(defectLog.length + 1).padStart(3, '0');
    const newDefect: DefectRecordItem = {
      id: `DEF-${nextNum}`,
      severity: newDefectSeverity,
      status: 'OPEN',
      affectedArea: newDefectArea.trim(),
      evidence: newDefectEvidence.trim() || 'Reported during manual inspection',
      causeStatus: 'SUSPECTED',
      correction: 'Pending minimal safe fix (/fix)',
      regressionCheck: 'Pending retest (/test)',
      remainingRisk: 'Open until verified',
    };
    setDefectLog([newDefect, ...defectLog]);
    setNewDefectArea('');
    setNewDefectEvidence('');
  };

  const toggleDefectStatus = (id: string) => {
    const order: DefectRecordItem['status'][] = [
      'OPEN',
      'INVESTIGATING',
      'FIXED',
      'RETESTED',
      'ACCEPTED RISK',
    ];
    setDefectLog((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextIdx = (order.indexOf(d.status) + 1) % order.length;
        return { ...d, status: order[nextIdx] };
      })
    );
  };

  // Calculate 32-Item Gate Metrics
  const gateCalculation = useMemo(() => {
    let applicableItems = 0;
    let earnedPoints = 0;
    let failedCount = 0;
    let naCount = 0;

    APE_QUALITY_GATE_ITEMS.forEach((item) => {
      const score = gateScores[item.id];
      if (score === 'NA') {
        naCount += 1;
      } else {
        applicableItems += 1;
        earnedPoints += score;
        if (score === 0) failedCount += 1;
      }
    });

    const applicableMax = applicableItems * 2;
    const percentage = applicableMax > 0 ? Math.round((earnedPoints / applicableMax) * 100) : 0;

    const openP0Defects = defectLog.filter(
      (d) => d.severity === 'P0 Critical' && (d.status === 'OPEN' || d.status === 'INVESTIGATING')
    ).length;
    const openP1Defects = defectLog.filter(
      (d) => d.severity === 'P1 High' && (d.status === 'OPEN' || d.status === 'INVESTIGATING')
    ).length;

    let recommendation: 'RELEASE CANDIDATE' | 'REVISE' | 'BLOCKED' = 'RELEASE CANDIDATE';
    if (openP0Defects > 0 || failedCount > 0 || percentage < 80) {
      recommendation = 'BLOCKED';
    } else if (openP1Defects > 0 || percentage < 90) {
      recommendation = 'REVISE';
    }

    return {
      applicableItems,
      applicableMax,
      earnedPoints,
      naCount,
      failedCount,
      percentage,
      openP0Defects,
      openP1Defects,
      recommendation,
    };
  }, [gateScores, defectLog]);

  // Formatted Strong Request String
  const formattedRequestString = useMemo(() => {
    return `${activePipelineCommands.join(' ')} [Execution Mode: ${selectedExecMode}]
Goal: ${reqGoal}
Users and context: ${reqUsers}
Core tasks: ${reqTasks}
Platform and stack: React 19 + TypeScript + Tailwind CSS + Express + Firebase
Constraints: ${reqConstraints}
Acceptance criteria: ${reqCriteria}
Risk level: ${selectedExecMode}
What is already verified: TypeScript compilation (EXECUTED), static WCAG AA token audit (STATICALLY REVIEWED).`;
  }, [
    activePipelineCommands,
    selectedExecMode,
    reqGoal,
    reqUsers,
    reqTasks,
    reqConstraints,
    reqCriteria,
  ]);

  const handleCopyRequest = () => {
    navigator.clipboard.writeText(formattedRequestString);
    setCopiedRequest(true);
    setTimeout(() => setCopiedRequest(false), 2000);
  };

  const handleCopyReleaseReport = () => {
    const report = `Release / build: GEMINI VISUAL AI OS v5.1 + APE OS v2.0
Scope reviewed: Full-stack Workbench, UI/UX Pro Max Design System, 32-Item Release Gates
Environment: Vite + React 19 + TypeScript + Express
Evidence available: EXECUTED TypeScript build, STATICALLY REVIEWED WCAG 2.2 AA tokens & Firestore rules
Applicable QA items: ${gateCalculation.applicableItems} / 32 (${gateCalculation.naCount} N/A)
Earned points / applicable maximum: ${gateCalculation.earnedPoints} / ${gateCalculation.applicableMax}
Percentage: ${gateCalculation.percentage}%
P0 blockers: ${gateCalculation.openP0Defects}
P1 issues and disposition: ${gateCalculation.openP1Defects} open
Critical acceptance criteria: AC-001, AC-002, AC-003, AC-004 (VERIFIED / EXECUTED)
Migration and rollback: Non-destructive client/server updates; Git & Firestore snapshot rollback ready
Recommendation: ${gateCalculation.recommendation}`;
    navigator.clipboard.writeText(report);
    setCopiedReleaseReport(true);
    setTimeout(() => setCopiedReleaseReport(false), 2000);
  };

  const getStatusBadgeClasses = (status: RecordFieldStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
      case 'ASSUMED':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
      case 'PROPOSED':
        return 'bg-sky-950/70 text-sky-300 border-sky-500/40';
      case 'OPEN':
        return 'bg-slate-800 text-slate-200 border-slate-600';
      case 'BLOCKED':
        return 'bg-rose-950/70 text-rose-300 border-rose-500/40';
    }
  };

  const getVerificationBadgeClasses = (label: VerificationStatusLabel) => {
    switch (label) {
      case 'VERIFIED':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
      case 'EXECUTED':
        return 'bg-sky-950/70 text-sky-300 border-sky-500/40';
      case 'STATICALLY REVIEWED':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
      case 'REASONED':
      case 'NOT CHECKED':
        return 'bg-slate-800 text-slate-200 border-slate-700';
      case 'BLOCKED':
        return 'bg-rose-950/70 text-rose-300 border-rose-500/40';
    }
  };

  const filteredGateItems = useMemo(() => {
    if (selectedGateFilter === 'ALL') return APE_QUALITY_GATE_ITEMS;
    return APE_QUALITY_GATE_ITEMS.filter((i) => i.gate === selectedGateFilter);
  }, [selectedGateFilter]);

  return (
    <section aria-labelledby="ape-os-heading" className="space-y-6">
      {/* Top Overview Banner & Sub-View Navigation */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-xs font-bold">
                APE OS v2.0.0
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>{isThai ? 'สถาปัตยกรรมวิศวกรรมผลิตภัณฑ์ปรับตัวได้' : 'Adaptive Product Engineering OS'}</span>
              </span>
            </div>
            <h2 id="ape-os-heading" className="text-fluid-h2 font-display font-bold text-white">
              {isThai
                ? 'ระบบปฏิบัติการวิศวกรรมผลิตภัณฑ์และประตูคุณภาพ (APE OS v2.0 Workbench)'
                : 'Adaptive Product Engineering OS v2.0 Workbench'}
            </h2>
            <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
              {isThai
                ? 'เชื่อมโยงเป้าหมาย → ข้อกำหนด (REQ) → การออกแบบ/สถาปัตยกรรม → โค้ด → การทดสอบ (TEST) → การตัดสินใจปล่อยระบบ (Release Gate 32 ข้อ) พร้อมแยกแยะหลักฐานจริงออกจากสมมติฐานอย่างโปร่งใส'
                : 'Connect goals → requirements (REQ) → architecture/UI decisions → implementation artifacts → tests (TEST) → 32-item risk-based release decisions with honest verification labels.'}
            </p>
          </div>

          {/* Live Gate Readiness Summary Badge */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4 shrink-0">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                {isThai ? 'สถานะความพร้อมปล่อย (Release Gate)' : 'Release Gate Status'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {gateCalculation.recommendation === 'RELEASE CANDIDATE' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                ) : gateCalculation.recommendation === 'REVISE' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
                )}
                <span
                  className={`font-mono text-sm font-bold ${
                    gateCalculation.recommendation === 'RELEASE CANDIDATE'
                      ? 'text-emerald-300'
                      : gateCalculation.recommendation === 'REVISE'
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {gateCalculation.recommendation}
                </span>
              </div>
            </div>
            <div className="pl-4 border-l border-slate-800 text-right font-mono tabular-nums">
              <span className="text-2xl font-bold text-white">{gateCalculation.percentage}%</span>
              <span className="block text-xs text-slate-300">
                {gateCalculation.earnedPoints}/{gateCalculation.applicableMax} pts
              </span>
            </div>
          </div>
        </div>

        {/* 4-Tab Sub-Navigation */}
        <div
          role="tablist"
          aria-label={isThai ? 'โมดูลย่อยของ APE OS v2.0' : 'APE OS v2.0 Workbench Sub-views'}
          className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSubView === 'router'}
            onClick={() => setActiveSubView('router')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeSubView === 'router'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <span>
              {isThai
                ? '1. โหมดปรับตัวและระบบคำสั่ง (/auto & Commands)'
                : '1. Adaptive Router & Command System'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSubView === 'record'}
            onClick={() => setActiveSubView('record')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeSubView === 'record'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>
              {isThai
                ? '2. บันทึกโครงการและความเชื่อมโยง (Project Record & Traceability)'
                : '2. Project Record & Traceability'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSubView === 'gates'}
            onClick={() => setActiveSubView('gates')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeSubView === 'gates'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
            <span>
              {isThai
                ? '3. ประตูคุณภาพ 32 ข้อและการปล่อยระบบ (32-Item Quality Gates)'
                : '3. 32-Item Quality & Release Gates'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSubView === 'templates'}
            onClick={() => setActiveSubView('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeSubView === 'templates'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>
              {isThai
                ? '4. พรอมต์หลักและเทมเพลตมาตรฐาน (Master Prompt & Templates)'
                : '4. Master Prompt & Reusable Templates'}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SUB-VIEW 1: ADAPTIVE ROUTER & COMMAND SYSTEM
         ===================================================================== */}
      {activeSubView === 'router' && (
        <div className="space-y-6">
          {/* Adaptive Execution Policy Selector (QUICK / STANDARD / HIGH-ASSURANCE) */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-fluid-h3 font-display font-bold text-white">
                  {isThai
                    ? 'นโยบายการประมวลผลแบบปรับตัว (Adaptive Execution Policy)'
                    : 'Adaptive Execution Policy (QUICK / STANDARD / HIGH-ASSURANCE)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isThai
                    ? 'เลือกความลึกของเวิร์กโฟลว์ให้เหมาะสมกับความเสี่ยงและความซับซ้อนของงาน ไม่บังคับรันทุกขั้นตอนโดยไม่จำเป็น'
                    : 'Choose workflow depth proportionate to complexity, uncertainty, and impact.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {APE_EXECUTION_MODES.map((m) => {
                const isSelected = selectedExecMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedExecMode(m.id)}
                    className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected
                        ? 'bg-slate-950 border-amber-500 ring-1 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-200'
                          }`}
                        >
                          {m.id}
                        </span>
                        <span className="text-xs font-mono text-slate-300">{m.riskProfile}</span>
                      </div>
                      <h4 className="text-sm font-display font-bold text-white">
                        {isThai ? m.titleTh : m.titleEn}
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {isThai ? m.whenToUseTh : m.whenToUseEn}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                      {(isThai ? m.stepsTh : m.stepsEn).map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isSelected ? 'text-amber-400' : 'text-slate-400'
                            }`}
                            aria-hidden="true"
                          />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Command Sequences */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-fluid-h3 font-display font-bold text-white">
                {isThai
                  ? 'ลำดับคำสั่งแนะนำตามประเภทภารกิจ (Recommended Command Sequences)'
                  : 'Recommended Command Sequences'}
              </h3>
              <p className="text-xs text-slate-300">
                {isThai
                  ? 'คลิกเพื่อโหลดไปป์ไลน์คำสั่งและโหมดความเชื่อมั่นเข้าสู่เครื่องมือสร้างคำสั่งด้านล่าง'
                  : 'Click any sequence to load its command pipeline and execution mode.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {RECOMMENDED_COMMAND_SEQUENCES.map((seq) => (
                <button
                  key={seq.id}
                  type="button"
                  onClick={() => {
                    setSelectedExecMode(seq.mode);
                    setActivePipelineCommands(seq.commands);
                  }}
                  className="text-left p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors flex flex-col justify-between space-y-3 focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-display font-bold text-white">
                        {isThai ? seq.titleTh : seq.titleEn}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-amber-300 shrink-0">
                        {seq.mode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isThai ? seq.descTh : seq.descEn}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                    {seq.commands.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] border border-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Command Registry & Strong Request Builder */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: 38-Command Registry */}
            <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-fluid-h3 font-display font-bold text-white">
                    {isThai
                      ? 'คลังคำสั่งและการแบ่งหน้าที่ชัดเจน (Command Ownership Registry)'
                      : 'APE OS v2.0 Command Ownership Registry'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isThai
                      ? 'กฎเหล็ก: /audit วินิจฉัย, /qa ประเมินเกณฑ์, /fix แก้ไขโค้ด, /test รันทดสอบ, /release ตัดสินใจปล่อย'
                      : 'Rule: /audit diagnoses, /qa evaluates criteria, /fix changes code, /test runs/specifies tests, /release assesses readiness.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All' },
                    { id: 'core', labelTh: 'หลัก (Core)', labelEn: 'Core' },
                    { id: 'product-ux', labelTh: 'ผลิตภัณฑ์/UX', labelEn: 'Product & UX' },
                    { id: 'engineering', labelTh: 'วิศวกรรม', labelEn: 'Engineering' },
                    { id: 'verification', labelTh: 'ทวนสอบ/ปล่อย', labelEn: 'Verification' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={selectedCommandGroup === g.id}
                      onClick={() => setSelectedCommandGroup(g.id as any)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        selectedCommandGroup === g.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {isThai ? g.labelTh : g.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visibleCommands.map((item) => {
                  const isActive = activePipelineCommands.includes(item.command);
                  return (
                    <button
                      key={item.command}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => togglePipelineCommand(item.command)}
                      className={`text-left p-3.5 rounded-xl border transition-colors flex flex-col justify-between gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {item.command}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {item.ownerRole}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {isThai ? item.descTh : item.descEn}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-mono">
                        <span className="text-emerald-400 font-semibold">
                          {isThai ? 'ส่งมอบ: ' : 'Delivers: '}
                        </span>
                        {isThai ? item.deliversTh : item.deliversEn}
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredCommands.length > 12 && (
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    aria-expanded={showAllCommands}
                    onClick={() => setShowAllCommands(!showAllCommands)}
                    className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-amber-300 hover:text-white hover:border-amber-500/50 flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {showAllCommands ? (
                      <>
                        <ChevronUp className="w-4 h-4" aria-hidden="true" />
                        <span>{isThai ? 'ย่อรายการคำสั่ง' : 'Show fewer commands'}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {isThai
                            ? `แสดงคำสั่งทั้งหมด (${filteredCommands.length} คำสั่ง)`
                            : `Show all ${filteredCommands.length} commands`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Strong Request Template Builder */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-fluid-h3 font-display font-bold text-white">
                    {isThai
                      ? 'เครื่องมือสร้างคำสั่งมาตรฐาน (Strong Request Builder)'
                      : 'Strong Request Template Builder'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isThai
                      ? 'สร้างคำสั่งตามโครงสร้าง Part II.3 พร้อมส่งเข้าสู่ StudioConsole ทันที'
                      : 'Compose structured APE OS v2.0 requests and dispatch directly to StudioConsole.'}
                  </p>
                </div>

                {/* Active Command Pipeline */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300 font-semibold">
                      {isThai ? 'ไปป์ไลน์คำสั่งที่เลือก:' : 'Selected Command Pipeline:'}
                    </span>
                    <span className="font-mono text-amber-400 font-bold">{selectedExecMode}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activePipelineCommands.map((cmd) => (
                      <button
                        key={cmd}
                        type="button"
                        onClick={() => togglePipelineCommand(cmd)}
                        aria-label={`Remove ${cmd}`}
                        className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-1 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                      >
                        <span>{cmd}</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label
                      htmlFor="ape-req-goal"
                      className="block font-semibold text-slate-200 mb-1"
                    >
                      {isThai ? 'เป้าหมายหลัก (Goal):' : 'Goal:'}
                    </label>
                    <input
                      id="ape-req-goal"
                      type="text"
                      value={reqGoal}
                      onChange={(e) => setReqGoal(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ape-req-users"
                      className="block font-semibold text-slate-200 mb-1"
                    >
                      {isThai ? 'ผู้ใช้และบริบท (Users & Context):' : 'Users & Context:'}
                    </label>
                    <input
                      id="ape-req-users"
                      type="text"
                      value={reqUsers}
                      onChange={(e) => setReqUsers(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ape-req-tasks"
                      className="block font-semibold text-slate-200 mb-1"
                    >
                      {isThai ? 'ภารกิจหลัก (Core Tasks):' : 'Core Tasks:'}
                    </label>
                    <textarea
                      id="ape-req-tasks"
                      rows={2}
                      value={reqTasks}
                      onChange={(e) => setReqTasks(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ape-req-constraints"
                      className="block font-semibold text-slate-200 mb-1"
                    >
                      {isThai ? 'ข้อจำกัด (Constraints):' : 'Constraints:'}
                    </label>
                    <input
                      id="ape-req-constraints"
                      type="text"
                      value={reqConstraints}
                      onChange={(e) => setReqConstraints(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ape-req-criteria"
                      className="block font-semibold text-slate-200 mb-1"
                    >
                      {isThai ? 'เกณฑ์การยอมรับ (Acceptance Criteria):' : 'Acceptance Criteria:'}
                    </label>
                    <input
                      id="ape-req-criteria"
                      type="text"
                      value={reqCriteria}
                      onChange={(e) => setReqCriteria(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preview & Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                  {formattedRequestString}
                </pre>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyRequest}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {copiedRequest ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        <span>{isThai ? 'คัดลอกแล้ว' : 'Copied Request'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        <span>{isThai ? 'คัดลอกคำสั่ง APE OS' : 'Copy APE Request'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendToStudio(reqGoal, activePipelineCommands)}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <span>{isThai ? 'ส่งเข้าสู่สตูดิโอ' : 'Send to StudioConsole'}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 2: PROJECT RECORD & TRACEABILITY MATRIX
         ===================================================================== */}
      {activeSubView === 'record' && (
        <div className="space-y-6">
          {/* Evidence-Aware Verification Labels Legend */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              {isThai
                ? 'ป้ายสถานะการทวนสอบตามหลักฐานจริง (Rule 17: Evidence-Aware Verification Labels)'
                : 'Rule 17 — Exact Evidence-Aware Verification Labels'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {VERIFICATION_LABELS.map((v) => (
                <div
                  key={v.label}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5"
                >
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border shrink-0 ${getVerificationBadgeClasses(
                      v.label
                    )}`}
                  >
                    {v.label}
                  </span>
                  <span className="text-xs text-slate-200 leading-snug">
                    {isThai ? v.descTh : v.descEn}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Authoritative Project Record */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-fluid-h3 font-display font-bold text-white">
                  {isThai
                    ? 'บันทึกโครงการแหล่งอ้างอิงเดียว (Project Record — Single Source of Truth)'
                    : 'Project Record — Single Source of Truth'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isThai
                    ? 'คลิกที่ป้ายสถานะ (CONFIRMED / ASSUMED / PROPOSED / OPEN / BLOCKED) เพื่อสลับสถานะตามข้อเท็จจริง'
                    : 'Click any epistemic status badge (CONFIRMED / ASSUMED / PROPOSED / OPEN / BLOCKED) to update its state.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectRecord.map((field) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-display font-bold text-amber-400">
                      {isThai ? field.labelTh : field.labelEn}
                    </span>
                    <button
                      type="button"
                      onClick={() => cycleRecordStatus(field.id)}
                      aria-label={`Change status for ${field.labelEn}, currently ${field.status}`}
                      className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${getStatusBadgeClasses(
                        field.status
                      )}`}
                    >
                      {field.status}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed break-words">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements & Traceability Matrix (REQ -> AC -> Artifact -> TEST) */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-fluid-h3 font-display font-bold text-white">
                {isThai
                  ? 'ตารางความเชื่อมโยงย้อนกลับ (Requirements & Traceability Matrix: REQ → AC → Artifact → TEST)'
                  : 'Requirements & Traceability Matrix (REQ → AC → Artifact → TEST)'}
              </h3>
              <p className="text-xs text-slate-300">
                {isThai
                  ? 'เชื่อมโยงทุกข้อกำหนดเข้ากับเกณฑ์การยอมรับที่สังเกตผลได้ ไฟล์โค้ด และสถานะการทวนสอบจริง'
                  : 'Every requirement maps to an observable acceptance criterion, implementation artifact, and honest verification status.'}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-mono">
                    <th className="py-3 px-4">ID / Priority</th>
                    <th className="py-3 px-4">Requirement & Source</th>
                    <th className="py-3 px-4">Observable Acceptance Criterion (AC)</th>
                    <th className="py-3 px-4">Connected Artifact</th>
                    <th className="py-3 px-4">Test & Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {traceabilityList.map((item) => (
                    <tr key={item.reqId} className="hover:bg-slate-900/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono align-top whitespace-nowrap">
                        <span className="font-bold text-amber-400 block">{item.reqId}</span>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                          {item.priority} • {item.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-white font-medium align-top max-w-xs break-words">
                        {item.requirement}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 align-top max-w-sm break-words">
                        <span className="font-mono text-sky-400 font-bold mr-1.5">
                          [{item.acId}]
                        </span>
                        {item.acceptanceCriterion}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 align-top break-words max-w-[200px]">
                        {item.artifact}
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1.5">
                          <span className="font-mono text-slate-300 block">
                            {item.testId}: {item.verificationMethod}
                          </span>
                          <button
                            type="button"
                            onClick={() => cycleVerificationStatus(item.reqId)}
                            className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${getVerificationBadgeClasses(
                              item.verificationStatus
                            )}`}
                          >
                            {item.verificationStatus}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Traceable Requirement Form */}
            <form
              onSubmit={handleAddRequirement}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
            >
              <div className="md:col-span-3">
                <label
                  htmlFor="new-req-text"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'ข้อกำหนดใหม่ (Requirement):' : 'New Requirement:'}
                </label>
                <input
                  id="new-req-text"
                  type="text"
                  value={newReqText}
                  onChange={(e) => setNewReqText(e.target.value)}
                  placeholder={isThai ? 'เช่น รองรับการส่งออกรายงาน PDF' : 'e.g. Export APA report'}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="md:col-span-4">
                <label
                  htmlFor="new-ac-text"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'เกณฑ์การยอมรับ (Acceptance Criterion):' : 'Observable Acceptance Criterion:'}
                </label>
                <input
                  id="new-ac-text"
                  type="text"
                  value={newAcText}
                  onChange={(e) => setNewAcText(e.target.value)}
                  placeholder={
                    isThai ? 'ผลลัพธ์ที่สังเกตและทดสอบได้...' : 'Observable testable outcome...'
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="new-artifact-text"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'ไฟล์/คอมโพเนนต์:' : 'Artifact:'}
                </label>
                <input
                  id="new-artifact-text"
                  type="text"
                  value={newArtifactText}
                  onChange={(e) => setNewArtifactText(e.target.value)}
                  placeholder="src/components/..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="new-req-priority"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'ความสำคัญ:' : 'Priority:'}
                </label>
                <select
                  id="new-req-priority"
                  value={newReqPriority}
                  onChange={(e) => setNewReqPriority(e.target.value as any)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>{isThai ? 'เพิ่ม REQ' : 'Add REQ'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 9: Change & Defect Management Log */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-fluid-h3 font-display font-bold text-white">
                {isThai
                  ? 'บันทึกข้อบกพร่องและการควบคุมผลกระทบ (Defect & Change-Impact Log)'
                  : 'Section 9 — Change & Defect Management Log'}
              </h3>
              <p className="text-xs text-slate-300">
                {isThai
                  ? 'แยกแยะสาเหตุที่ยืนยันแล้ว (CONFIRMED) ออกจากสาเหตุที่สงสัย (SUSPECTED) หากมี P0 สถานะ OPEN ระบบจะบล็อกการปล่อยทันที'
                  : 'Never present a suspected cause as confirmed. Any OPEN P0 Critical defect automatically blocks release.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defectLog.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{d.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                          d.severity === 'P0 Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                            : d.severity === 'P1 High'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {d.severity}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDefectStatus(d.id)}
                      className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        d.status === 'FIXED' || d.status === 'RETESTED'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-950/70 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {d.status}
                    </button>
                  </div>

                  <h4 className="text-sm font-display font-bold text-white">{d.affectedArea}</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-slate-300">Evidence:</strong> {d.evidence}
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-emerald-400">Correction ({d.causeStatus}):</strong>{' '}
                    {d.correction}
                  </p>
                  <p className="text-[11px] font-mono text-slate-300 pt-1 border-t border-slate-800/80">
                    Regression Check: {d.regressionCheck}
                  </p>
                </div>
              ))}
            </div>

            {/* Log New Defect Form */}
            <form
              onSubmit={handleAddDefect}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
            >
              <div className="md:col-span-4">
                <label
                  htmlFor="defect-area"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'พื้นที่ที่ได้รับผลกระทบ (Affected Area):' : 'Affected Area & Requirement:'}
                </label>
                <input
                  id="defect-area"
                  type="text"
                  value={newDefectArea}
                  onChange={(e) => setNewDefectArea(e.target.value)}
                  placeholder={isThai ? 'ระบุคอมโพเนนต์หรือ REQ...' : 'Component or REQ ID...'}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="md:col-span-4">
                <label
                  htmlFor="defect-evidence"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'หลักฐานและขั้นตอนการทำซ้ำ (Evidence):' : 'Evidence & Reproduction:'}
                </label>
                <input
                  id="defect-evidence"
                  type="text"
                  value={newDefectEvidence}
                  onChange={(e) => setNewDefectEvidence(e.target.value)}
                  placeholder={isThai ? 'อธิบายอาการที่พบ...' : 'Observed behavior...'}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="defect-severity"
                  className="block text-xs font-semibold text-slate-200 mb-1"
                >
                  {isThai ? 'ระดับความรุนแรง:' : 'Severity:'}
                </label>
                <select
                  id="defect-severity"
                  value={newDefectSeverity}
                  onChange={(e) => setNewDefectSeverity(e.target.value as DefectSeverity)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="P0 Critical">P0 Critical</option>
                  <option value="P1 High">P1 High</option>
                  <option value="P2 Medium">P2 Medium</option>
                  <option value="P3 Low">P3 Low</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Plus className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  <span>{isThai ? 'บันทึก DEF' : 'Log Defect'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 3: 32-ITEM QUALITY & RELEASE GATES (GATES A–E)
         ===================================================================== */}
      {activeSubView === 'gates' && (
        <div className="space-y-6">
          {/* Scorecard Summary Header */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-fluid-h3 font-display font-bold text-white">
                  {isThai
                    ? 'การประเมินประตูคุณภาพและการปล่อยระบบ 32 ข้อ (Section 8: Quality & Release Gates A–E)'
                    : 'Section 8 — 32-Item Risk-Based Quality & Release Gates (Gates A–E)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isThai
                    ? 'เกณฑ์การให้คะแนน: 2 = มีหลักฐานรองรับและผ่าน | 1 = ผ่านบางส่วนหรือยังไม่ทวนสอบ | 0 = ไม่ผ่าน | N/A = ไม่เกี่ยวข้อง (ห้ามนับสิ่งที่ยังไม่รู้ว่าผ่าน)'
                    : 'Scoring: 2 = Supported by evidence & passes | 1 = Partial or unverified | 0 = Fails/missing | N/A = Not applicable. Never count unknowns as passes.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReleaseReport}
                  className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  {copiedReleaseReport ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>{isThai ? 'คัดลอกใบประเมินแล้ว' : 'Copied Release Assessment'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isThai ? 'คัดลอกรายงาน Release Assessment' : 'Copy Release Assessment'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4 KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 block">
                  {isThai ? 'คะแนนที่ได้ / คะแนนเต็มที่เกี่ยวข้อง' : 'Earned / Applicable Max'}
                </span>
                <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">
                  {gateCalculation.earnedPoints} / {gateCalculation.applicableMax}
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {gateCalculation.applicableItems} applicable ({gateCalculation.naCount} N/A)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 block">
                  {isThai ? 'เปอร์เซ็นต์ความสอดคล้อง' : 'Gate Score Percentage'}
                </span>
                <div className="text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
                  {gateCalculation.percentage}%
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {gateCalculation.percentage >= 90
                    ? '90–100% Candidate Threshold'
                    : gateCalculation.percentage >= 80
                    ? '80–89% Revise Gaps'
                    : '<80% Do Not Release'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 block">
                  {isThai ? 'ตัวบล็อกวิกฤต (P0 / Gate Failures)' : 'Critical Blockers (P0 / Score 0)'}
                </span>
                <div
                  className={`text-2xl font-mono font-bold mt-1 tabular-nums ${
                    gateCalculation.openP0Defects + gateCalculation.failedCount > 0
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {gateCalculation.openP0Defects + gateCalculation.failedCount}
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {gateCalculation.openP0Defects} open P0 • {gateCalculation.failedCount} failed gates
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 block">
                  {isThai ? 'ข้อเสนอแนะการปล่อยระบบ' : 'Release Recommendation'}
                </span>
                <div
                  className={`text-lg font-mono font-bold mt-1 flex items-center gap-1.5 ${
                    gateCalculation.recommendation === 'RELEASE CANDIDATE'
                      ? 'text-emerald-300'
                      : gateCalculation.recommendation === 'REVISE'
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {gateCalculation.recommendation === 'RELEASE CANDIDATE' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                  ) : gateCalculation.recommendation === 'REVISE' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
                  )}
                  <span>{gateCalculation.recommendation}</span>
                </div>
                <span className="text-xs font-mono text-slate-300">
                  Score never overrides a P0 blocker
                </span>
              </div>
            </div>

            {/* Gate Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {[
                { id: 'ALL', label: isThai ? 'ทั้งหมด (32 ข้อ)' : 'All Gates (32)' },
                { id: 'A', label: 'Gate A: Product Fit (1–6)' },
                { id: 'B', label: 'Gate B: UX & Design (7–14)' },
                { id: 'C', label: 'Gate C: Engineering & Data (15–20)' },
                { id: 'D', label: 'Gate D: Security & Privacy (21–26)' },
                { id: 'E', label: 'Gate E: Verification & Delivery (27–32)' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={selectedGateFilter === g.id}
                  onClick={() => setSelectedGateFilter(g.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    selectedGateFilter === g.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 32-Item Interactive Evaluation List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredGateItems.map((item) => {
              const currentScore = gateScores[item.id];
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        #{String(item.id).padStart(2, '0')} •{' '}
                        {isThai ? item.gateNameTh : item.gateNameEn}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${getVerificationBadgeClasses(
                          item.verificationLabel
                        )}`}
                      >
                        {item.verificationLabel}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {isThai ? item.statementTh : item.statementEn}
                    </h4>

                    <p className="text-xs text-slate-300 font-mono">
                      Evidence: {item.evidenceNote}
                    </p>
                  </div>

                  {/* Score Selector (2 / 1 / 0 / N/A) */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
                    <span className="text-xs text-slate-300 font-mono">
                      {isThai ? 'ให้คะแนนหลักฐาน:' : 'Gate Score:'}
                    </span>
                    <div
                      role="group"
                      aria-label={`Score for item ${item.id}`}
                      className="flex items-center gap-1"
                    >
                      {([2, 1, 0, 'NA'] as const).map((val) => {
                        const isSelected = currentScore === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              setGateScores((prev) => ({ ...prev, [item.id]: val }))
                            }
                            className={`px-2.5 py-1 rounded font-mono text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                              isSelected
                                ? val === 2
                                  ? 'bg-emerald-500 text-slate-950'
                                  : val === 1
                                  ? 'bg-amber-500 text-slate-950'
                                  : val === 0
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-700 text-white'
                                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                            }`}
                          >
                            {val === 'NA' ? 'N/A' : `${val} pt`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 4: MASTER SYSTEM PROMPT v2.0 & REUSABLE TEMPLATES
         ===================================================================== */}
      {activeSubView === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Master System Prompt v2.0 */}
          <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-fluid-h3 font-display font-bold text-white">
                  {isThai
                    ? 'Part I — พรอมต์ระบบหลัก (Master System Prompt v2.0)'
                    : 'Part I — Master System Prompt (APE OS v2.0)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isThai
                    ? 'คัดลอกบล็อกนี้ไปวางใน Project Instructions หรือข้อความแรกของโปรเจกต์'
                    : 'Copy into Gemini project instructions or use as the initial system message.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(APE_MASTER_PROMPT_TEXT);
                  setCopiedMasterPrompt(true);
                  setTimeout(() => setCopiedMasterPrompt(false), 2000);
                }}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                {copiedMasterPrompt ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{isThai ? 'คัดลอกพรอมต์หลักแล้ว' : 'Copied Master Prompt'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>{isThai ? 'คัดลอก Master Prompt' : 'Copy Master Prompt'}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap break-words leading-relaxed max-h-[540px] overflow-y-auto">
              {APE_MASTER_PROMPT_TEXT}
            </pre>
          </div>

          {/* Right 5 Cols: Part III Reusable Engineering Templates & Part IV Limitations */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-fluid-h3 font-display font-bold text-white">
                {isThai
                  ? 'Part III — เทมเพลตวิศวกรรมที่ใช้ซ้ำได้ (Reusable Templates)'
                  : 'Part III — Reusable Engineering Templates'}
              </h3>

              {[
                {
                  id: 'tpl-record',
                  title: 'A. Project Record Template',
                  content: `Project:\nProblem / intended outcome:\nUsers and context:\nGoals / success measures:\nCore tasks:\nScope:\nNon-goals:\nRequirements:\nPlatform / stack:\nSecurity / privacy / accessibility:\nConfirmed decisions:\nAssumptions:\nOpen questions:\nRisks:\nAcceptance criteria:\nVerification evidence:\nOpen defects:\nStatus:\nNext action:`,
                },
                {
                  id: 'tpl-ac',
                  title: 'B. Acceptance Criterion (AC-001)',
                  content: `ID: AC-001\nRequirement: REQ-001\nPriority: P0 / P1 / P2\nSource: User / Policy / Constraint / Assumption\nPreconditions:\nAction:\nExpected observable result:\nFailure/recovery behavior:\nVerification method:\nRelated artifact:\nStatus: PROPOSED / NOT RUN / PASS / FAIL / BLOCKED\nEvidence:`,
                },
                {
                  id: 'tpl-test',
                  title: 'C. Test Case (TEST-001)',
                  content: `Test ID: TEST-001\nRequirement / acceptance criterion:\nTest level: unit / integration / e2e / accessibility / security / manual\nEnvironment and version:\nPreconditions and test data:\nSteps:\nExpected result:\nActual result:\nEvidence:\nStatus: NOT RUN / PASS / FAIL / BLOCKED\nKnown limitations:`,
                },
                {
                  id: 'tpl-defect',
                  title: 'D. Defect Record (DEF-001)',
                  content: `ID: DEF-001\nSeverity: P0 / P1 / P2 / P3\nStatus: OPEN / INVESTIGATING / FIXED / RETESTED / ACCEPTED RISK\nAffected requirement / component:\nEvidence:\nReproduction steps:\nImpact:\nCause: CONFIRMED / SUSPECTED / UNKNOWN\nCorrection:\nRegression checks:\nRetest evidence:\nRemaining risk:`,
                },
              ].map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-mono font-bold text-amber-400">{tpl.title}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(tpl.content);
                        setCopiedTemplateId(tpl.id);
                        setTimeout(() => setCopiedTemplateId(null), 2000);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      {copiedTemplateId === tpl.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap break-words">
                    {tpl.content}
                  </pre>
                </div>
              ))}
            </div>

            {/* Part IV: Known Limitations */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span>
                  {isThai
                    ? 'Part IV — ขอบเขตความสามารถและข้อจำกัดที่ทราบ (Known Limitations)'
                    : 'Part IV — Capability Boundaries & Known Limitations'}
                </span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-200 list-disc pl-4 leading-relaxed">
                <li>
                  {isThai
                    ? 'แผนการทดสอบที่เขียนขึ้นไม่ใช่การรันทดสอบจริง และการวิเคราะห์โค้ดแบบ Static ไม่ใช่การยืนยันขณะรันจริง'
                    : 'A written test plan is not an executed test; static reasoning is not runtime verification.'}
                </li>
                <li>
                  {isThai
                    ? 'คะแนนรายการตรวจสอบไม่ใช่ใบรับรองความปลอดภัยหรือการปฏิบัติตามกฎหมาย ผลิตภัณฑ์ความเสี่ยงสูงต้องผ่านผู้เชี่ยวชาญเฉพาะทาง'
                    : 'A checklist score is not certification; high-risk or regulated products require qualified domain and security review.'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
