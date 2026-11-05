/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNavigation } from './components/TopNavigation';
import { AuthBar } from './components/AuthBar';
import { StudioConsole } from './components/StudioConsole';
import { AutoModesExplorer } from './components/AutoModesExplorer';
import { CommandDictionary } from './components/CommandDictionary';
import { QAInspector } from './components/QAInspector';
import { ResearchProjects } from './components/ResearchProjects';
import { SeriesLockModal, SeriesLockState } from './components/SeriesLockModal';
import { HistoryPanel } from './components/HistoryPanel';
import { ApeOsWorkbench } from './components/ApeOsWorkbench';
import { AutoMode, ResearchPreset } from './data/visualOsData';
import { 
  User, 
  GenerationRecord, 
  loadUserHistory, 
  saveGenerationLog, 
  deleteGenerationLog,
  updateGenerationLog,
  bulkUpdateGenerationLogs
} from './lib/firebase';
import { Sparkles, Terminal, ShieldCheck, Layers, BookOpen, GraduationCap, GitBranch } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'modes' | 'commands' | 'qa' | 'research' | 'series' | 'ape'>('studio');
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [activeCommands, setActiveCommands] = useState<string[]>([
    '/technical-drawing',
    '/isometric',
    '/academic',
    '/16:9',
  ]);
  const [selectedMode, setSelectedMode] = useState<string>('/AUTO-ENGINEERING');
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Generation History State
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [activeHistoryRecord, setActiveHistoryRecord] = useState<GenerationRecord | null>(null);

  const [seriesLock, setSeriesLock] = useState<SeriesLockState>({
    enabled: true,
    style: 'Precision Engineering Vector Blueprint & Studio Lighting',
    palette: 'Industrial Steel Slate, Cobalt Cyan, Amber Accent',
    cameraLanguage: '30-degree isometric axonometric perspective',
    lensLanguage: '50mm standard focal clarity',
    lightingLanguage: 'Diffused studio softbox with rim highlight',
    materialLanguage: 'Powder-coated steel 304, acrylic transparent shields',
    typography: 'Sarabun / Plus Jakarta Sans ISO standard callouts',
    backgroundLogic: 'Obsidian neutral slate with subtle blueprint grid',
    subjectProportions: '1:1 physically plausible mechanism scale',
    brandElements: 'NRRU Faculty of Industrial Technology seal',
  });

  const isThai = language === 'th';

  // Load history on mount or auth change
  useEffect(() => {
    async function fetchHistory() {
      const records = await loadUserHistory(currentUser?.uid);
      if (records.length === 0) {
        // Seed default initial case study logs for immediate comparison
        const defaultRecordA: GenerationRecord = {
          id: 'gen_nrru_rice_001',
          userId: currentUser?.uid || 'nrru_guest',
          userEmail: currentUser?.email || 'thitiwas.k@nrru.ac.th',
          prompt: 'เครื่องคัดแยกเมล็ดข้าวเปลือกด้วยระบบตะแกรงสั่นและการคัดแยกความหนาแน่น พร้อมช่องจ่ายเมล็ดพันธุ์ข้าวคุณภาพสูง (แบบวิศวกรรม)',
          mode: '/AUTO-ENGINEERING',
          commands: ['/technical-drawing', '/isometric', '/academic', '/blueprint', '/16:9'],
          responseMode: 'PRO',
          finalOptimizedPrompt: 'Automated agricultural paddy rice grain sorting machine mechanism, mechanical vibratory sieve trays, precision hopper, transparent cutaway view showing engineering assembly, clean studio lighting, realistic industrial prototype, 8k resolution, isometric technical drawing',
          threePassPrompt: {
            pass1Intent: 'Communicate the mechanical sorting flow of paddy rice grain separator with zero distortion.',
            pass2Visualization: 'Vibratory multi-deck sieve trays, grain feed hopper, electric motor with eccentric cam, and separated grain discharge chutes in an exploded 30-degree axonometric isometric view.',
            pass3Control: 'Precision technical blueprint rendering, sharp vector line edges, neutral studio lighting, ISO dimensional markers, academic publication grade, 8k crisp details.',
            finalOptimizedPrompt: 'Automated agricultural paddy rice grain sorting machine mechanism, mechanical vibratory sieve trays, precision hopper, transparent cutaway view showing engineering assembly, clean studio lighting, realistic industrial prototype, 8k resolution, isometric technical drawing',
            negativePrompt: 'blurry, distorted geometry, floating artifacts, illegible text, watermark, oversaturated neon, fake empirical data',
          },
          visualSpecification: {
            intent: 'สร้างสรรค์ภาพจำลองแบบทางวิศวกรรมของเครื่องคัดแยกเมล็ดข้าวเปลือก',
            subject: 'เครื่องคัดแยกเมล็ดข้าวเปลือกอัตโนมัติ (Automated Paddy Rice Separator)',
            purposeAudience: 'Engineering workshop, fabrication team and patent documentation',
            composition: '/grid-composition',
            camera: '/eye-level',
            lens: '/lens-50mm',
            perspective: '/isometric',
            lighting: '/studio-light',
            color: 'Industrial Slate, Steel Gray, Safety Amber',
            material: 'Industrial stainless steel alloy 304, transparent acrylic viewing panels',
            environment: 'Precision agricultural machinery testing laboratory',
            style: '/technical-drawing',
            mood: 'Accurate, functional, rigorously structured',
            depth: 'Deep depth of field f/16, all mechanical trays clearly delineated',
            aspectRatio: '16:9',
          },
          qaStatus: 'PASS',
          qaSummary: 'ผ่านเกณฑ์มาตรฐาน 50-Point Visual QA โดยไม่มีข้อผิดพลาดเชิงโครงสร้าง',
          qaChecks: [
            { id: '01', point: 'Subject identity is unambiguous', status: 'PASS', note: 'Subject matches intent directly' },
            { id: '06', point: 'Perspective is coherent', status: 'PASS', note: 'Isometric 30-degree projection holds true' },
            { id: '24', point: 'Geometry is coherent', status: 'PASS', note: 'Rigid mechanical alignment' },
            { id: '30', point: 'Technical components connect logically', status: 'PASS', note: 'Drive motor logically coupled' },
            { id: '44', point: 'No false claim of empirical evidence', status: 'PASS', note: 'Marked as illustrative model' },
          ],
          researchFigure: {
            isResearchActive: true,
            figureType: 'F2 Conceptual & Technical Prototype Figure',
            title: 'Figure 1. Kinematic structure of the paddy rice separator',
            apaCaption: 'Figure 1. Mechanical kinematic structure and 3D exploded configuration of the automated paddy rice separator. NRRU Industrial Technology.',
            empiricalBoundary: 'Design proposal & illustrative schema only. Not empirical lab trial data.',
          },
          technicalDrawing: {
            isTechnicalActive: true,
            viewsSelected: ['Isometric View', 'Front Elevation', 'Exploded Assembly'],
            dimensionStatus: 'PROPOSED',
          },
          imageUrl: '/src/assets/images/sample_rice_separator_1790215816022.jpg',
          aspectRatio: '16:9',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          timestamp: Date.now() - 7200000,
          tags: ['AgriculturalEng', 'KinematicDesign', 'NRRU_Lab', 'Blueprint'],
          notes: 'First prototype drawing for vibratory sieve separator. Verified kinematic assembly alignment with ISO standard callouts.',
          isFavorite: true,
        };

        const defaultRecordB: GenerationRecord = {
          id: 'gen_nrru_rice_002',
          userId: currentUser?.uid || 'nrru_guest',
          userEmail: currentUser?.email || 'thitiwas.k@nrru.ac.th',
          prompt: 'เครื่องคัดแยกเมล็ดข้าวเปลือกอัตโนมัติ ถ่ายภาพสตูดิโอความละเอียดสูง ขับเน้นงานโลหะสแตนเลสและนวัตกรรมการคัดแยกเชิงพาณิชย์',
          mode: '/AUTO-PRODUCT',
          commands: ['/product-hero', '/studio-light', '/macro-lens', '/luxury', '/4:5'],
          responseMode: 'SMART',
          finalOptimizedPrompt: 'Industrial prototype commercial agricultural paddy rice grading machine, brushed titanium and stainless steel casing, warm ambient studio lighting with subtle rim light, 50mm portrait lens, ultra high definition showcase',
          threePassPrompt: {
            pass1Intent: 'Showcase commercial market-ready prototype of paddy rice separator with premium industrial aesthetics.',
            pass2Visualization: 'Sleek stainless steel chassis, illuminated digital vibration controller panel, polished grain discharge trays with golden rice grains.',
            pass3Control: 'Commercial hero studio lighting, warm specular reflection, 85mm prime lens f/2.8, shallow depth of field, 8k catalog publication quality.',
            finalOptimizedPrompt: 'Industrial prototype commercial agricultural paddy rice grading machine, brushed titanium and stainless steel casing, warm ambient studio lighting with subtle rim light, 50mm portrait lens, ultra high definition showcase',
            negativePrompt: 'harsh shadows, low resolution, fingerprint smudges, messy wiring, cluttered background',
          },
          visualSpecification: {
            intent: 'สร้างสรรค์ภาพถ่ายเชิงพาณิชย์และแคตตาล็อกสำหรับต้นแบบอุตสาหกรรม',
            subject: 'ต้นแบบเครื่องคัดแยกเมล็ดข้าวเปลือกระดับอุตสาหกรรม (Commercial Agricultural Sorter)',
            purposeAudience: 'Commercial agriculture expo, commercial investors and marketing catalog',
            composition: '/rule-of-thirds',
            camera: '/eye-level',
            lens: '/lens-85mm',
            perspective: '/three-quarter-view',
            lighting: '/rim-light',
            color: 'Polished Silver, Charcoal Black, Warm Gold',
            material: 'Brushed stainless steel 316, anodized aluminum accents',
            environment: 'Minimalist industrial exhibition studio with dark gradient floor',
            style: '/commercial-photography',
            mood: 'Sophisticated, innovative, reliable',
            depth: 'Shallow depth of field f/2.8 with beautiful background bokeh',
            aspectRatio: '4:5',
          },
          qaStatus: 'PASS WITH FLAGS',
          qaSummary: 'ผ่านเกณฑ์ทั่วไป แต่มีหมายเหตุเกี่ยวกับมิติเพื่อการค้าที่ไม่ระบุพิกัดชิ้นส่วน (Non-engineering visual)',
          qaChecks: [
            { id: '01', point: 'Subject identity is unambiguous', status: 'PASS', note: 'Product is prominently centered' },
            { id: '06', point: 'Perspective is coherent', status: 'PASS', note: 'Three-quarter angle is natural' },
            { id: '24', point: 'Geometry is coherent', status: 'PASS', note: 'Curvatures and bevels are clean' },
            { id: '30', point: 'Technical components connect logically', status: 'FLAG', note: 'Internal motor hidden behind commercial enclosure' },
            { id: '44', point: 'No false claim of empirical evidence', status: 'PASS', note: 'Design prototype rendering only' },
          ],
          researchFigure: {
            isResearchActive: false,
            figureType: 'F4 Illustrative & Exhibition Figure',
            title: 'Exhibition Prototype Rendering',
            apaCaption: 'Figure 2. Commercial exhibition rendering of the rice grain sorting machine. NRRU Design Innovation.',
            empiricalBoundary: 'Marketing and industrial aesthetic concept render.',
          },
          technicalDrawing: {
            isTechnicalActive: false,
            viewsSelected: ['Three-Quarter Perspective'],
            dimensionStatus: 'UNKNOWN',
          },
          imageUrl: '/src/assets/images/sample_rice_separator_1790215816022.jpg',
          aspectRatio: '4:5',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          timestamp: Date.now() - 1800000,
          tags: ['CommercialProduct', 'Exhibition', 'IndustrialDesign'],
          notes: 'Rendered for 2026 NRRU Innovation Exhibition catalog. Studio hero lighting with titanium casing.',
          isFavorite: false,
        };

        setHistory([defaultRecordB, defaultRecordA]);
        saveGenerationLog(defaultRecordA);
        saveGenerationLog(defaultRecordB);
      } else {
        setHistory(records);
      }
    }
    fetchHistory();
  }, [currentUser]);

  const handleSaveHistory = (record: GenerationRecord) => {
    const updatedRecord: GenerationRecord = {
      ...record,
      userId: currentUser?.uid || '',
      userEmail: currentUser?.email || 'thitiwas.k@nrru.ac.th',
    };
    saveGenerationLog(updatedRecord);
    setHistory((prev) => [updatedRecord, ...prev.filter((r) => r.id !== updatedRecord.id)]);
  };

  const handleRevertHistory = (record: GenerationRecord) => {
    setActiveHistoryRecord(record);
    setSelectedMode(record.mode);
    setActiveCommands(record.commands || []);
    setActiveTab('studio');
  };

  const handleDuplicateToStudio = (prompt: string, record: GenerationRecord) => {
    setActiveHistoryRecord({
      ...record,
      prompt,
    });
    setSelectedMode(record.mode);
    setActiveCommands(record.commands || []);
    setActiveTab('studio');
    setIsHistoryOpen(false);
  };

  const handleToggleFavorite = async (id: string) => {
    const target = history.find((r) => r.id === id);
    if (!target) return;
    const newStatus = !target.isFavorite;
    await updateGenerationLog(id, { isFavorite: newStatus }, currentUser?.uid);
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: newStatus, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const handleDeleteHistory = async (id: string) => {
    await deleteGenerationLog(id, currentUser?.uid);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllHistory = () => {
    localStorage.removeItem('visual_os_history');
    setHistory([]);
  };

  const handleBulkUpdateHistory = async (
    recordIds: string[],
    changes: {
      tagsToAdd?: string[];
      tagsToRemove?: string[];
      replaceAllTags?: string[];
      notes?: string;
      appendNotes?: boolean;
      clearNotes?: boolean;
    }
  ) => {
    const updated = await bulkUpdateGenerationLogs(recordIds, changes, currentUser?.uid);
    setHistory(updated);
  };

  const handleUpdateRecord = async (id: string, updates: Partial<GenerationRecord>) => {
    await updateGenerationLog(id, updates, currentUser?.uid);
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );
  };

  const handleSelectMode = (mode: AutoMode) => {
    setSelectedMode(mode.code);
    setActiveCommands(mode.suggestedCommands);
    setActiveTab('studio');
  };

  const handleInsertCommand = (cmd: string) => {
    if (!activeCommands.includes(cmd)) {
      setActiveCommands((prev) => [...prev, cmd]);
    } else {
      setActiveCommands((prev) => prev.filter((c) => c !== cmd));
    }
  };

  const handleLoadResearchProject = (project: ResearchPreset) => {
    setSelectedMode(project.autoMode);
    setActiveCommands(project.commands);
    setActiveTab('studio');
  };

  const workspaceHeadings: Record<
    'studio' | 'modes' | 'commands' | 'qa' | 'research' | 'series' | 'ape',
    { titleTh: string; titleEn: string; subtitleTh: string; subtitleEn: string }
  > = {
    studio: {
      titleTh: 'สตูดิโอสังเคราะห์ข้อกำหนดภาพและเขียนแบบวิศวกรรมอัจฉริยะ',
      titleEn: 'Integrated Visual Specification & Engineering Studio Console',
      subtitleTh: 'แปลงเจตจำนงทางเทคนิคและวิชาการเป็นข้อกำหนดภาพ 20 ตัวแปร พร้อมระบบตรวจสอบ 50-Point Visual QA',
      subtitleEn: 'Deterministic 20-variable visual synthesis, 3-Pass prompt engineering, and 50-point empirical QA verification.',
    },
    modes: {
      titleTh: 'คลัง 20 โหมดอัตโนมัติเฉพาะทาง (Auto Modes Architecture)',
      titleEn: '20 Domain-Specific Auto Modes Architecture',
      subtitleTh: 'เลือกโหมดการทำงานเพื่อกำหนดลำดับชั้นสายตา มุมมองเลนส์ และข้อกำหนดมาตรฐานวิชาชีพโดยอัตโนมัติ',
      subtitleEn: 'Configure dedicated optical hierarchies, drafting projections, and academic publication rules.',
    },
    commands: {
      titleTh: 'พจนานุกรมคำสั่งควบคุมภาพและวิศวกรรม 386+ คำสั่ง',
      titleEn: '386+ Modular Visual & Product Engineering Command Dictionary',
      subtitleTh: 'คลังคำสั่งโครงสร้างสำหรับควบคุมมุมกล้อง แสง วัสดุ มาตรฐานการเขียนแบบ และเวิร์กโฟลว์ APE OS v2.0',
      subtitleEn: 'Structured syntax combinators for camera optics, lighting physics, materials, ISO drafting, and APE OS v2.0.',
    },
    qa: {
      titleTh: 'ระบบตรวจสอบคุณภาพความสัตย์จริง 50-Point Visual QA & APE Gates',
      titleEn: '50-Point Visual QA & 32-Item APE OS v2.0 Release Gates',
      subtitleTh: 'เกณฑ์ประเมินความถูกต้องของโครงสร้าง เรขาคณิต มิติทางวิศวกรรม และประตูคุณภาพก่อนปล่อยระบบ',
      subtitleEn: 'Comprehensive verification of geometric coherence, mechanical plausibility, and risk-based release readiness.',
    },
    research: {
      titleTh: 'โครงการวิจัยและกรณีศึกษาต้นแบบ คณะเทคโนโลยีอุตสาหกรรม NRRU',
      titleEn: 'NRRU Industrial Technology Research Case Studies & Pipeline',
      subtitleTh: 'บูรณาการปัญญาประดิษฐ์ด้านภาพเข้ากับระเบียบวิธีวิจัยสากลตามมาตรฐาน APA 7th Edition',
      subtitleEn: 'Applied engineering prototypes and APA 7th figure specifications from Nakhon Ratchasima Rajabhat University.',
    },
    series: {
      titleTh: 'สตูดิโอสังเคราะห์ข้อกำหนดภาพและเขียนแบบวิศวกรรมอัจฉริยะ',
      titleEn: 'Integrated Visual Specification & Engineering Studio Console',
      subtitleTh: 'ล็อกคุณลักษณะภาพ 10 มิติเพื่อรักษาเอกลักษณ์ของชุดภาพวิจัยและงานออกแบบอย่างสม่ำเสมอ',
      subtitleEn: 'Maintain strict visual continuity across multi-figure research publications and engineering series.',
    },
    ape: {
      titleTh: 'ระบบปฏิบัติการวิศวกรรมผลิตภัณฑ์ปรับตัวได้ (Adaptive Product Engineering OS v2.0)',
      titleEn: 'Adaptive Product Engineering OS v2.0 — Master Workbench & Quality Gates',
      subtitleTh: 'บริหารจัดการ Project Record แหล่งเดียว ความเชื่อมโยง REQ→AC→TEST โหมด QUICK/STANDARD/HIGH-ASSURANCE และประตูคุณภาพ 32 ข้อ',
      subtitleEn: 'Authoritative Project Record, adaptive execution routing, REQ→AC→TEST traceability, and 32-item release assurance.',
    },
  };

  const currentHeader = workspaceHeadings[activeTab] || workspaceHeadings.studio;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-100">
      {/* WCAG Skip Navigation Link */}
      <a
        href="#main-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:text-xs focus:shadow-xl"
      >
        {isThai ? 'ข้ามไปยังพื้นที่ทำงานหลัก' : 'Skip to main workspace'}
      </a>

      {/* Top Header */}
      <TopNavigation
        activeTab={activeTab === 'series' || activeTab === 'ape' ? 'studio' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'series') {
            setIsSeriesModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        language={language}
        setLanguage={setLanguage}
        seriesLockActive={seriesLock.enabled}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Auth & Sync Status Bar */}
      <AuthBar
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        language={language}
        historyCount={history.length}
      />

      {/* Main Workspace Container (8pt spacing scale) */}
      <main
        id="main-workspace"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 focus:outline-none"
      >
        {/* Semantic H1 Page Header (Strict H1 -> H2 -> H3 -> H4 Hierarchy) */}
        <header className="border-b border-slate-800 pb-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono">
              <span className="text-amber-400 font-semibold">{selectedMode}</span>
              <span aria-hidden="true">·</span>
              <span>
                {isThai ? 'คณะเทคโนโลยีอุตสาหกรรม NRRU' : 'NRRU Faculty of Industrial Technology'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {isThai ? `คำสั่งที่เลือก ${activeCommands.length} รายการ` : `${activeCommands.length} Active Commands`}
              </span>
            </div>
            <h1 className="text-fluid-h1 font-display font-bold text-white tracking-tight">
              {isThai ? currentHeader.titleTh : currentHeader.titleEn}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isThai ? currentHeader.subtitleTh : currentHeader.subtitleEn}
            </p>
          </div>

          {/* Quick Switcher between Visual Studio & APE OS v2.0 Workbench */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              aria-pressed={activeTab === 'ape'}
              onClick={() => setActiveTab(activeTab === 'ape' ? 'studio' : 'ape')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeTab === 'ape'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {activeTab === 'ape'
                  ? isThai
                    ? 'กลับสู่ Visual Studio Console'
                    : 'Back to Visual Studio Console'
                  : isThai
                  ? 'เปิดเวิร์กเบนช์ APE OS v2.0 (Project Record & 32 Gates)'
                  : 'Open APE OS v2.0 Workbench (32 Gates)'}
              </span>
            </button>
          </div>
        </header>

        {activeTab === 'studio' && (
          <StudioConsole
            language={language}
            activeCommands={activeCommands}
            setActiveCommands={setActiveCommands}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            seriesLock={seriesLock}
            onSaveHistory={handleSaveHistory}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
            activeHistoryRecord={activeHistoryRecord}
            onClearActiveHistoryRecord={() => setActiveHistoryRecord(null)}
          />
        )}

        {activeTab === 'ape' && (
          <ApeOsWorkbench
            language={language}
            onSendToStudio={(promptText, cmds) => {
              setActiveCommands(cmds);
              if (history.length > 0) {
                setActiveHistoryRecord({
                  ...history[0],
                  id: `ape_req_${Date.now()}`,
                  prompt: promptText,
                  commands: cmds,
                });
              }
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'modes' && (
          <AutoModesExplorer
            onSelectMode={handleSelectMode}
            language={language}
          />
        )}

        {activeTab === 'commands' && (
          <CommandDictionary
            onInsertCommand={handleInsertCommand}
            activeCommands={activeCommands}
            language={language}
          />
        )}

        {activeTab === 'qa' && (
          <QAInspector
            language={language}
          />
        )}

        {activeTab === 'research' && (
          <ResearchProjects
            onLoadProject={handleLoadResearchProject}
            language={language}
          />
        )}
      </main>

      {/* Series Lock Modal */}
      <SeriesLockModal
        isOpen={isSeriesModalOpen}
        onClose={() => setIsSeriesModalOpen(false)}
        lockState={seriesLock}
        setLockState={setSeriesLock}
        language={language}
      />

      {/* History Slide-out Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRevert={handleRevertHistory}
        onDuplicateToStudio={handleDuplicateToStudio}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
        onBulkUpdate={handleBulkUpdateHistory}
        onUpdateRecord={handleUpdateRecord}
        language={language}
        isAuthenticated={!!currentUser}
        userEmail={currentUser?.email || undefined}
      />

      {/* Institutional & Academic Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-6 mt-12 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
            <span className="font-display font-bold text-white">GEMINI VISUAL AI OS</span>
            <span aria-hidden="true">·</span>
            <span>{isThai ? 'ผู้ออกแบบสร้างสรรค์: อาจารย์ฐิติวัสส์ กาญจนพิมาย' : 'Created by: Lecturer Thitiwas Kanjanaphimai'}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-slate-300">
              {isThai
                ? 'คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครราชสีมา (NRRU)'
                : 'Faculty of Industrial Technology, NRRU'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>EVIDENCE FIRST</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
              <span>APA 7TH STANDARD</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>50-POINT QA AUDITED</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

