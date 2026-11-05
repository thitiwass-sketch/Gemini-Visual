import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Grid, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  Sliders, 
  Info,
  Check,
  Compass
} from 'lucide-react';

interface VisualCanvasProps {
  currentImage: string | null;
  aspectRatio: string;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
  apaCaption?: string;
  figureType?: string;
  isTechnical?: boolean;
  prompt: string;
  language: 'th' | 'en';
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  currentImage,
  aspectRatio,
  isGeneratingImage,
  onGenerateImage,
  apaCaption,
  figureType,
  isTechnical,
  prompt,
  language,
}) => {
  const isThai = language === 'th';
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(isTechnical ?? false);
  const [copied, setCopied] = useState<boolean>(false);

  // Determine aspect ratio class
  let ratioClass = 'aspect-video';
  if (aspectRatio.includes('1:1') || aspectRatio.includes('square')) ratioClass = 'aspect-square max-w-md mx-auto';
  else if (aspectRatio.includes('4:5')) ratioClass = 'aspect-[4/5] max-w-sm mx-auto';
  else if (aspectRatio.includes('3:4')) ratioClass = 'aspect-[3/4] max-w-sm mx-auto';
  else if (aspectRatio.includes('9:16')) ratioClass = 'aspect-[9/16] max-w-xs mx-auto';
  else if (aspectRatio.includes('16:9') || aspectRatio.includes('landscape')) ratioClass = 'aspect-video w-full';
  else if (aspectRatio.includes('a4')) ratioClass = 'aspect-[1/1.414] max-w-md mx-auto';

  const handleCopyCaption = () => {
    if (apaCaption) {
      navigator.clipboard.writeText(apaCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Canvas Tool Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="font-mono font-semibold text-amber-300 tabular-nums">
            RATIO: {aspectRatio || '16:9'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{figureType || (isTechnical ? 'Technical Prototype' : 'Visual Asset')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            aria-pressed={showGridOverlay}
            aria-label={isThai ? 'สลับการแสดงเส้นกริดวิศวกรรม' : 'Toggle engineering grid overlay'}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              showGridOverlay
                ? 'bg-slate-800 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{isThai ? 'กริดเทคนิค' : 'Grid'}</span>
          </button>

          {isTechnical && (
            <button
              type="button"
              onClick={() => setShowDimensions(!showDimensions)}
              aria-pressed={showDimensions}
              aria-label={isThai ? 'สลับการแสดงแกนและมิติสัดส่วน' : 'Toggle coordinate dimensions overlay'}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                showDimensions
                  ? 'bg-slate-800 text-sky-300 border-sky-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{isThai ? 'ระบุแกน/มิติ' : 'Dimensions'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGenerateImage}
            disabled={isGeneratingImage}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isGeneratingImage ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>
              {isGeneratingImage
                ? isThai ? 'กำลังเรนเดอร์...' : 'Generating...'
                : isThai ? 'เรนเดอร์ภาพสด' : 'Render Live Image'}
            </span>
          </button>
        </div>
      </div>

      {/* Visual Display Frame */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2">
        <div className={`relative ${ratioClass} bg-slate-900 rounded overflow-hidden flex items-center justify-center`}>
          {currentImage ? (
            <img
              src={currentImage}
              alt={prompt ? `Visual prototype: ${prompt}` : 'Generated engineering and research visual prototype'}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-3">
                <Layers className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-display font-semibold text-slate-100">
                {isThai ? 'พื้นที่เรนเดอร์ภาพ (Visual Viewport)' : 'Visual Viewport Ready'}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mt-1 leading-relaxed">
                {isThai
                  ? 'กดปุ่ม "เรนเดอร์ภาพสด" เพื่อสั่งการสร้างภาพต้นแบบ หรือเลือกตัวอย่างจากโครงการวิจัย'
                  : 'Click "Render Live Image" to generate a visual prototype or load a research preset.'}
              </p>
            </div>
          )}

          {/* Technical Drawing & Engineering Grid Overlay */}
          {showGridOverlay && (
            <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#38bdf8" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Engineering Dimensions / Crosshair Overlay */}
          {showDimensions && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[10px] font-mono text-sky-300 select-none tabular-nums"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/40">
                  REF: NRRU-TECH-SPEC
                </div>
                <div className="bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/40">
                  AXIS: [X: 0.00, Y: 0.00, Z: 0.00]
                </div>
              </div>

              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-8 h-8 border border-sky-400/50 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                </div>
                <div className="absolute w-12 h-[1px] bg-sky-400/50"></div>
                <div className="absolute h-12 w-[1px] bg-sky-400/50"></div>
              </div>

              <div className="flex justify-between items-end gap-2">
                <div className="bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/40">
                  STATUS: DIMENSIONS PROPOSED
                </div>
                <div className="bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/40">
                  VIEW: ORTHO 30° ISO
                </div>
              </div>
            </div>
          )}
        </div>

        {/* APA 7th Research Caption Block (H3) */}
        {apaCaption && (
          <div className="mt-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 text-slate-300">
              <h3 className="font-display font-semibold text-slate-100 text-xs">
                {isThai ? 'คำบรรยายภาพมาตรฐาน APA 7th (APA 7th Figure Caption)' : 'APA 7th Figure Caption'}
              </h3>
              <button
                type="button"
                onClick={handleCopyCaption}
                aria-label={isThai ? 'คัดลอกคำบรรยายภาพ APA 7th' : 'Copy APA 7th figure caption'}
                className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 hover:text-amber-300 transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                )}
                <span>{copied ? (isThai ? 'คัดลอกแล้ว' : 'Copied') : (isThai ? 'คัดลอก' : 'Copy')}</span>
              </button>
            </div>
            <p className="italic text-slate-200 leading-relaxed">
              {apaCaption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
