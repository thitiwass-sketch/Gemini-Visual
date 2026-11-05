import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  Columns, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Cloud, 
  Check, 
  X, 
  ExternalLink,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  Sliders,
  Copy,
  FileText,
  Eye,
  SlidersHorizontal,
  SplitSquareVertical,
  Maximize2,
  FolderArchive,
  Download,
  CheckSquare,
  Square,
  Loader2,
  PackageCheck,
  Tag,
  Hash,
  Edit3,
  Plus,
  StickyNote,
  Calendar,
  Clock,
  Filter,
  CheckCheck,
  FileEdit,
  Save,
  MessageSquare,
  XSquare,
  Star,
  MoreVertical,
  Zap,
  CopyCheck,
  BarChart3
} from 'lucide-react';
import JSZip from 'jszip';
import { GenerationRecord } from '../lib/firebase';
import { HistoryAnalyticsView } from './HistoryAnalyticsView';

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function sanitizeFolderName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 30);
}

interface HistoryPanelProps {
  history: GenerationRecord[];
  onRevert: (record: GenerationRecord) => void;
  onDuplicateToStudio?: (prompt: string, record: GenerationRecord) => void;
  onToggleFavorite?: (id: string) => Promise<void> | void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onBulkUpdate?: (
    recordIds: string[],
    changes: {
      tagsToAdd?: string[];
      tagsToRemove?: string[];
      replaceAllTags?: string[];
      notes?: string;
      appendNotes?: boolean;
      clearNotes?: boolean;
    }
  ) => Promise<void>;
  onUpdateRecord?: (id: string, updates: Partial<GenerationRecord>) => Promise<void>;
  language: 'th' | 'en';
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userEmail?: string;
}

const PRESET_TAG_SUGGESTIONS = [
  'AgriculturalEng',
  'KinematicDesign',
  'NRRU_Lab',
  'ResearchFigure',
  'CommercialProduct',
  'CAD_Approved',
  'PatentPending',
  'Symposium2026',
  'DraftV1',
  'ISO_Standard'
];

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onRevert,
  onDuplicateToStudio,
  onToggleFavorite,
  onDelete,
  onClearAll,
  onBulkUpdate,
  onUpdateRecord,
  language,
  isOpen,
  onClose,
  isAuthenticated,
  userEmail,
}) => {
  const isThai = language === 'th';
  const [search, setSearch] = useState<string>('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [onlyFavoritesFilter, setOnlyFavoritesFilter] = useState<boolean>(false);
  const [openQuickActionsId, setOpenQuickActionsId] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string | null, string | null]>([null, null]);
  const [activeView, setActiveView] = useState<'list' | 'analytics' | 'compare'>('list');
  const isCompareView = activeView === 'compare';
  const setIsCompareView = (val: boolean) => setActiveView(val ? 'compare' : 'list');
  const [compareSubTab, setCompareSubTab] = useState<'visual' | 'prompt' | 'spec' | 'qa'>('visual');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [hoveredRecord, setHoveredRecord] = useState<GenerationRecord | null>(null);
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number } | null>(null);
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = useState<string>('');
  const [exportSuccessNotice, setExportSuccessNotice] = useState<string | null>(null);

  // Bulk editor states
  const [isBulkEditorOpen, setIsBulkEditorOpen] = useState<boolean>(false);
  const [bulkTagsToAdd, setBulkTagsToAdd] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [tagAction, setTagAction] = useState<'append' | 'replace' | 'remove'>('append');
  const [bulkNotes, setBulkNotes] = useState<string>('');
  const [noteAction, setNoteAction] = useState<'append' | 'replace' | 'clear'>('append');
  const [isSavingBulk, setIsSavingBulk] = useState<boolean>(false);

  // Single record editor states
  const [editingRecord, setEditingRecord] = useState<GenerationRecord | null>(null);
  const [singleTags, setSingleTags] = useState<string[]>([]);
  const [singleTagInput, setSingleTagInput] = useState<string>('');
  const [singleNotes, setSingleNotes] = useState<string>('');
  const [isSavingSingle, setIsSavingSingle] = useState<boolean>(false);

  if (!isOpen) return null;

  // Extract all unique tags present across history
  const allExistingTags = Array.from(
    new Set(
      history
        .flatMap((h) => h.tags || [])
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean)
    )
  );

  const filteredHistory = history.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.prompt.toLowerCase().includes(q) ||
      (item.finalOptimizedPrompt && item.finalOptimizedPrompt.toLowerCase().includes(q)) ||
      item.mode.toLowerCase().includes(q) ||
      (item.commands && item.commands.some((c) => c.toLowerCase().includes(q))) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.visualSpecification?.intent && item.visualSpecification.intent.toLowerCase().includes(q)) ||
      (item.visualSpecification?.subject && item.visualSpecification.subject.toLowerCase().includes(q)) ||
      (item.researchFigure?.apaCaption && item.researchFigure.apaCaption.toLowerCase().includes(q)) ||
      (item.researchFigure?.title && item.researchFigure.title.toLowerCase().includes(q));

    const matchesMode = selectedModeFilter === 'all' || item.mode === selectedModeFilter;

    let matchesTime = true;
    if (selectedTimeFilter !== 'all') {
      const itemTime = new Date(item.createdAt).getTime();
      if (!isNaN(itemTime)) {
        const diff = Date.now() - itemTime;
        if (selectedTimeFilter === '24h') matchesTime = diff <= 24 * 60 * 60 * 1000;
        else if (selectedTimeFilter === '7d') matchesTime = diff <= 7 * 24 * 60 * 60 * 1000;
        else if (selectedTimeFilter === '30d') matchesTime = diff <= 30 * 24 * 60 * 60 * 1000;
      }
    }

    const matchesTag =
      selectedTagFilter === 'all' ||
      (item.tags &&
        item.tags.some(
          (t) => t.replace(/^#/, '').toLowerCase() === selectedTagFilter.toLowerCase()
        ));

    const matchesFavorite = !onlyFavoritesFilter || !!item.isFavorite;

    return matchesSearch && matchesMode && matchesTime && matchesTag && matchesFavorite;
  });

  const isAnyFilterActive =
    search.trim().length > 0 ||
    selectedModeFilter !== 'all' ||
    selectedTimeFilter !== 'all' ||
    selectedTagFilter !== 'all' ||
    onlyFavoritesFilter;

  const resetAllFilters = () => {
    setSearch('');
    setSelectedModeFilter('all');
    setSelectedTimeFilter('all');
    setSelectedTagFilter('all');
    setOnlyFavoritesFilter(false);
  };

  const handleToggleFavoriteRecord = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = history.find((h) => h.id === id);
    const willBeFav = !target?.isFavorite;

    if (onToggleFavorite) {
      await onToggleFavorite(id);
    } else if (onUpdateRecord) {
      await onUpdateRecord(id, { isFavorite: willBeFav });
    }

    setExportSuccessNotice(
      isThai
        ? willBeFav
          ? 'บันทึกเป็นรายการโปรด ⭐ เรียบร้อยแล้ว'
          : 'นำออกจากรายการโปรดแล้ว'
        : willBeFav
        ? 'Marked as Favorite ⭐'
        : 'Removed from Favorites'
    );
    setTimeout(() => setExportSuccessNotice(null), 3000);
  };

  const handleDuplicatePrompt = (record: GenerationRecord, type: 'raw' | 'optimized' = 'raw', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenQuickActionsId(null);

    const promptToUse =
      type === 'optimized' && (record.finalOptimizedPrompt || record.threePassPrompt?.finalOptimizedPrompt)
        ? record.finalOptimizedPrompt || record.threePassPrompt?.finalOptimizedPrompt || record.prompt
        : record.prompt;

    if (onDuplicateToStudio) {
      onDuplicateToStudio(promptToUse, record);
    } else {
      onRevert({
        ...record,
        prompt: promptToUse,
      });
      onClose();
    }
  };

  const handleCopyPromptText = (record: GenerationRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(record.prompt);
    setCopiedPromptId(record.id);
    setExportSuccessNotice(
      isThai ? 'คัดลอกข้อความพรอมต์ลงในคลิปบอร์ดแล้ว' : 'Copied prompt to clipboard'
    );
    setTimeout(() => {
      setCopiedPromptId(null);
      setExportSuccessNotice(null);
    }, 2500);
  };

  const uniqueModes = Array.from(new Set(history.map((h) => h.mode))).filter(Boolean);

  const toggleCompareSelect = (id: string) => {
    if (compareIds[0] === id) {
      setCompareIds([compareIds[1], null]);
    } else if (compareIds[1] === id) {
      setCompareIds([compareIds[0], null]);
    } else if (!compareIds[0]) {
      setCompareIds([id, compareIds[1]]);
    } else if (!compareIds[1]) {
      setCompareIds([compareIds[0], id]);
    } else {
      // Replace slot B by default
      setCompareIds([compareIds[0], id]);
    }
  };

  const swapCompareRecords = () => {
    setCompareIds([compareIds[1], compareIds[0]]);
  };

  const recordA = history.find((h) => h.id === compareIds[0]) || history[0];
  const recordB = history.find((h) => h.id === compareIds[1]) || (history.length > 1 ? history[1] : history[0]);

  // Set default selection if none selected and history has at least 2 items
  const ensureComparisonReady = () => {
    if (!compareIds[0] && history.length > 0) {
      const first = history[0].id;
      const second = history.length > 1 ? history[1].id : history[0].id;
      setCompareIds([first, second]);
    }
    setIsCompareView(true);
  };

  // Extract shared vs unique commands
  const commandsA = recordA?.commands || [];
  const commandsB = recordB?.commands || [];
  const sharedCommands = commandsA.filter((c) => commandsB.includes(c));
  const uniqueCommandsA = commandsA.filter((c) => !commandsB.includes(c));
  const uniqueCommandsB = commandsB.filter((c) => !commandsA.includes(c));

  // Copy structured comparative report to clipboard
  const handleCopyComparativeReport = () => {
    if (!recordA || !recordB) return;
    const report = `=====================================================
GEMINI VISUAL AI OS v5.1 — COMPARATIVE ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}
Institution: Faculty of Industrial Technology, NRRU
=====================================================

--- VERSION A [${recordA.mode}] ---
Timestamp: ${recordA.createdAt}
User Intent: ${recordA.prompt}
QA Verdict: ${recordA.qaStatus} (${recordA.qaSummary})
Aspect Ratio: ${recordA.aspectRatio}
Commands: ${recordA.commands?.join(', ')}
Figure Type: ${recordA.researchFigure?.figureType || 'N/A'}
APA Caption: ${recordA.researchFigure?.apaCaption || 'N/A'}

FINAL OPTIMIZED PROMPT A:
${recordA.finalOptimizedPrompt}

-----------------------------------------------------
--- VERSION B [${recordB.mode}] ---
Timestamp: ${recordB.createdAt}
User Intent: ${recordB.prompt}
QA Verdict: ${recordB.qaStatus} (${recordB.qaSummary})
Aspect Ratio: ${recordB.aspectRatio}
Commands: ${recordB.commands?.join(', ')}
Figure Type: ${recordB.researchFigure?.figureType || 'N/A'}
APA Caption: ${recordB.researchFigure?.apaCaption || 'N/A'}

FINAL OPTIMIZED PROMPT B:
${recordB.finalOptimizedPrompt}

-----------------------------------------------------
--- 3-PASS ARCHITECTURE DELTA ---
Pass 1 Intent (A): ${recordA.threePassPrompt?.pass1Intent || 'N/A'}
Pass 1 Intent (B): ${recordB.threePassPrompt?.pass1Intent || 'N/A'}

Pass 2 Visualization (A): ${recordA.threePassPrompt?.pass2Visualization || 'N/A'}
Pass 2 Visualization (B): ${recordB.threePassPrompt?.pass2Visualization || 'N/A'}

Pass 3 Control (A): ${recordA.threePassPrompt?.pass3Control || 'N/A'}
Pass 3 Control (B): ${recordB.threePassPrompt?.pass3Control || 'N/A'}
=====================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // Toggle single item selection in batch mode
  const toggleBatchSelect = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all currently filtered records
  const handleSelectAllFiltered = () => {
    setSelectedBatchIds(filteredHistory.map((h) => h.id));
  };

  // Deselect all records
  const handleDeselectAll = () => {
    setSelectedBatchIds([]);
  };

  // Export selected batch records as a single ZIP file containing images and JSON metadata
  const handleExportBatchZip = async () => {
    const selectedRecords = history.filter((h) => selectedBatchIds.includes(h.id));
    if (selectedRecords.length === 0) return;

    setIsExportingZip(true);
    setExportProgressText(isThai ? 'กำลังเตรียมไฟล์ข้อมูล...' : 'Preparing metadata files...');

    try {
      const zip = new JSZip();

      // 1. Root MANIFEST / README
      const manifest = {
        generator: 'GEMINI VISUAL AI OS v5.1',
        institution: 'Faculty of Industrial Technology, Nakhon Ratchasima Rajabhat University (NRRU)',
        exportedAt: new Date().toISOString(),
        user: userEmail || 'anonymous',
        recordCount: selectedRecords.length,
        records: selectedRecords.map((r, idx) => ({
          index: idx + 1,
          id: r.id,
          mode: r.mode,
          prompt: r.prompt,
          qaStatus: r.qaStatus,
          aspectRatio: r.aspectRatio,
          figureType: r.researchFigure?.figureType || 'General Visual',
          apaCaption: r.researchFigure?.apaCaption || null,
          commands: r.commands || [],
          createdAt: r.createdAt,
        })),
      };

      zip.file('MANIFEST.json', JSON.stringify(manifest, null, 2));

      const readmeText = `======================================================================
GEMINI VISUAL AI OS v5.1 — RESEARCH & VISUAL GENERATION DATASET
Institution: Faculty of Industrial Technology, Nakhon Ratchasima Rajabhat University
Exported on: ${new Date().toLocaleString()}
User: ${userEmail || 'NRRU Researcher'}
Total Records: ${selectedRecords.length}
======================================================================

This archive contains complete generation records, 3-Pass prompt architectures,
20-variable visual specifications, 50-point QA audit metrics, APA 7th academic
figure captions, and full-resolution visual assets.

CONTENTS:
${selectedRecords
  .map(
    (r, i) =>
      `[${String(i + 1).padStart(2, '0')}] ${r.mode} | ${r.prompt.substring(0, 60)}...\n     QA Verdict: ${r.qaStatus} | Ratio: ${r.aspectRatio}\n     Folder: record_${String(i + 1).padStart(2, '0')}_${r.id}/`
  )
  .join('\n\n')}

Operating Principles:
1. Intent -> Visual Specification -> 3-Pass Prompt -> 50-Point QA -> Generation
2. APA 7th Standard Academic Figure Classification & Provenance Tracking
3. Physical and Engineering Kinematic Plausibility

Faculty of Industrial Technology, NRRU.
`;
      zip.file('README.txt', readmeText);

      // 2. Process each selected record into its own dedicated folder
      for (let i = 0; i < selectedRecords.length; i++) {
        const record = selectedRecords[i];
        const folderNumber = String(i + 1).padStart(2, '0');
        const safePromptSlug = sanitizeFolderName(record.prompt.slice(0, 25) || record.mode);
        const folderName = `record_${folderNumber}_${safePromptSlug}`;
        const folder = zip.folder(folderName);

        if (!folder) continue;

        setExportProgressText(
          isThai
            ? `กำลังรวบรวมรายการที่ ${i + 1}/${selectedRecords.length}...`
            : `Packaging record ${i + 1}/${selectedRecords.length}...`
        );

        // Save complete metadata JSON
        folder.file('metadata.json', JSON.stringify(record, null, 2));

        // Save structured prompt summary
        const promptSummary = `PROMPT SPECIFICATION & 3-PASS SYNTHESIS
========================================
ID: ${record.id}
Mode: ${record.mode}
Created: ${record.createdAt}
Commands: ${record.commands?.join(', ') || 'None'}

USER INTENT:
${record.prompt}

PASS 1: INTENT
${record.threePassPrompt?.pass1Intent || 'N/A'}

PASS 2: VISUALIZATION
${record.threePassPrompt?.pass2Visualization || 'N/A'}

PASS 3: CONTROL
${record.threePassPrompt?.pass3Control || 'N/A'}

FINAL SYNTHESIZED PROMPT:
${record.finalOptimizedPrompt}

NEGATIVE CONSTRAINTS:
${record.threePassPrompt?.negativePrompt || 'None'}

50-POINT QA AUDIT:
Status: ${record.qaStatus}
Summary: ${record.qaSummary}
`;
        folder.file('prompt_specification.txt', promptSummary);

        // Handle Image asset
        if (record.imageUrl) {
          try {
            if (record.imageUrl.startsWith('data:image/svg+xml')) {
              // SVG Data URI
              let svgText = '';
              if (record.imageUrl.includes('utf8,')) {
                svgText = decodeURIComponent(record.imageUrl.split('utf8,')[1]);
              } else if (record.imageUrl.includes('base64,')) {
                svgText = atob(record.imageUrl.split('base64,')[1]);
              } else {
                svgText = decodeURIComponent(record.imageUrl.split(',')[1]);
              }
              folder.file('visual_output.svg', svgText);
            } else if (record.imageUrl.startsWith('data:image/')) {
              // Raster Data URI (PNG / JPEG / WEBP)
              const matches = record.imageUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
              if (matches) {
                const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
                const base64Data = matches[2];
                const binary = base64ToUint8Array(base64Data);
                folder.file(`visual_output.${extension}`, binary, { binary: true });
              }
            } else {
              // Static asset path or URL
              const response = await fetch(record.imageUrl);
              if (response.ok) {
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const ext = record.imageUrl.endsWith('.png')
                  ? 'png'
                  : record.imageUrl.endsWith('.svg')
                  ? 'svg'
                  : 'jpg';
                folder.file(`visual_output.${ext}`, arrayBuffer, { binary: true });
              } else {
                folder.file('visual_notice.txt', `Could not fetch remote image from: ${record.imageUrl}`);
              }
            }
          } catch (imgErr) {
            console.warn(`Could not package image for record ${record.id}:`, imgErr);
            folder.file('visual_notice.txt', `Image processing error: ${imgErr}`);
          }
        } else {
          folder.file('visual_notice.txt', 'No image was generated for this record.');
        }
      }

      setExportProgressText(isThai ? 'กำลังบีบอัดไฟล์ ZIP...' : 'Compressing ZIP archive...');
      const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setExportProgressText(
          isThai
            ? `กำลังบีบอัด... ${metadata.percent.toFixed(0)}%`
            : `Compressing... ${metadata.percent.toFixed(0)}%`
        );
      });

      // Trigger download
      const filename = `nrru_visual_ai_os_batch_${Date.now()}.zip`;
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccessNotice(
        isThai
          ? `ส่งออกไฟล์ ${filename} สำเร็จ (${selectedRecords.length} รายการ)`
          : `Successfully exported ${filename} (${selectedRecords.length} records)`
      );
      setTimeout(() => setExportSuccessNotice(null), 5000);
    } catch (err: any) {
      console.error('Failed to create ZIP package:', err);
      alert(isThai ? `เกิดข้อผิดพลาดในการสร้าง ZIP: ${err.message}` : `Error creating ZIP: ${err.message}`);
    } finally {
      setIsExportingZip(false);
      setExportProgressText('');
    }
  };

  // Tag manipulation helpers for bulk edit
  const handleAddBulkTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !bulkTagsToAdd.includes(clean)) {
      setBulkTagsToAdd([...bulkTagsToAdd, clean]);
      setNewTagInput('');
    }
  };

  const handleRemoveBulkTag = (tagToRemove: string) => {
    setBulkTagsToAdd(bulkTagsToAdd.filter((t) => t !== tagToRemove));
  };

  const handleApplyBulkEdit = async () => {
    if (selectedBatchIds.length === 0 || !onBulkUpdate) return;
    setIsSavingBulk(true);
    try {
      await onBulkUpdate(selectedBatchIds, {
        tagsToAdd: tagAction === 'append' ? bulkTagsToAdd : undefined,
        replaceAllTags: tagAction === 'replace' ? bulkTagsToAdd : undefined,
        tagsToRemove: tagAction === 'remove' ? bulkTagsToAdd : undefined,
        notes: noteAction !== 'clear' ? bulkNotes : undefined,
        appendNotes: noteAction === 'append',
        clearNotes: noteAction === 'clear',
      });
      setExportSuccessNotice(
        isThai
          ? `อัปเดตแท็กและบันทึกสำหรับ ${selectedBatchIds.length} รายการสำเร็จแล้ว!`
          : `Bulk update applied to ${selectedBatchIds.length} records successfully!`
      );
      setTimeout(() => setExportSuccessNotice(null), 5000);
      setIsBulkEditorOpen(false);
      setBulkTagsToAdd([]);
      setBulkNotes('');
    } catch (err: any) {
      console.error('Failed to apply bulk update:', err);
      alert(isThai ? `เกิดข้อผิดพลาดในการอัปเดตกลุ่ม: ${err.message}` : `Error updating records: ${err.message}`);
    } finally {
      setIsSavingBulk(false);
    }
  };

  // Single record edit helpers
  const handleOpenSingleEdit = (record: GenerationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRecord(record);
    setSingleTags(record.tags ? [...record.tags] : []);
    setSingleTagInput('');
    setSingleNotes(record.notes || '');
  };

  const handleAddSingleTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !singleTags.includes(clean)) {
      setSingleTags([...singleTags, clean]);
      setSingleTagInput('');
    }
  };

  const handleRemoveSingleTag = (tagToRemove: string) => {
    setSingleTags(singleTags.filter((t) => t !== tagToRemove));
  };

  const handleSaveSingleEdit = async () => {
    if (!editingRecord || !onUpdateRecord) return;
    setIsSavingSingle(true);
    try {
      await onUpdateRecord(editingRecord.id, {
        tags: singleTags,
        notes: singleNotes,
      });
      setExportSuccessNotice(
        isThai
          ? `บันทึกข้อมูลแท็กและบันทึกวิจัยเรียบร้อยแล้ว`
          : `Saved tags and notes for the record.`
      );
      setTimeout(() => setExportSuccessNotice(null), 5000);
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Failed to save record:', err);
      alert(isThai ? `เกิดข้อผิดพลาดในการบันทึก: ${err.message}` : `Error saving: ${err.message}`);
    } finally {
      setIsSavingSingle(false);
    }
  };

  // Quick note template insertions
  const NOTE_SNIPPETS = isThai
    ? [
        'ผ่านการตรวจสอบแบบจำลองจลนศาสตร์และโครงสร้างกลไกเรียบร้อย',
        'เตรียมนำเสนอต่อคณะกรรมการตรวจประเมินผลงานวิจัย',
        'ภาพเรนเดอร์ต้นแบบเพื่อจัดทำเอกสารคำขอสิทธิบัตร/อนุสิทธิบัตร',
        'รอผลการทดสอบการคัดแยกเมล็ดข้าวเปลือกในห้องปฏิบัติการจริง',
      ]
    : [
        'Kinematic mechanism structure verified with CAD simulation.',
        'Approved by Faculty review committee for symposium presentation.',
        'Aesthetic and dimensional schema for patent application.',
        'Pending empirical laboratory sorting trial calibration.',
      ];

  // 20-variable keys to compare
  const specKeys = [
    { key: 'subject', labelTh: 'หัวข้อหลัก (Subject)', labelEn: 'Subject' },
    { key: 'style', labelTh: 'สไตล์ศิลปะ (Style)', labelEn: 'Style' },
    { key: 'perspective', labelTh: 'มุมมอง (Perspective)', labelEn: 'Perspective' },
    { key: 'camera', labelTh: 'มุมกล้อง (Camera Angle)', labelEn: 'Camera Angle' },
    { key: 'lens', labelTh: 'ทางยาวโฟกัส (Lens)', labelEn: 'Lens' },
    { key: 'lighting', labelTh: 'การจัดแสง (Lighting)', labelEn: 'Lighting' },
    { key: 'composition', labelTh: 'การจัดองค์ประกอบ (Composition)', labelEn: 'Composition' },
    { key: 'material', labelTh: 'วัสดุและพื้นผิว (Materials)', labelEn: 'Materials' },
    { key: 'color', labelTh: 'จานสี (Color Palette)', labelEn: 'Color Palette' },
    { key: 'environment', labelTh: 'สภาพแวดล้อม (Environment)', labelEn: 'Environment' },
    { key: 'depth', labelTh: 'ระยะชัดลึก (Depth of Field)', labelEn: 'Depth of Field' },
    { key: 'aspectRatio', labelTh: 'อัตราส่วนภาพ (Aspect Ratio)', labelEn: 'Aspect Ratio' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-panel-heading"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/85 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-5xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Main Header */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              {activeView === 'analytics' ? (
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
              ) : activeView === 'compare' ? (
                <Columns className="w-4 h-4" aria-hidden="true" />
              ) : (
                <History className="w-4 h-4" aria-hidden="true" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="history-panel-heading" className="text-fluid-h3 font-display font-bold text-white">
                  {activeView === 'analytics'
                    ? isThai ? 'วิเคราะห์แนวโน้มกิจกรรม (Activity Trends)' : 'Activity Trends & Analytics'
                    : activeView === 'compare'
                    ? isThai ? 'หน้าต่างเปรียบเทียบผลลัพธ์แบบเจาะลึก (Side-by-Side Compare)' : 'Side-by-Side Comparative Analysis'
                    : isThai ? 'ประวัติการสร้างภาพ (Generation History)' : 'Generation History Log'}
                </h2>
                <span className="text-xs font-mono text-amber-300 font-semibold tabular-nums">
                  ({history.length})
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Cloud className={`w-3.5 h-3.5 ${isAuthenticated ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                <span>
                  {isAuthenticated
                    ? isThai ? `ซิงก์กับคลาวด์ Firestore (${userEmail})` : `Synced with Firestore (${userEmail})`
                    : isThai ? 'จัดเก็บบนอุปกรณ์ (ลงชื่อเข้าใช้เพื่อซิงก์คลาวด์)' : 'Local cache (Sign in to sync to cloud)'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Switcher Segmented Control */}
            <div
              role="group"
              aria-label={isThai ? 'สลับมุมมองประวัติ' : 'Switch history view'}
              className="flex items-center gap-0.5 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs"
            >
              <button
                type="button"
                onClick={() => setActiveView('list')}
                aria-pressed={activeView === 'list'}
                className={`px-2.5 py-1.5 font-semibold rounded-md transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  activeView === 'list'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <History className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isThai ? 'ประวัติ' : 'Records'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('analytics')}
                aria-pressed={activeView === 'analytics'}
                className={`px-2.5 py-1.5 font-semibold rounded-md transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  activeView === 'analytics'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isThai ? 'กราฟแนวโน้ม' : 'Trends'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  ensureComparisonReady();
                  setActiveView('compare');
                }}
                aria-pressed={activeView === 'compare'}
                className={`px-2.5 py-1.5 font-semibold rounded-md transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  activeView === 'compare'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Columns className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isThai ? 'เปรียบเทียบ' : 'Compare'}</span>
              </button>
            </div>

            {/* Batch ZIP Export Button (List view only) */}
            {activeView === 'list' && (
              <button
                type="button"
                onClick={() => {
                  const nextState = !isBatchMode;
                  setIsBatchMode(nextState);
                  if (nextState && selectedBatchIds.length === 0) {
                    setSelectedBatchIds(filteredHistory.map((h) => h.id));
                  }
                }}
                aria-pressed={isBatchMode}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isBatchMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 hover:text-white'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>
                  {isBatchMode
                    ? isThai ? 'ออกโหมดกลุ่ม' : 'Exit Batch'
                    : isThai ? 'ส่งออก ZIP' : 'Batch ZIP'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={isThai ? 'ปิดหน้าต่างประวัติ' : 'Close history panel'}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-1 focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ANALYTICS & TRENDS VIEW */}
        {activeView === 'analytics' ? (
          <HistoryAnalyticsView
            history={history}
            language={language}
            onFilterByMode={(mode) => {
              setSelectedModeFilter(mode);
              setActiveView('list');
            }}
            onFilterByTag={(tag) => {
              setSelectedTagFilter(tag);
              setActiveView('list');
            }}
            onBackToList={() => setActiveView('list')}
          />
        ) : isCompareView && recordA && recordB ? (
          <div className="flex-1 overflow-y-auto flex flex-col bg-slate-950">
            {/* Compare Control Bar */}
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Selector A */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="font-mono text-amber-400 font-bold">A:</span>
                  <select
                    value={recordA.id}
                    onChange={(e) => setCompareIds([e.target.value, compareIds[1] || recordB.id])}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-500 max-w-[200px] truncate"
                  >
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.mode} — {h.prompt.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  onClick={swapCompareRecords}
                  title={isThai ? 'สลับ Version A และ B' : 'Swap A and B'}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>

                {/* Selector B */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="font-mono text-sky-400 font-bold">B:</span>
                  <select
                    value={recordB.id}
                    onChange={(e) => setCompareIds([compareIds[0] || recordA.id, e.target.value])}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-sky-500 max-w-[200px] truncate"
                  >
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.mode} — {h.prompt.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions: Copy Report & Reverts */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyComparativeReport}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? (isThai ? 'คัดลอกรายงานแล้ว' : 'Report Copied') : (isThai ? 'คัดลอกรายงานวิเคราะห์' : 'Copy Analysis Report')}</span>
                </button>
              </div>
            </div>

            {/* Compare Sub-Tabs Navigation */}
            <div className="px-4 pt-2 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setCompareSubTab('visual')}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  compareSubTab === 'visual'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isThai ? '1. คุณภาพและผลลัพธ์ภาพ (Output Quality)' : '1. Output Quality & Visuals'}</span>
              </button>

              <button
                onClick={() => setCompareSubTab('prompt')}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  compareSubTab === 'prompt'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isThai ? '2. โครงสร้างพร้อมต์ 3-Pass (Prompt Structure)' : '2. 3-Pass Prompt Structure'}</span>
              </button>

              <button
                onClick={() => setCompareSubTab('spec')}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  compareSubTab === 'spec'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isThai ? '3. ตัวแปรข้อกำหนด 20 ข้อ (Spec Delta)' : '3. 20-Variable Spec Delta'}</span>
              </button>

              <button
                onClick={() => setCompareSubTab('qa')}
                className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  compareSubTab === 'qa'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isThai ? '4. รายการตรวจ QA 50 ข้อ (Audit Checklist)' : '4. 50-Point QA Checklist'}</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 p-4 space-y-4">
              {/* SUB-TAB 1: Output Quality & Visual Canvas */}
              {compareSubTab === 'visual' && (
                <div className="space-y-4">
                  {/* Split Visual Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visual A */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            VERSION A: {recordA.mode}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onRevert(recordA);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isThai ? 'ย้อนกลับใช้ A' : 'Restore Version A'}</span>
                        </button>
                      </div>

                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center">
                        {recordA.imageUrl ? (
                          <img
                            src={recordA.imageUrl}
                            alt="Version A Output"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-slate-600 text-xs flex flex-col items-center">
                            <Layers className="w-8 h-8 mb-1" />
                            <span>No Visual Generated</span>
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300">
                          {recordA.aspectRatio}
                        </span>
                      </div>

                      {/* Quality Card A */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">QA Verdict:</span>
                          <span className={`font-semibold px-2 py-0.2 rounded text-[11px] font-mono ${
                            recordA.qaStatus === 'PASS'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {recordA.qaStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Figure Type:</span>
                          <span className="font-mono text-slate-200">
                            {recordA.researchFigure?.figureType || 'General Visual'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Dimension Status:</span>
                          <span className="font-mono text-amber-400">
                            {recordA.technicalDrawing?.dimensionStatus || 'UNCONSTRAINED'}
                          </span>
                        </div>
                        {recordA.researchFigure?.apaCaption && (
                          <div className="pt-1">
                            <span className="text-slate-500 text-[10px] font-mono block">APA 7th Caption:</span>
                            <p className="text-[11px] text-slate-300 italic mt-0.5">
                              {recordA.researchFigure.apaCaption}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual B */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400">
                            VERSION B: {recordB.mode}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onRevert(recordB);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-sky-500 text-slate-950 hover:bg-sky-400 flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isThai ? 'ย้อนกลับใช้ B' : 'Restore Version B'}</span>
                        </button>
                      </div>

                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center">
                        {recordB.imageUrl ? (
                          <img
                            src={recordB.imageUrl}
                            alt="Version B Output"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-slate-600 text-xs flex flex-col items-center">
                            <Layers className="w-8 h-8 mb-1" />
                            <span>No Visual Generated</span>
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300">
                          {recordB.aspectRatio}
                        </span>
                      </div>

                      {/* Quality Card B */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">QA Verdict:</span>
                          <span className={`font-semibold px-2 py-0.2 rounded text-[11px] font-mono ${
                            recordB.qaStatus === 'PASS'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {recordB.qaStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Figure Type:</span>
                          <span className="font-mono text-slate-200">
                            {recordB.researchFigure?.figureType || 'General Visual'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Dimension Status:</span>
                          <span className="font-mono text-sky-400">
                            {recordB.technicalDrawing?.dimensionStatus || 'UNCONSTRAINED'}
                          </span>
                        </div>
                        {recordB.researchFigure?.apaCaption && (
                          <div className="pt-1">
                            <span className="text-slate-500 text-[10px] font-mono block">APA 7th Caption:</span>
                            <p className="text-[11px] text-slate-300 italic mt-0.5">
                              {recordB.researchFigure.apaCaption}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Dual Split Image Slider (if both images exist) */}
                  {recordA.imageUrl && recordB.imageUrl && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                          <SplitSquareVertical className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isThai ? 'ตัวเลื่อนเปรียบเทียบภาพซ้อน (Split Overlay Slider)' : 'Interactive Split Overlay Slider'}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Version A ({100 - sliderPosition}%) / Version B ({sliderPosition}%)
                        </span>
                      </div>

                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 select-none">
                        {/* Image A (Background) */}
                        <img
                          src={recordA.imageUrl}
                          alt="Version A"
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                        {/* Image B (Clipped foreground) */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                        >
                          <img
                            src={recordB.imageUrl}
                            alt="Version B"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>

                        {/* Divider line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-lg pointer-events-none z-10"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-[10px] text-amber-400 shadow-md">
                            ⇄
                          </div>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: 3-Pass Prompt Structure */}
              {compareSubTab === 'prompt' && (
                <div className="space-y-4">
                  {/* Command Tags Formula Diff */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      {isThai ? 'การเปรียบเทียบสูตรคำสั่ง (Command Formula Diff)' : 'Command Tags Composition'}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                          SHARED COMMANDS ({sharedCommands.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {sharedCommands.length === 0 ? (
                            <span className="text-slate-500 italic text-[11px]">None</span>
                          ) : (
                            sharedCommands.map((c) => (
                              <span key={c} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                                {c}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                          UNIQUE TO VERSION A ({uniqueCommandsA.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {uniqueCommandsA.length === 0 ? (
                            <span className="text-slate-500 italic text-[11px]">None</span>
                          ) : (
                            uniqueCommandsA.map((c) => (
                              <span key={c} className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px]">
                                {c}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono text-sky-400 font-semibold block">
                          UNIQUE TO VERSION B ({uniqueCommandsB.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {uniqueCommandsB.length === 0 ? (
                            <span className="text-slate-500 italic text-[11px]">None</span>
                          ) : (
                            uniqueCommandsB.map((c) => (
                              <span key={c} className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono text-[10px]">
                                {c}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Pass Architecture Breakdown */}
                  <div className="space-y-3">
                    {/* Pass 1 Intent */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="font-mono text-amber-400">PASS 1: INTENT (เจตจำนงของภาพ)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-amber-400 block mb-1">Version A</span>
                          <p className="text-slate-200 leading-relaxed">
                            {recordA.threePassPrompt?.pass1Intent || recordA.prompt}
                          </p>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-sky-400 block mb-1">Version B</span>
                          <p className="text-slate-200 leading-relaxed">
                            {recordB.threePassPrompt?.pass1Intent || recordB.prompt}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pass 2 Visualization */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="font-mono text-amber-400">PASS 2: VISUALIZATION (การจำลององค์ประกอบที่ตามองเห็น)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-amber-400 block mb-1">Version A</span>
                          <p className="text-slate-200 leading-relaxed">
                            {recordA.threePassPrompt?.pass2Visualization || 'N/A'}
                          </p>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-sky-400 block mb-1">Version B</span>
                          <p className="text-slate-200 leading-relaxed">
                            {recordB.threePassPrompt?.pass2Visualization || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pass 3 Control */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="font-mono text-amber-400">PASS 3: CONTROL (การควบคุมมุมกล้อง เลนส์ แสง และสไตล์)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-amber-400 block mb-1">Version A</span>
                          <p className="text-slate-200 leading-relaxed">
                            {recordA.threePassPrompt?.pass3Control || 'N/A'}
                          </p>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-sky-400 block mb-1">Version B</span>
                          <p className="text-slate-200 leading-relaxed">
                            {recordB.threePassPrompt?.pass3Control || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Final Prompt Comparison */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                        FINAL SYNTHESIZED PROMPT DELTA
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-amber-400 font-bold text-[10px]">VERSION A ({recordA.finalOptimizedPrompt.length} chars)</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(recordA.finalOptimizedPrompt)}
                              className="text-[10px] text-amber-400 hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <p className="font-mono text-slate-200 text-[11px] leading-relaxed select-all">
                            {recordA.finalOptimizedPrompt}
                          </p>
                        </div>

                        <div className="p-3 rounded bg-sky-950/20 border border-sky-500/30">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-sky-400 font-bold text-[10px]">VERSION B ({recordB.finalOptimizedPrompt.length} chars)</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(recordB.finalOptimizedPrompt)}
                              className="text-[10px] text-sky-400 hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <p className="font-mono text-slate-200 text-[11px] leading-relaxed select-all">
                            {recordB.finalOptimizedPrompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: 20-Variable Spec Delta */}
              {compareSubTab === 'spec' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {isThai ? 'เมทริกซ์เปรียบเทียบตัวแปรข้อกำหนด 20 ข้อ' : '20-Variable Specification Comparison Matrix'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isThai ? 'ไฮไลต์ความต่างอัตโนมัติ' : 'Auto-highlighted differences'}
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                        <tr>
                          <th className="p-2.5 w-1/4">Variable</th>
                          <th className="p-2.5 w-5/12 text-amber-400">Version A ({recordA.mode})</th>
                          <th className="p-2.5 w-5/12 text-sky-400">Version B ({recordB.mode})</th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {specKeys.map(({ key, labelTh, labelEn }) => {
                          const valA = recordA.visualSpecification?.[key] || 'N/A';
                          const valB = recordB.visualSpecification?.[key] || 'N/A';
                          const isMatch = valA === valB;

                          return (
                            <tr key={key} className={isMatch ? 'bg-slate-900/40' : 'bg-amber-500/5'}>
                              <td className="p-2.5 font-medium text-slate-300">
                                {isThai ? labelTh : labelEn}
                              </td>
                              <td className="p-2.5 text-slate-200 font-mono text-[11px]">
                                {valA}
                              </td>
                              <td className="p-2.5 text-slate-200 font-mono text-[11px]">
                                {valB}
                              </td>
                              <td className="p-2.5 text-center font-mono text-[10px]">
                                {isMatch ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    MATCH
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                                    DIFF
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: 50-Point QA Checklist Delta */}
              {compareSubTab === 'qa' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {isThai ? 'การเปรียบเทียบผลตรวจมาตรฐาน 50-Point Visual QA' : '50-Point Visual QA Audit Delta'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* QA A */}
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          AUDIT VERDICT A: {recordA.qaStatus}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {recordA.qaChecks?.length || 0} checks logged
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic bg-slate-900 p-2 rounded">
                        "{recordA.qaSummary}"
                      </p>
                      <div className="space-y-1.5 mt-2 max-h-60 overflow-y-auto">
                        {recordA.qaChecks?.map((check) => (
                          <div key={check.id} className="p-1.5 rounded bg-slate-900 text-xs flex items-center justify-between gap-2">
                            <span className="text-slate-300 font-mono text-[11px]">
                              #{check.id} {check.point}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                              check.status === 'PASS' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {check.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* QA B */}
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-sky-400 font-mono">
                          AUDIT VERDICT B: {recordB.qaStatus}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {recordB.qaChecks?.length || 0} checks logged
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic bg-slate-900 p-2 rounded">
                        "{recordB.qaSummary}"
                      </p>
                      <div className="space-y-1.5 mt-2 max-h-60 overflow-y-auto">
                        {recordB.qaChecks?.map((check) => (
                          <div key={check.id} className="p-1.5 rounded bg-slate-900 text-xs flex items-center justify-between gap-2">
                            <span className="text-slate-300 font-mono text-[11px]">
                              #{check.id} {check.point}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                              check.status === 'PASS' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {check.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* STANDARD HISTORY LIST VIEW */
          <>
            {/* Filter and Search controls */}
            <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60 flex flex-col gap-2.5 shrink-0">
              {/* Row 1: Search Bar & Quick Mode/Clear */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="relative w-full sm:flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      isThai
                        ? 'ค้นหาด้วยคำสำคัญ, พรอมต์, แท็ก, บันทึก หรือ APA Figure...'
                        : 'Search by keyword, prompt, tags, notes, APA figure...'
                    }
                    className="w-full pl-8 pr-8 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      title={isThai ? 'ล้างคำค้นหา' : 'Clear search'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Mode Filter */}
                  <select
                    value={selectedModeFilter}
                    onChange={(e) => setSelectedModeFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">{isThai ? 'ทุกโหมด (All Modes)' : 'All Modes'}</option>
                    {uniqueModes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* Timestamp Range Filter */}
                  <select
                    value={selectedTimeFilter}
                    onChange={(e) => setSelectedTimeFilter(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">{isThai ? 'ทุกช่วงเวลา' : 'All Time'}</option>
                    <option value="24h">{isThai ? '24 ชม. ล่าสุด' : 'Past 24 Hours'}</option>
                    <option value="7d">{isThai ? '7 วันล่าสุด' : 'Past 7 Days'}</option>
                    <option value="30d">{isThai ? '30 วันล่าสุด' : 'Past 30 Days'}</option>
                  </select>

                  {/* Tag Filter (if tags exist) */}
                  {allExistingTags.length > 0 && (
                    <select
                      value={selectedTagFilter}
                      onChange={(e) => setSelectedTagFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all">{isThai ? 'ทุกแท็ก (All Tags)' : 'All Tags'}</option>
                      {allExistingTags.map((t) => (
                        <option key={t} value={t}>
                          #{t}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Favorites Filter Toggle */}
                  <button
                    type="button"
                    onClick={() => setOnlyFavoritesFilter(!onlyFavoritesFilter)}
                    className={`px-2.5 py-1 text-xs rounded border transition-all flex items-center gap-1.5 ${
                      onlyFavoritesFilter
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold shadow-sm shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                    title={isThai ? 'แสดงเฉพาะรายการโปรด' : 'Show favorites only'}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        onlyFavoritesFilter ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="hidden sm:inline">{isThai ? 'รายการโปรด' : 'Favorites'}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        onlyFavoritesFilter
                          ? 'bg-amber-500/30 text-amber-200 border-amber-400/40'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {history.filter((h) => h.isFavorite).length}
                    </span>
                  </button>

                  {/* Trends Shortcut */}
                  <button
                    type="button"
                    onClick={() => setActiveView('analytics')}
                    className="px-2.5 py-1 text-xs rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-all flex items-center gap-1.5"
                    title={isThai ? 'ดูกราฟวิเคราะห์แนวโน้มกิจกรรม 30 วัน' : 'View 30-day activity trends & analytics'}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden md:inline">{isThai ? 'กราฟแนวโน้ม' : 'Trends'}</span>
                  </button>

                  {history.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      title={isThai ? 'ล้างประวัติทั้งหมด' : 'Clear all'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Filter Summary & Reset Button */}
              {isAnyFilterActive && (
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-slate-400 flex-wrap">
                    <Filter className="w-3 h-3 text-amber-400" />
                    <span>
                      {isThai
                        ? `แสดง ${filteredHistory.length} จาก ${history.length} รายการ`
                        : `Showing ${filteredHistory.length} of ${history.length} records`}
                    </span>
                    {onlyFavoritesFilter && (
                      <span className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{isThai ? 'เฉพาะรายการโปรด' : 'Favorites only'}</span>
                      </span>
                    )}
                    {search && (
                      <span className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        "{search}"
                      </span>
                    )}
                    {selectedTagFilter !== 'all' && (
                      <span className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        #{selectedTagFilter}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={resetAllFilters}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>{isThai ? 'ล้างตัวกรอง' : 'Reset filters'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Batch Selection Action Toolbar */}
            {isBatchMode && (
              <div className="px-4 py-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-medium text-amber-300">
                    <PackageCheck className="w-4 h-4 text-amber-400" />
                    <span>
                      {isThai ? 'โหมดเลือกกลุ่ม (Batch Mode):' : 'Batch Selection Mode:'}
                    </span>
                    <span className="font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-amber-200">
                      {selectedBatchIds.length} / {filteredHistory.length} {isThai ? 'รายการ' : 'selected'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleSelectAllFiltered}
                      className="px-2 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <CheckSquare className="w-3 h-3 text-amber-400" />
                      <span>{isThai ? 'เลือกทั้งหมด' : 'Select All'}</span>
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      className="px-2 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Square className="w-3 h-3 text-slate-400" />
                      <span>{isThai ? 'ล้างการเลือก' : 'Deselect All'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {exportProgressText && (
                    <span className="text-[11px] font-mono text-amber-300 animate-pulse flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {exportProgressText}
                    </span>
                  )}

                  {/* Bulk Edit Button */}
                  <button
                    onClick={() => {
                      if (selectedBatchIds.length === 0) {
                        alert(isThai ? 'กรุณาเลือกรายการอย่างน้อย 1 รายการเพื่อแก้ไข' : 'Please select at least 1 record to bulk edit');
                        return;
                      }
                      setIsBulkEditorOpen(true);
                    }}
                    disabled={selectedBatchIds.length === 0}
                    className="px-3.5 py-1.5 rounded-md font-bold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isThai ? 'แก้ไขแท็กและบันทึกวิจัยพร้อมกัน' : 'Bulk edit tags and research notes'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>
                      {isThai
                        ? `แก้ไขกลุ่ม (Tags/Notes) [${selectedBatchIds.length}]`
                        : `Bulk Edit (${selectedBatchIds.length})`}
                    </span>
                  </button>

                  {/* ZIP Export Button */}
                  <button
                    onClick={handleExportBatchZip}
                    disabled={selectedBatchIds.length === 0 || isExportingZip}
                    className="px-3.5 py-1.5 rounded-md font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExportingZip ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isExportingZip
                        ? isThai ? 'กำลังสร้าง ZIP...' : 'Compiling ZIP...'
                        : isThai
                        ? `ส่งออก ZIP (${selectedBatchIds.length})`
                        : `Export ZIP (${selectedBatchIds.length})`}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsBatchMode(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1"
                  >
                    {isThai ? 'เสร็จสิ้น' : 'Done'}
                  </button>
                </div>
              </div>
            )}

            {/* Success Toast Notice */}
            {exportSuccessNotice && (
              <div className="mx-4 mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{exportSuccessNotice}</span>
                </div>
                <button
                  onClick={() => setExportSuccessNotice(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Floating Compare Action Bar if records are selected */}
            {(compareIds[0] || compareIds[1]) && (
              <div className="px-4 py-2.5 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between gap-3 shrink-0 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Columns className="w-4 h-4 text-amber-400" />
                  <span>
                    {compareIds[0] && compareIds[1]
                      ? isThai ? 'เลือกครบ 2 รายการแล้ว พร้อมเปรียบเทียบ!' : '2 items selected — Ready to compare!'
                      : isThai ? 'เลือกอีก 1 รายการเพื่อเริ่มเปรียบเทียบ' : 'Select 1 more item to compare'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {compareIds[0] && compareIds[1] && (
                    <button
                      onClick={() => setIsCompareView(true)}
                      className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs hover:bg-amber-400 transition-colors shadow-sm"
                    >
                      {isThai ? 'เริ่มเปรียบเทียบทันที' : 'Compare Now'}
                    </button>
                  )}
                  <button
                    onClick={() => setCompareIds([null, null])}
                    className="text-slate-400 hover:text-white underline text-[11px]"
                  >
                    {isThai ? 'ยกเลิกการเลือก' : 'Clear selection'}
                  </button>
                </div>
              </div>
            )}

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
              {filteredHistory.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <History className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    {isThai ? 'ยังไม่มีประวัติการสร้างภาพ' : 'No generation history yet'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {isThai
                      ? 'เมื่อคุณสั่งการสร้างภาพหรือสังเคราะห์ข้อกำหนดในสตูดิโอ ประวัติจะถูกบันทึกที่นี่โดยอัตโนมัติ'
                      : 'Executions and image renders in the Studio Console will be logged here automatically.'}
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const isSlotA = compareIds[0] === item.id;
                  const isSlotB = compareIds[1] === item.id;
                  const isSelected = isSlotA || isSlotB;
                  const isBatchSelected = selectedBatchIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoverPos({ top: rect.top, left: rect.left });
                        setHoveredRecord(item);
                      }}
                      onMouseLeave={() => {
                        setHoveredRecord(null);
                        setHoverPos(null);
                      }}
                      onClick={(e) => {
                        if (isBatchMode) {
                          toggleBatchSelect(item.id);
                        }
                      }}
                      className={`p-3.5 rounded-lg border transition-all relative group ${
                        isBatchMode
                          ? isBatchSelected
                            ? 'bg-amber-950/30 border-amber-500/80 shadow-md shadow-amber-500/10 cursor-pointer'
                            : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 cursor-pointer'
                          : isSelected
                          ? isSlotA
                            ? 'bg-amber-950/20 border-amber-500/60 shadow-md shadow-amber-500/5'
                            : 'bg-sky-950/20 border-sky-500/60 shadow-md shadow-sky-500/5'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 w-full sm:w-auto">
                          {/* Batch Checkbox in batch mode */}
                          {isBatchMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBatchSelect(item.id);
                              }}
                              className={`p-1 rounded transition-colors self-center shrink-0 ${
                                isBatchSelected
                                  ? 'text-amber-400 bg-amber-500/20'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {isBatchSelected ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                          )}

                          {/* Thumbnail with hover zoom effect */}
                          <div className="relative w-16 h-16 rounded overflow-hidden border border-slate-800 shrink-0 bg-slate-950 flex items-center justify-center">
                            {item.isFavorite && (
                              <div
                                title={isThai ? 'รายการโปรด' : 'Favorite'}
                                className="absolute top-1 left-1 z-10 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/40"
                              >
                                <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                              </div>
                            )}
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt="Thumbnail"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <Layers className="w-6 h-6" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                            <div className="absolute bottom-0 right-0 px-1 py-0.2 bg-slate-950/90 text-[9px] font-mono text-amber-400/90 rounded-tl">
                              {item.aspectRatio || '16:9'}
                            </div>
                          </div>

                          <div className="space-y-1 overflow-hidden flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                {item.mode}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                  item.qaStatus === 'PASS'
                                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                    : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                }`}
                              >
                                {item.qaStatus}
                              </span>
                              {isSelected && (
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                  isSlotA ? 'bg-amber-500 text-slate-950' : 'bg-sky-500 text-slate-950'
                                }`}>
                                  {isSlotA ? 'SELECTED (A)' : 'SELECTED (B)'}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-200 line-clamp-1 font-medium group-hover:text-amber-200 transition-colors">
                              {item.prompt}
                            </p>

                            <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400">
                              {item.commands?.slice(0, 4).map((c, i) => (
                                <span key={i} className="bg-slate-950 px-1 rounded border border-slate-800">
                                  {c}
                                </span>
                              ))}
                              {item.commands && item.commands.length > 4 && (
                                <span className="text-slate-500">+{item.commands.length - 4}</span>
                              )}
                            </div>

                            {/* Tags display */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {item.tags.map((tag, idx) => {
                                  const clean = tag.replace(/^#/, '');
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTagFilter(clean);
                                      }}
                                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 flex items-center gap-0.5 hover:bg-amber-500/25 hover:border-amber-400/50 transition-colors"
                                      title={isThai ? `คลิกเพื่อกรองด้วย #${clean}` : `Filter by #${clean}`}
                                    >
                                      <Hash className="w-2.5 h-2.5 text-amber-400" />
                                      <span>{clean}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Notes display */}
                            {item.notes && (
                              <div className="mt-1 text-[11px] text-slate-300 bg-slate-950/80 px-2 py-1.5 rounded border border-slate-800/80 flex items-start gap-1.5 max-w-xl">
                                <StickyNote className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                <p className="line-clamp-2 leading-relaxed italic text-slate-300">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center relative">
                          {/* Direct Favorite Star Toggle Button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFavoriteRecord(item.id, e)}
                            title={
                              item.isFavorite
                                ? isThai ? 'นำออกจากรายการโปรด' : 'Remove from Favorites'
                                : isThai ? 'บันทึกเป็นรายการโปรด ⭐' : 'Mark as Favorite ⭐'
                            }
                            className={`p-1.5 rounded transition-all ${
                              item.isFavorite
                                ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                                : 'text-slate-500 hover:text-amber-300 hover:bg-slate-800 border border-transparent'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>

                          {/* Quick Duplicate to Studio Console Button */}
                          <button
                            type="button"
                            onClick={(e) => handleDuplicatePrompt(item, 'raw', e)}
                            title={isThai ? 'ทำซ้ำพรอมต์นี้ไปยัง Studio Console ทันที' : 'Duplicate prompt to Studio Console'}
                            className="px-2 py-1 text-xs font-semibold rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-sky-400" />
                            <span className="hidden sm:inline">{isThai ? 'ทำซ้ำ' : 'Duplicate'}</span>
                          </button>

                          {/* Quick Edit Tags & Notes button */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenSingleEdit(item, e)}
                            title={isThai ? 'แก้ไขแท็กและบันทึก' : 'Edit tags & notes'}
                            className="p-1.5 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>

                          {/* Compare button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompareSelect(item.id);
                            }}
                            title={isThai ? 'เลือกเปรียบเทียบ' : 'Select for compare'}
                            className={`px-2 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
                              isSelected
                                ? isSlotA
                                  ? 'bg-amber-500/25 text-amber-300 border-amber-500 font-bold'
                                  : 'bg-sky-500/25 text-sky-300 border-sky-500 font-bold'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                            }`}
                          >
                            <Columns className="w-3 h-3" />
                            <span className="text-[11px]">
                              {isSlotA ? 'Slot A' : isSlotB ? 'Slot B' : isThai ? 'เลือกเทียบ' : 'Compare'}
                            </span>
                          </button>

                          {/* Revert button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRevert(item);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isThai ? 'ย้อนกลับ' : 'Revert'}</span>
                          </button>

                          {/* Quick Actions Dropdown Trigger */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenQuickActionsId(openQuickActionsId === item.id ? null : item.id);
                              }}
                              title={isThai ? 'เมนูดำเนินการด่วน (Quick Actions)' : 'Quick Actions Menu'}
                              className={`p-1.5 rounded transition-colors border ${
                                openQuickActionsId === item.id
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent hover:border-slate-700'
                              }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu Popover */}
                            {openQuickActionsId === item.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-black/80 z-50 p-1.5 text-xs text-slate-200 animate-in fade-in zoom-in-95"
                              >
                                <div className="px-2.5 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                                  <span>{isThai ? 'เมนูดำเนินการด่วน' : 'QUICK ACTIONS'}</span>
                                  <span className="text-amber-400 truncate max-w-[90px]">{item.mode}</span>
                                </div>

                                <div className="py-1 space-y-0.5">
                                  {/* Duplicate Raw Prompt */}
                                  <button
                                    type="button"
                                    onClick={(e) => handleDuplicatePrompt(item, 'raw', e)}
                                    className="w-full px-2.5 py-1.5 rounded text-left hover:bg-sky-500/15 hover:text-sky-200 flex items-start gap-2 transition-colors group"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                                    <div className="overflow-hidden">
                                      <p className="font-semibold text-slate-200 group-hover:text-sky-200 text-xs">
                                        {isThai ? 'ทำซ้ำพรอมต์ต้นฉบับ' : 'Duplicate Raw Prompt'}
                                      </p>
                                      <p className="text-[10px] text-slate-400 truncate">
                                        "{item.prompt}"
                                      </p>
                                    </div>
                                  </button>

                                  {/* Duplicate Synthesized Prompt */}
                                  {item.finalOptimizedPrompt && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleDuplicatePrompt(item, 'optimized', e)}
                                      className="w-full px-2.5 py-1.5 rounded text-left hover:bg-amber-500/15 hover:text-amber-200 flex items-start gap-2 transition-colors group"
                                    >
                                      <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                      <div className="overflow-hidden">
                                        <p className="font-semibold text-slate-200 group-hover:text-amber-200 text-xs">
                                          {isThai ? 'ทำซ้ำพรอมต์สังเคราะห์ (3-Pass)' : 'Duplicate Synthesized Prompt'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate">
                                          "{item.finalOptimizedPrompt}"
                                        </p>
                                      </div>
                                    </button>
                                  )}

                                  {/* Toggle Favorite */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      handleToggleFavoriteRecord(item.id, e);
                                      setOpenQuickActionsId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded text-left hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-300 hover:text-white"
                                  >
                                    <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                                    <span>
                                      {item.isFavorite
                                        ? isThai ? 'นำออกจากรายการโปรด' : 'Remove from Favorites'
                                        : isThai ? 'บันทึกเป็นรายการโปรด ⭐' : 'Mark as Favorite ⭐'}
                                    </span>
                                  </button>

                                  {/* Copy Prompt to Clipboard */}
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyPromptText(item, e)}
                                    className="w-full px-2.5 py-1.5 rounded text-left hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-300 hover:text-white"
                                  >
                                    {copiedPromptId === item.id ? (
                                      <CopyCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span>
                                      {copiedPromptId === item.id
                                        ? isThai ? 'คัดลอกลงคลิปบอร์ดแล้ว!' : 'Copied to Clipboard!'
                                        : isThai ? 'คัดลอกข้อความพรอมต์' : 'Copy Prompt Text'}
                                    </span>
                                  </button>

                                  {/* Quick Edit Tags & Notes */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      setOpenQuickActionsId(null);
                                      handleOpenSingleEdit(item, e);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded text-left hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-300 hover:text-white"
                                  >
                                    <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{isThai ? 'แก้ไขแท็กและบันทึกวิจัย' : 'Edit Tags & Notes'}</span>
                                  </button>

                                  {/* Full Revert */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenQuickActionsId(null);
                                      onRevert(item);
                                      onClose();
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded text-left hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-300 hover:text-white"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{isThai ? 'ย้อนกลับสถานะทั้งหมด' : 'Revert Full State'}</span>
                                  </button>
                                </div>

                                <div className="pt-1 mt-1 border-t border-slate-800">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenQuickActionsId(null);
                                      onDelete(item.id);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded text-left hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>{isThai ? 'ลบรายการนี้' : 'Delete Record'}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Backdrop to close open quick action menu on outside click */}
              {openQuickActionsId && (
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setOpenQuickActionsId(null)}
                />
              )}

              {/* Floating Hover-Preview Popover Card */}
              {hoveredRecord && (
                <div
                  className="fixed z-[70] w-80 sm:w-96 rounded-xl bg-slate-900/95 border border-amber-500/40 shadow-2xl shadow-black/80 backdrop-blur-md p-3.5 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
                  style={{
                    top: Math.min(
                      Math.max(16, (hoverPos?.top ?? 100) - 40),
                      window.innerHeight - 380
                    ),
                    left: Math.max(
                      16,
                      (hoverPos?.left ?? 400) - 395
                    ),
                  }}
                >
                  {/* Popover Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {hoveredRecord.mode}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(hoveredRecord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Popover Thumbnail */}
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800 mb-2.5 flex items-center justify-center">
                    {hoveredRecord.imageUrl ? (
                      <img
                        src={hoveredRecord.imageUrl}
                        alt="Hover Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center justify-center p-4 text-xs">
                        <Layers className="w-6 h-6 mb-1" />
                        <span>No image rendered</span>
                      </div>
                    )}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300 border border-slate-800">
                      {hoveredRecord.aspectRatio || '16:9'}
                    </div>
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/40">
                      {hoveredRecord.qaStatus}
                    </div>
                  </div>

                  {/* Key Visual Intent Callout */}
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                        {isThai ? 'เจตจำนงภาพหลัก (KEY VISUAL INTENT)' : 'KEY VISUAL INTENT'}
                      </span>
                      <p className="text-slate-200 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                        {hoveredRecord.visualSpecification?.intent ||
                         hoveredRecord.threePassPrompt?.pass1Intent ||
                         hoveredRecord.prompt}
                      </p>
                    </div>

                    {/* Quick Specs Highlight */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">
                          {isThai ? 'มุมมอง / สไตล์' : 'Style & Angle'}
                        </span>
                        <span className="text-slate-200 truncate block font-mono text-[10px]">
                          {hoveredRecord.visualSpecification?.perspective || hoveredRecord.visualSpecification?.style || 'Standard View'}
                        </span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">
                          {isThai ? 'การจัดแสง / เลนส์' : 'Lighting & Lens'}
                        </span>
                        <span className="text-slate-200 truncate block font-mono text-[10px]">
                          {hoveredRecord.visualSpecification?.lighting || hoveredRecord.visualSpecification?.lens || 'Studio Light'}
                        </span>
                      </div>
                    </div>

                    {/* APA Figure Type & Caption if research */}
                    {hoveredRecord.researchFigure?.apaCaption && (
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80 text-[10px]">
                        <span className="text-slate-500 font-mono block">APA 7th Figure:</span>
                        <p className="text-slate-300 italic line-clamp-1 mt-0.5">
                          {hoveredRecord.researchFigure.apaCaption}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Popover Footer Hint */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Double-click or click Revert to load</span>
                    <span className="text-amber-400">PREVIEW MODE</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* BULK EDITOR MODAL */}
      {isBulkEditorOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {isThai ? 'ตัวแก้ไขข้อมูลแบบกลุ่ม (Bulk Editor)' : 'Bulk Record Editor'}
                    <span className="font-mono text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      {selectedBatchIds.length} {isThai ? 'รายการ' : 'records'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isThai
                      ? 'เพิ่มแท็กและบันทึกวิจัยพร้อมกันในทุกรายการที่เลือก'
                      : 'Apply common tags and research annotations across all selected records'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkEditorOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Selected Items Thumbnail Strip */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>{isThai ? 'รายการที่กำลังแก้ไข:' : 'Target Records:'}</span>
                  <span className="font-mono text-[11px] text-amber-400">
                    {selectedBatchIds.length} selected
                  </span>
                </label>
                <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-950/70 rounded-lg border border-slate-800/80">
                  {history
                    .filter((h) => selectedBatchIds.includes(h.id))
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="relative w-14 h-14 rounded-md overflow-hidden border border-slate-700/80 shrink-0 group bg-slate-900"
                        title={rec.prompt}
                      >
                        {rec.imageUrl ? (
                          <img src={rec.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-slate-500">
                            {rec.mode}
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-[8px] font-mono text-amber-300 text-center truncate px-0.5">
                          {rec.mode}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* SECTION 1: TAGS */}
              <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">
                      {isThai ? 'การจัดการแท็ก (Tags Management)' : 'Tags Management'}
                    </span>
                  </div>

                  {/* Tag Action Mode */}
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setTagAction('append')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        tagAction === 'append'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isThai ? '+ เพิ่มต่อท้าย' : 'Append (+)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTagAction('replace')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        tagAction === 'replace'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isThai ? 'แทนที่ทั้งหมด' : 'Replace All'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTagAction('remove')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        tagAction === 'remove'
                          ? 'bg-rose-500 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isThai ? 'ลบแท็ก' : 'Remove'}
                    </button>
                  </div>
                </div>

                {/* Staged Tags Pill List */}
                <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 rounded bg-slate-900 border border-slate-800/80">
                  {bulkTagsToAdd.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">
                      {isThai
                        ? 'ยังไม่ได้เลือกแท็ก — พิมพ์แท็กด้านล่าง หรือคลิกจากรายการแนะนำ'
                        : 'No tags staged yet — type below or click suggested tags'}
                    </span>
                  ) : (
                    bulkTagsToAdd.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${
                          tagAction === 'remove'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        <Hash className="w-3 h-3 text-amber-400" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBulkTag(tag)}
                          className="hover:text-white p-0.5 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Custom Tag Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBulkTag(newTagInput);
                        }
                      }}
                      placeholder={isThai ? 'พิมพ์ชื่อแท็กแล้วกด Enter...' : 'Type tag name & press Enter...'}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-slate-900 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddBulkTag(newTagInput)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isThai ? 'เพิ่มแท็ก' : 'Add'}</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                    {isThai ? 'แท็กแนะนำสำหรับงานวิจัย / สิทธิบัตร:' : 'Suggested Academic & Engineering Tags:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAG_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleAddBulkTag(sug)}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5 text-amber-400" />
                        <span>#{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: RESEARCH NOTES */}
              <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">
                      {isThai ? 'บันทึกและคำอธิบายวิจัย (Research Notes & Annotations)' : 'Research Notes & Annotations'}
                    </span>
                  </div>

                  {/* Note Action Mode */}
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setNoteAction('append')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        noteAction === 'append'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isThai ? '+ เพิ่มต่อท้าย' : 'Append (+)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteAction('replace')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        noteAction === 'replace'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isThai ? 'เขียนทับ' : 'Overwrite'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteAction('clear')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        noteAction === 'clear'
                          ? 'bg-rose-500 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isThai ? 'ล้างบันทึก' : 'Clear'}
                    </button>
                  </div>
                </div>

                {noteAction === 'clear' ? (
                  <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded text-xs text-rose-300">
                    {isThai
                      ? 'บันทึกข้อความของทุกรายการที่เลือกจะถูกล้างทิ้งทั้งหมดเมื่อกดบันทึก'
                      : 'All notes on selected records will be erased upon applying changes.'}
                  </div>
                ) : (
                  <>
                    <textarea
                      value={bulkNotes}
                      onChange={(e) => setBulkNotes(e.target.value)}
                      rows={3}
                      placeholder={
                        isThai
                          ? 'พิมพ์บันทึกวิจัย, ข้อเสนอแนะ หรือหมายเหตุทางเทคนิคเพื่อใส่ลงในทุกรายการที่เลือก...'
                          : 'Enter common research annotations, symposium notes, or technical review comments...'
                      }
                      className="w-full p-2.5 text-xs rounded bg-slate-900 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                    />

                    {/* Quick Snippets */}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                        {isThai ? 'ข้อความด่วนสำหรับบันทึก:' : 'Quick Research Note Templates:'}
                      </span>
                      <div className="space-y-1">
                        {NOTE_SNIPPETS.map((snippet, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (bulkNotes.trim()) {
                                setBulkNotes(`${bulkNotes}\n${snippet}`);
                              } else {
                                setBulkNotes(snippet);
                              }
                            }}
                            className="w-full text-left p-1.5 rounded bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-amber-200 border border-slate-800 flex items-center justify-between gap-2 transition-colors"
                          >
                            <span className="truncate">"{snippet}"</span>
                            <span className="text-[10px] text-amber-400 shrink-0 font-mono">+ {isThai ? 'แทรก' : 'Insert'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsBulkEditorOpen(false)}
                className="px-3.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleApplyBulkEdit}
                disabled={isSavingBulk || (bulkTagsToAdd.length === 0 && !bulkNotes && noteAction !== 'clear')}
                className="px-4 py-2 rounded-md font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingBulk ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span>
                  {isSavingBulk
                    ? isThai ? 'กำลังบันทึก...' : 'Applying...'
                    : isThai
                    ? `บันทึกการเปลี่ยนแปลง (${selectedBatchIds.length} รายการ)`
                    : `Apply Changes to ${selectedBatchIds.length} Records`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE RECORD EDIT MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-[80] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {isThai ? 'แก้ไขแท็กและบันทึกวิจัยเฉพาะรายการ' : 'Edit Record Tags & Notes'}
                </h3>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="flex items-start gap-3 p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="w-12 h-12 rounded bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                  {editingRecord.imageUrl ? (
                    <img src={editingRecord.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-slate-500">
                      {editingRecord.mode}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <span className="font-mono text-xs text-amber-400">{editingRecord.mode}</span>
                  <p className="text-xs text-slate-200 line-clamp-1">{editingRecord.prompt}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(editingRecord.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tags for this single item */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isThai ? 'แท็กของรายการนี้:' : 'Tags for this record:'}</span>
                </label>

                <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 rounded bg-slate-950 border border-slate-800">
                  {singleTags.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">
                      {isThai ? 'ยังไม่มีแท็ก' : 'No tags'}
                    </span>
                  ) : (
                    singleTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      >
                        <Hash className="w-3 h-3 text-amber-400" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSingleTag(tag)}
                          className="hover:text-white p-0.5 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={singleTagInput}
                      onChange={(e) => setSingleTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSingleTag(singleTagInput);
                        }
                      }}
                      placeholder={isThai ? 'เพิ่มแท็ก...' : 'Add tag...'}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddSingleTag(singleTagInput)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs border border-slate-700 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Preset suggestions */}
                <div className="flex flex-wrap gap-1">
                  {PRESET_TAG_SUGGESTIONS.slice(0, 6).map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddSingleTag(sug)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 hover:bg-amber-500/20 text-slate-400 hover:text-amber-200 border border-slate-800 hover:border-amber-500/30 transition-colors"
                    >
                      #{sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes for this single item */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isThai ? 'บันทึกวิจัย / ข้อความกำกับ:' : 'Research Notes & Annotations:'}</span>
                </label>
                <textarea
                  value={singleNotes}
                  onChange={(e) => setSingleNotes(e.target.value)}
                  rows={4}
                  placeholder={
                    isThai
                      ? 'พิมพ์บันทึกเฉพาะสำหรับรายการนี้...'
                      : 'Enter specific research notes for this record...'
                  }
                  className="w-full p-2.5 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleSaveSingleEdit}
                disabled={isSavingSingle}
                className="px-4 py-1.5 rounded-md font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                {isSavingSingle ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isSavingSingle ? (isThai ? 'กำลังบันทึก...' : 'Saving...') : (isThai ? 'บันทึก' : 'Save')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
