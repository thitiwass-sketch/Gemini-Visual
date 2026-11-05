import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  Compass, 
  X, 
  ArrowRight,
  RefreshCw,
  Info,
  Cpu,
  History,
  RotateCcw,
  CornerDownLeft,
  Tag
} from 'lucide-react';
import { AUTO_MODES, AutoMode } from '../data/visualOsData';
import { VisualCanvas } from './VisualCanvas';
import { SpecificationTable } from './SpecificationTable';
import { QAInspector } from './QAInspector';
import { SeriesLockState } from './SeriesLockModal';
import { GenerationRecord } from '../lib/firebase';
import { PromptPredictiveAutocomplete } from './PromptPredictiveAutocomplete';
import { SpecializedTerm, queryPredictiveTerms } from '../data/specializedTerminology';

interface StudioConsoleProps {
  language: 'th' | 'en';
  activeCommands: string[];
  setActiveCommands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  seriesLock: SeriesLockState;
  onSaveHistory: (record: GenerationRecord) => void;
  onOpenHistory: () => void;
  historyCount: number;
  activeHistoryRecord: GenerationRecord | null;
  onClearActiveHistoryRecord: () => void;
}

export const StudioConsole: React.FC<StudioConsoleProps> = ({
  language,
  activeCommands,
  setActiveCommands,
  selectedMode,
  setSelectedMode,
  seriesLock,
  onSaveHistory,
  onOpenHistory,
  historyCount,
  activeHistoryRecord,
  onClearActiveHistoryRecord,
}) => {
  const isThai = language === 'th';

  const [userPrompt, setUserPrompt] = useState<string>(
    'เครื่องคัดแยกเมล็ดข้าวเปลือกด้วยระบบตะแกรงสั่นและการคัดแยกความหนาแน่น พร้อมช่องจ่ายเมล็ดพันธุ์ข้าวคุณภาพสูง'
  );
  const [responseMode, setResponseMode] = useState<string>('PRO');
  const [activeTab, setActiveTab] = useState<'spec' | 'prompt' | 'qa' | 'research'>('spec');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [showAllActiveCommands, setShowAllActiveCommands] = useState<boolean>(false);
  const [showAllResponseModes, setShowAllResponseModes] = useState<boolean>(false);

  // Predictive Autocomplete state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);
  const [activeCursorWord, setActiveCursorWord] = useState<string>('');
  const [floatingSuggestions, setFloatingSuggestions] = useState<SpecializedTerm[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(0);
  const [showFloatingSuggestions, setShowFloatingSuggestions] = useState<boolean>(false);

  const updateCursorTracking = (text: string, selectionStart: number) => {
    const textBeforeCursor = text.slice(0, selectionStart);
    // Find current trailing token/word being typed
    const match = textBeforeCursor.match(/([^\s,，、/]+)$/);
    const word = match ? match[1] : '';
    setActiveCursorWord(word);

    if (word && word.length >= 2) {
      const matches = queryPredictiveTerms(selectedMode, word, 5);
      if (matches.length > 0) {
        setFloatingSuggestions(matches);
        setShowFloatingSuggestions(true);
        setSelectedSuggestionIndex(0);
        return;
      }
    }
    setShowFloatingSuggestions(false);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUserPrompt(val);
    updateCursorTracking(val, e.target.selectionStart);
  };

  const handleInsertTerm = (term: SpecializedTerm) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setUserPrompt((prev) => (prev ? `${prev}, ${term.term}` : term.term));
      return;
    }

    const currentText = userPrompt;
    const cursorPos = textarea.selectionStart || currentText.length;
    const textBeforeCursor = currentText.slice(0, cursorPos);
    const textAfterCursor = currentText.slice(cursorPos);

    let newText = '';
    let newCursorPos = 0;

    if (activeCursorWord && textBeforeCursor.endsWith(activeCursorWord)) {
      // Replace the prefix the user was typing
      const beforeWord = textBeforeCursor.slice(0, -activeCursorWord.length);
      const needPrefixSpace = beforeWord.length > 0 && !beforeWord.endsWith(' ') && !beforeWord.endsWith(',');
      const prefix = needPrefixSpace ? ' ' : '';
      const suffix = textAfterCursor.startsWith(' ') || textAfterCursor.startsWith(',') ? '' : ' ';
      newText = `${beforeWord}${prefix}${term.term}${suffix}${textAfterCursor}`;
      newCursorPos = beforeWord.length + prefix.length + term.term.length + suffix.length;
    } else {
      // Insert at cursor
      const needPrefixSpace = textBeforeCursor.length > 0 && !textBeforeCursor.endsWith(' ') && !textBeforeCursor.endsWith(',');
      const prefix = needPrefixSpace ? ', ' : '';
      const suffix = textAfterCursor.startsWith(' ') || textAfterCursor.startsWith(',') ? '' : ' ';
      newText = `${textBeforeCursor}${prefix}${term.term}${suffix}${textAfterCursor}`;
      newCursorPos = textBeforeCursor.length + prefix.length + term.term.length + suffix.length;
    }

    setUserPrompt(newText);
    setShowFloatingSuggestions(false);
    setActiveCursorWord('');

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 20);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showFloatingSuggestions && floatingSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % floatingSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev - 1 + floatingSuggestions.length) % floatingSuggestions.length);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleInsertTerm(floatingSuggestions[selectedSuggestionIndex]);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleInsertTerm(floatingSuggestions[selectedSuggestionIndex]);
      } else if (e.key === 'Escape') {
        setShowFloatingSuggestions(false);
      }
    }
  };

  // Result state
  const [currentImage, setCurrentImage] = useState<string | null>(
    '/src/assets/images/sample_rice_separator_1790215816022.jpg'
  );
  const [osResponse, setOsResponse] = useState<any>({
    taskClassification: 'Technical & Engineering Visualization',
    selectedMode: '/AUTO-ENGINEERING',
    assumptions: [
      'กำหนดขนาดสัดส่วนมาตรฐานตามจุดประสงค์ของคำสั่ง',
      'คงความหมายเดิมและไม่สร้างข้อมูลตัวเลขเท็จ (Evidence First)',
    ],
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
      typographyText: 'Thai/English ISO standard technical callouts',
      scale: 'Plausible 1:1 functional mechanism',
      technicalConstraints: 'Vibratory springs, drive motor, and eccentric cam shaft logically connected',
      negativeConstraints: 'No watermarks, no distorted anatomy, no hallucinated statistics, no blur',
      aspectRatio: '16:9',
      provenance: 'NRRU Visual AI OS v5.1 Protocol • Thitiwas Kanjanaphimai',
    },
    threePassPrompt: {
      pass1Intent: 'Communicate the mechanical sorting flow of paddy rice grain separator with zero distortion.',
      pass2Visualization: 'Vibratory multi-deck sieve trays, grain feed hopper, electric motor with eccentric cam, and separated grain discharge chutes in an exploded 30-degree axonometric isometric view.',
      pass3Control: 'Precision technical blueprint rendering, sharp vector line edges, neutral studio lighting, ISO dimensional markers, academic publication grade, 8k crisp details.',
      finalOptimizedPrompt: 'Automated agricultural paddy rice grain sorting machine mechanism, mechanical vibratory sieve trays, precision hopper, transparent cutaway view showing engineering assembly, clean studio lighting, realistic industrial prototype, 8k resolution, isometric technical drawing',
      negativePrompt: 'blurry, distorted geometry, floating artifacts, illegible text, watermark, oversaturated neon, fake empirical data',
    },
    qaStatus: 'PASS',
    qaSummary: 'ผ่านเกณฑ์มาตรฐาน 50-Point Visual QA โดยไม่มีข้อผิดพลาดเชิงโครงสร้าง',
    qaChecks: [
      { id: '01', point: 'Subject identity is unambiguous', status: 'PASS', note: 'Subject matches intent directly' },
      { id: '02', point: "User's primary objective is represented", status: 'PASS', note: 'Core sorting mechanism preserved' },
      { id: '06', point: 'Perspective is coherent', status: 'PASS', note: 'Isometric 30-degree projection holds true' },
      { id: '24', point: 'Geometry is coherent', status: 'PASS', note: 'No accidental warping or impossible angles' },
      { id: '30', point: 'Technical components connect logically', status: 'PASS', note: 'Motor and shaft connect to sieve' },
      { id: '32', point: 'Dimensions/labels are not invented', status: 'PASS', note: 'Labels marked as proposed' },
      { id: '44', point: 'No false claim of empirical evidence', status: 'PASS', note: 'Marked as illustrative model' },
      { id: '50', point: "Final result matches user's intent", status: 'PASS', note: 'Complete intent alignment' },
    ],
    researchFigure: {
      isResearchActive: true,
      figureType: 'F2 Conceptual & Technical Prototype Figure',
      title: 'Figure 1. Kinematic structure of the paddy rice separator',
      apaCaption: 'Figure 1. Mechanical kinematic structure and 3D exploded configuration of the automated paddy rice separator. NRRU Industrial Technology.',
      provenance: 'Generated via Gemini Visual AI OS v5.1 • NRRU Faculty of Industrial Technology',
      empiricalBoundary: 'Design proposal & illustrative schema only. Not empirical lab trial data.',
    },
    technicalDrawing: {
      isTechnicalActive: true,
      viewsSelected: ['Isometric View', 'Front Elevation', 'Exploded Assembly'],
      componentsIdentified: ['Feed Hopper', 'Multi-deck Sieve', 'Eccentric Cam Motor', 'Discharge Chute'],
      dimensionStatus: 'PROPOSED',
      engineeringLogic: 'Standard mechanical tolerances and logical structural load distribution applied.',
    },
    refinementOptions: [
      {
        title: 'ภาพวาดเทคนิคชิ้นส่วนแยกประกอบ (Exploded View)',
        commandSyntax: '/technical-drawing + /exploded-view + /isometric + /blueprint',
        explanation: 'ขยายชิ้นส่วนแยกประกอบตามแกนเพื่อดูการประกอบภายใน',
      },
      {
        title: 'รูปภาพวิจัยเพื่อตีพิมพ์ในวารสาร (Academic Journal Figure)',
        commandSyntax: '/research-figure + /conceptual-framework + /academic + /a4',
        explanation: 'จัดเลย์เอาต์ตามเกณฑ์ APA 7th สำหรับตีพิมพ์ในวารสาร Scopus/TCI',
      },
      {
        title: 'ภาพถ่ายผลิตภัณฑ์ในสตูดิโอ (Product Studio Hero)',
        commandSyntax: '/product-hero + /studio-light + /macro-lens + /luxury + /4:5',
        explanation: 'เน้นแสงสตูดิโอขับเน้นงานเชื่อมสแตนเลสและพื้นผิวโลหะ',
      },
    ],
  });

  // Revert/load from history record when activeHistoryRecord changes
  useEffect(() => {
    if (activeHistoryRecord) {
      setUserPrompt(activeHistoryRecord.prompt);
      setSelectedMode(activeHistoryRecord.mode);
      setActiveCommands(activeHistoryRecord.commands || []);
      setResponseMode(activeHistoryRecord.responseMode || 'PRO');
      if (activeHistoryRecord.imageUrl) {
        setCurrentImage(activeHistoryRecord.imageUrl);
      }
      setOsResponse({
        taskClassification: activeHistoryRecord.mode.includes('TECH')
          ? 'Technical & Engineering Visualization'
          : 'Visual Specification Generation',
        selectedMode: activeHistoryRecord.mode,
        assumptions: ['Restored from history log record'],
        visualSpecification: activeHistoryRecord.visualSpecification,
        threePassPrompt: activeHistoryRecord.threePassPrompt,
        qaStatus: activeHistoryRecord.qaStatus,
        qaSummary: activeHistoryRecord.qaSummary,
        qaChecks: activeHistoryRecord.qaChecks,
        researchFigure: activeHistoryRecord.researchFigure,
        technicalDrawing: activeHistoryRecord.technicalDrawing,
        refinementOptions: [],
      });
    }
  }, [activeHistoryRecord, setSelectedMode, setActiveCommands]);

  const responseModes = ['FAST', 'SMART', 'PRO', 'IDEA', 'AUDIT', 'REFINE', 'ACADEMIC', 'TECH', 'SERIES'];

  const handleProcess = async () => {
    if (!userPrompt.trim()) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/visual-os/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt,
          mode: selectedMode,
          commands: activeCommands,
          responseMode,
          seriesLock: seriesLock.enabled ? seriesLock : null,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOsResponse(data);

        // Automatically log generation to History
        const newRecord: GenerationRecord = {
          id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          userId: '',
          prompt: userPrompt,
          mode: selectedMode,
          commands: activeCommands,
          responseMode,
          finalOptimizedPrompt: data?.threePassPrompt?.finalOptimizedPrompt || userPrompt,
          threePassPrompt: data?.threePassPrompt || {
            pass1Intent: userPrompt,
            pass2Visualization: userPrompt,
            pass3Control: activeCommands.join(' '),
            finalOptimizedPrompt: userPrompt,
          },
          visualSpecification: data?.visualSpecification || {},
          qaStatus: data?.qaStatus || 'PASS',
          qaSummary: data?.qaSummary || 'Audited via 50-point QA',
          qaChecks: data?.qaChecks,
          researchFigure: data?.researchFigure,
          technicalDrawing: data?.technicalDrawing,
          imageUrl: currentImage,
          aspectRatio: data?.visualSpecification?.aspectRatio || '16:9',
          createdAt: new Date().toISOString(),
          timestamp: Date.now(),
        };
        onSaveHistory(newRecord);
      }
    } catch (err) {
      console.error('Failed to process intent via Visual AI OS:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateImage = async () => {
    const promptToUse = osResponse?.threePassPrompt?.finalOptimizedPrompt || userPrompt;
    const ratioToUse = osResponse?.visualSpecification?.aspectRatio || '16:9';

    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/visual-os/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          aspectRatio: ratioToUse,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCurrentImage(data.imageUrl);

        // Update active history record or create image render log
        const newRecord: GenerationRecord = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          userId: '',
          prompt: userPrompt,
          mode: selectedMode,
          commands: activeCommands,
          responseMode,
          finalOptimizedPrompt: promptToUse,
          threePassPrompt: osResponse?.threePassPrompt || {
            pass1Intent: userPrompt,
            pass2Visualization: userPrompt,
            pass3Control: activeCommands.join(' '),
            finalOptimizedPrompt: promptToUse,
          },
          visualSpecification: osResponse?.visualSpecification || {},
          qaStatus: osResponse?.qaStatus || 'PASS',
          qaSummary: osResponse?.qaSummary || 'Audited via 50-point QA',
          qaChecks: osResponse?.qaChecks,
          researchFigure: osResponse?.researchFigure,
          technicalDrawing: osResponse?.technicalDrawing,
          imageUrl: data.imageUrl,
          aspectRatio: ratioToUse,
          createdAt: new Date().toISOString(),
          timestamp: Date.now(),
        };
        onSaveHistory(newRecord);
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const removeCommand = (cmd: string) => {
    setActiveCommands((prev) => prev.filter((c) => c !== cmd));
  };

  const handleApplyRefinement = (cmdSyntax: string) => {
    const parts = cmdSyntax.split(' ').filter((p) => p.startsWith('/'));
    setActiveCommands((prev) => Array.from(new Set([...prev, ...parts])));
  };

  const copyFinalPrompt = () => {
    if (osResponse?.threePassPrompt?.finalOptimizedPrompt) {
      navigator.clipboard.writeText(osResponse.threePassPrompt.finalOptimizedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const visibleResponseModes = showAllResponseModes ? responseModes : responseModes.slice(0, 5);
  const visibleActiveCommands = showAllActiveCommands ? activeCommands : activeCommands.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Restored from History Banner */}
      {activeHistoryRecord && (
        <div
          role="status"
          className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-100"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>
              {isThai
                ? `กำลังดูประวัติที่กู้คืน: ${activeHistoryRecord.mode} (${new Date(activeHistoryRecord.createdAt).toLocaleTimeString()})`
                : `Active Restored History Log: ${activeHistoryRecord.mode} (${new Date(activeHistoryRecord.createdAt).toLocaleTimeString()})`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClearActiveHistoryRecord}
            className="text-amber-300 hover:text-white underline text-xs font-medium px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {isThai ? 'ปิดการกู้คืน' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Section 1 (H2): Top Console Input Box (30% Structural Surface) */}
      <section
        aria-labelledby="intent-console-heading"
        className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 id="intent-console-heading" className="text-fluid-h2 font-display font-bold text-white">
              {isThai ? '01. กำหนดเจตจำนงภาพและโหมดประมวลผล' : '01. Visual Intent & Mode Configuration'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {isThai
                ? 'เลือกโหมดเฉพาะทาง พิมพ์คำอธิบาย หรือคลิกคำศัพท์เทคนิคเพื่อสร้างพร้อมต์ระดับวิศวกรรม'
                : 'Select domain mode, describe your visual intent, and insert verified technical terminology.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            aria-label={isThai ? `เปิดแผงประวัติการสร้างภาพ (${historyCount} รายการ)` : `Open History Panel (${historyCount} records)`}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 transition-colors flex items-center gap-1.5 border border-slate-700 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <History className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            <span>{isThai ? 'ประวัติ' : 'History'}</span>
            <span className="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded bg-slate-900 text-slate-200">
              {historyCount}
            </span>
          </button>
        </div>

        {/* Mode Selector & Response Mode Wrapping Disclosure */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="auto-mode-select" className="text-xs font-semibold text-slate-200">
              {isThai ? 'โหมดอัตโนมัติ (Auto Mode):' : 'Auto Mode:'}
            </label>
            <select
              id="auto-mode-select"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold text-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {AUTO_MODES.map((m) => (
                <option key={m.id} value={m.code}>
                  {m.code} — {isThai ? m.nameTh : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Wrapping Response Mode Selector with Accessible Disclosure */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={isThai ? 'โหมดการตอบสนอง' : 'Response mode selector'}>
            <span className="text-xs font-medium text-slate-300 mr-1">
              {isThai ? 'โหมดประมวลผล:' : 'Response:'}
            </span>
            {visibleResponseModes.map((rm) => {
              const isSelected = responseMode === rm;
              return (
                <button
                  key={rm}
                  type="button"
                  onClick={() => setResponseMode(rm)}
                  aria-pressed={isSelected}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  /{rm}
                </button>
              );
            })}
            {responseModes.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllResponseModes(!showAllResponseModes)}
                aria-expanded={showAllResponseModes}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-amber-300 hover:text-white border border-slate-700 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {showAllResponseModes
                  ? isThai ? 'ย่อโหมด' : 'Less'
                  : isThai ? `+ อีก ${responseModes.length - 5} โหมด` : `+${responseModes.length - 5} More`}
              </button>
            )}
          </div>
        </div>

        {/* Input Textarea with command builder and predictive autocomplete */}
        <div className="relative space-y-1.5">
          <label htmlFor="visual-intent-textarea" className="block text-xs font-semibold text-slate-200">
            {isThai
              ? 'คำอธิบายเจตจำนงทางสายตา (Visual Intent Prompt):'
              : 'Visual Intent Prompt Description:'}
          </label>
          <textarea
            id="visual-intent-textarea"
            ref={textareaRef}
            value={userPrompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsTextareaFocused(true);
              if (textareaRef.current) {
                updateCursorTracking(userPrompt, textareaRef.current.selectionStart);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsTextareaFocused(false);
                setShowFloatingSuggestions(false);
              }, 250);
            }}
            onClick={(e) => {
              updateCursorTracking(userPrompt, (e.target as HTMLTextAreaElement).selectionStart);
            }}
            onKeyUp={(e) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                updateCursorTracking(userPrompt, (e.target as HTMLTextAreaElement).selectionStart);
              }
            }}
            rows={3}
            placeholder={
              isThai
                ? 'ระบุเจตจำนงของภาพ เช่น "เครื่องคัดแยกเมล็ดข้าวเปลือกด้วยระบบตะแกรงสั่นและการคัดแยกความหนาแน่น..."'
                : 'Enter visual intent (e.g. "Automated agricultural paddy rice grain sorting machine mechanism...")'
            }
            className="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 leading-relaxed focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
          />

          {/* Floating In-line Predictive Suggestions Popover */}
          {showFloatingSuggestions && floatingSuggestions.length > 0 && (
            <div
              role="listbox"
              aria-label={isThai ? 'รายการคำศัพท์เฉพาะทางแนะนำ' : 'Predictive terminology suggestions'}
              className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-slate-900 border border-amber-500/60 rounded-xl shadow-2xl overflow-hidden"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                  <span>
                    {isThai
                      ? `คำศัพท์เฉพาะทางตรงกับ "${activeCursorWord}"`
                      : `Specialized terminology for "${activeCursorWord}"`}
                  </span>
                </span>
                <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                  {isThai ? '↑↓ นำทาง · Enter/Tab แทรกคำศัพท์ · Esc ปิด' : '↑↓ Navigate · Enter/Tab Insert · Esc Close'}
                </span>
              </div>

              <div className="p-1.5 space-y-1 max-h-60 overflow-y-auto">
                {floatingSuggestions.map((term, idx) => {
                  const isSelected = idx === selectedSuggestionIndex;
                  return (
                    <button
                      key={term.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleInsertTerm(term)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-white border border-amber-500/50'
                          : 'text-slate-200 hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-100">
                            {isThai ? term.termTh : term.termEn}
                          </span>
                          {term.badge && (
                            <span className="text-[11px] font-mono text-amber-300">
                              [{term.badge}]
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-amber-300 break-words">
                          "{term.term}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-xs text-slate-300 font-mono">
                        <span className="hidden md:inline text-slate-300 max-w-xs">
                          {isThai ? term.descriptionTh : term.descriptionEn}
                        </span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300 flex items-center gap-1">
                          <CornerDownLeft className="w-3 h-3" aria-hidden="true" />
                          <span>{isSelected ? (isThai ? 'แทรก' : 'Insert') : 'Select'}</span>
                        </kbd>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Predictive Terminology Autocomplete Explorer & Quick Term Inserter */}
        <PromptPredictiveAutocomplete
          mode={selectedMode}
          userPrompt={userPrompt}
          onInsertTerm={handleInsertTerm}
          language={language}
          isTextareaFocused={isTextareaFocused}
          activeCursorWord={activeCursorWord}
        />

        {/* Active Command Chips Bar with Smooth Wrapping & Accessible Disclosure */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-300 font-mono font-semibold mr-1">
              {isThai ? 'คำสั่งที่เปิดใช้งาน:' : 'Active Commands:'}
            </span>
            {activeCommands.length === 0 ? (
              <span className="text-xs text-slate-300 italic">
                {isThai ? 'ไม่มี (เลือกจากพจนานุกรมคำสั่ง)' : 'None (select from command dictionary)'}
              </span>
            ) : (
              <>
                {visibleActiveCommands.map((cmd) => (
                  <span
                    key={cmd}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-xs"
                  >
                    <span>{cmd}</span>
                    <button
                      type="button"
                      onClick={() => removeCommand(cmd)}
                      aria-label={isThai ? `ลบคำสั่ง ${cmd}` : `Remove command ${cmd}`}
                      className="p-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
                {activeCommands.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllActiveCommands(!showAllActiveCommands)}
                    aria-expanded={showAllActiveCommands}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 hover:text-white text-xs font-mono border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {showAllActiveCommands
                      ? isThai ? 'ซ่อนบางส่วน' : 'Show Less'
                      : isThai ? `+ แสดงอีก ${activeCommands.length - 6}` : `+${activeCommands.length - 6} More`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* 10% Accent CTA Button */}
          <button
            type="button"
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>
              {isProcessing
                ? isThai ? 'กำลังสังเคราะห์ข้อกำหนด...' : 'Synthesizing Spec...'
                : isThai ? 'ประมวลผลเจตนาภาพ (Synthesize Spec)' : 'Synthesize Visual Spec'}
            </span>
          </button>
        </div>
      </section>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (H2): Visual Output Canvas & 3-Pass Synthesis (7 cols) */}
        <section aria-labelledby="visual-viewport-heading" className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 id="visual-viewport-heading" className="text-fluid-h2 font-display font-bold text-white">
              {isThai ? '02. พื้นที่แสดงผลและเรนเดอร์ภาพต้นแบบ' : '02. Visual Prototype Viewport'}
            </h2>
            <VisualCanvas
              currentImage={currentImage}
              aspectRatio={osResponse?.visualSpecification?.aspectRatio || '16:9'}
              isGeneratingImage={isGeneratingImage}
              onGenerateImage={handleGenerateImage}
              apaCaption={osResponse?.researchFigure?.apaCaption}
              figureType={osResponse?.researchFigure?.figureType}
              isTechnical={osResponse?.technicalDrawing?.isTechnicalActive}
              prompt={osResponse?.threePassPrompt?.finalOptimizedPrompt || userPrompt}
              language={language}
            />
          </div>

          {/* 3-Pass Prompt Display Box (H3) */}
          {osResponse?.threePassPrompt && (
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-fluid-h3 font-display font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                  <span>{isThai ? 'เครื่องยนต์สังเคราะห์ 3-Pass Prompt' : '3-Pass Prompt Engine Synthesis'}</span>
                </h3>
                <button
                  type="button"
                  onClick={copyFinalPrompt}
                  aria-label={isThai ? 'คัดลอกพร้อมต์ที่ปรับแต่งแล้ว' : 'Copy final optimized prompt'}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {copiedPrompt ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                  )}
                  <span>{copiedPrompt ? (isThai ? 'คัดลอกแล้ว' : 'Copied') : (isThai ? 'คัดลอกพร้อมต์' : 'Copy Prompt')}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="text-slate-300 font-mono font-semibold text-xs">
                    {isThai ? 'ขั้นที่ 1: เจตจำนงที่แท้จริง (Pass 1 — Intent)' : 'Pass 1 — Core Intent'}
                  </h4>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {osResponse.threePassPrompt.pass1Intent}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="text-slate-300 font-mono font-semibold text-xs">
                    {isThai ? 'ขั้นที่ 2: องค์ประกอบที่ตามองเห็น (Pass 2 — Visualization)' : 'Pass 2 — Structural Visualization'}
                  </h4>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {osResponse.threePassPrompt.pass2Visualization}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="text-slate-300 font-mono font-semibold text-xs">
                    {isThai ? 'ขั้นที่ 3: ตัวแปรควบคุมมุมกล้อง แสง และสไตล์ (Pass 3 — Control)' : 'Pass 3 — Optical & Style Control'}
                  </h4>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {osResponse.threePassPrompt.pass3Control}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-500/40">
                  <h4 className="text-amber-300 font-mono font-semibold text-xs">
                    {isThai ? 'พร้อมต์สมบูรณ์สำหรับเรนเดอร์ (Final Optimized Prompt)' : 'Final Optimized Prompt'}
                  </h4>
                  <p className="text-slate-100 mt-1.5 font-mono text-xs leading-relaxed break-words">
                    {osResponse.threePassPrompt.finalOptimizedPrompt}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column (H2): Specification, QA & Refinement Details (5 cols) */}
        <section aria-labelledby="spec-qa-heading" className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="space-y-3 border-b border-slate-800 pb-3">
              <h2 id="spec-qa-heading" className="text-fluid-h2 font-display font-bold text-white">
                {isThai ? '03. ข้อกำหนดทางสายตาและผลตรวจประเมิน' : '03. Specification & Empirical Audit'}
              </h2>

              {/* Wrapping Sub-Navigation Tabs */}
              <div
                role="tablist"
                aria-label={isThai ? 'มุมมองรายละเอียดข้อกำหนดและการตรวจสอบ' : 'Specification and audit tabs'}
                className="flex flex-wrap items-center gap-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'spec'}
                  onClick={() => setActiveTab('spec')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    activeTab === 'spec'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {isThai ? 'ข้อกำหนด 20 ข้อ' : '20-Variable Spec'}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'qa'}
                  onClick={() => setActiveTab('qa')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    activeTab === 'qa'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {isThai ? 'ผลตรวจ 50 QA' : '50-Point QA Audit'}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'research'}
                  onClick={() => setActiveTab('research')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    activeTab === 'research'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {isThai ? 'เกณฑ์วิจัย & เทคนิค' : 'Research & Tech Protocol'}
                </button>
              </div>
            </div>

            {/* Tab Content Display */}
            <div role="tabpanel">
              {activeTab === 'spec' && osResponse?.visualSpecification && (
                <SpecificationTable spec={osResponse.visualSpecification} language={language} />
              )}

              {activeTab === 'qa' && (
                <QAInspector
                  currentAuditChecks={osResponse?.qaChecks}
                  currentStatus={osResponse?.qaStatus}
                  qaSummary={osResponse?.qaSummary}
                  language={language}
                />
              )}

              {activeTab === 'research' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-fluid-h3 font-display font-semibold text-white mb-1">
                      {isThai ? 'โพรโทคอลภาพวิจัยและความสัตย์จริงทางข้อมูล' : 'Research Figure & Empirical Integrity Protocol'}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {isThai
                        ? 'ภาพวิจัยจำแนกประเภทอย่างเคร่งครัดตามข้อกำหนดสากลเพื่อป้องกันการสร้างผลการทดลองเท็จ'
                        : 'Rigid provenance and empirical boundaries prohibiting artificial data hallucination.'}
                    </p>
                  </div>

                  {osResponse?.researchFigure && (
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                        <span className="text-slate-300 font-medium">{isThai ? 'ประเภทของภาพ:' : 'Figure Type:'}</span>
                        <span className="font-mono text-amber-300 font-semibold">
                          {osResponse.researchFigure.figureType}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                        <span className="text-slate-300 font-medium">{isThai ? 'ขอบเขตหลักฐาน:' : 'Empirical Boundary:'}</span>
                        <span className="text-slate-200">
                          {osResponse.researchFigure.empiricalBoundary}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800">
                        <span className="text-slate-300 block mb-1 font-mono text-xs font-semibold">
                          {isThai ? 'แหล่งที่มาของข้อมูล (Provenance):' : 'Provenance Metadata:'}
                        </span>
                        <span className="text-slate-200 font-mono text-xs block bg-slate-900 p-2 rounded border border-slate-800 break-words">
                          {osResponse.researchFigure.provenance}
                        </span>
                      </div>
                    </div>
                  )}

                  {osResponse?.technicalDrawing?.isTechnicalActive && (
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                      <h4 className="font-semibold text-sky-300 text-xs">
                        {isThai ? 'แบบวิศวกรรมและการควบคุมมิติ' : 'Technical Drawing & Coordinate Views'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-300 block">{isThai ? 'มุมมองที่เลือก:' : 'Views Selected:'}</span>
                          <span className="text-slate-100 font-mono">
                            {osResponse.technicalDrawing.viewsSelected?.join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300 block">{isThai ? 'สถานะมิติสัดส่วน:' : 'Dimension Status:'}</span>
                          <span className="text-amber-300 font-mono font-semibold">
                            {osResponse.technicalDrawing.dimensionStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Refinement Options List (H3) */}
          {osResponse?.refinementOptions && osResponse.refinementOptions.length > 0 && (
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-fluid-h3 font-display font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span>{isThai ? 'ตัวเลือกการปรับแต่งต่อยอด (Targeted Refinements)' : 'Targeted Refinement Options'}</span>
              </h3>
              <div className="space-y-2">
                {osResponse.refinementOptions.map((opt: any, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyRefinement(opt.commandSyntax)}
                    className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-colors group flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-amber-300">
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {opt.explanation}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-amber-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 shrink-0">
                      {isThai ? '+ เพิ่มคำสั่ง' : '+ Apply'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
