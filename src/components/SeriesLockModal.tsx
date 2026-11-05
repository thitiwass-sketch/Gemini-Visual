import React from 'react';
import { Lock, Unlock, Check, ShieldCheck, Sparkles, X } from 'lucide-react';

export interface SeriesLockState {
  enabled: boolean;
  style: string;
  palette: string;
  cameraLanguage: string;
  lensLanguage: string;
  lightingLanguage: string;
  materialLanguage: string;
  typography: string;
  backgroundLogic: string;
  subjectProportions: string;
  brandElements: string;
}

interface SeriesLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockState: SeriesLockState;
  setLockState: React.Dispatch<React.SetStateAction<SeriesLockState>>;
  language: 'th' | 'en';
}

export const SeriesLockModal: React.FC<SeriesLockModalProps> = ({
  isOpen,
  onClose,
  lockState,
  setLockState,
  language,
}) => {
  if (!isOpen) return null;
  const isThai = language === 'th';

  const handleToggle = () => {
    setLockState((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleChange = (key: keyof SeriesLockState, val: string) => {
    setLockState((prev) => ({ ...prev, [key]: val }));
  };

  const lockFields: {
    key: keyof Omit<SeriesLockState, 'enabled'>;
    id: string;
    labelTh: string;
    labelEn: string;
    placeholder: string;
  }[] = [
    {
      key: 'style',
      id: 'series-lock-style',
      labelTh: '01. สไตล์ศิลปะ (Style Lock)',
      labelEn: '01. Style Lock',
      placeholder: 'e.g. Modern Industrial Precision / Blueprint',
    },
    {
      key: 'palette',
      id: 'series-lock-palette',
      labelTh: '02. จานสีประจำตัว (Palette Lock)',
      labelEn: '02. Palette Lock',
      placeholder: 'e.g. Cobalt Cyan, Slate Charcoal, Warm Amber',
    },
    {
      key: 'cameraLanguage',
      id: 'series-lock-camera',
      labelTh: '03. ภาษาและมุมกล้อง (Camera Language)',
      labelEn: '03. Camera Language',
      placeholder: 'e.g. Eye-level, 3/4 isometric perspective',
    },
    {
      key: 'lensLanguage',
      id: 'series-lock-lens',
      labelTh: '04. ทางยาวโฟกัส (Lens Language)',
      labelEn: '04. Lens Language',
      placeholder: 'e.g. 50mm natural vision, deep f/8 sharpness',
    },
    {
      key: 'lightingLanguage',
      id: 'series-lock-lighting',
      labelTh: '05. การจัดแสง (Lighting Language)',
      labelEn: '05. Lighting Language',
      placeholder: 'e.g. Studio soft key light with subtle rim highlight',
    },
    {
      key: 'materialLanguage',
      id: 'series-lock-material',
      labelTh: '06. คุณสมบัติวัสดุ (Material Language)',
      labelEn: '06. Material Language',
      placeholder: 'e.g. Powder-coated steel, brushed titanium',
    },
    {
      key: 'typography',
      id: 'series-lock-typography',
      labelTh: '07. ตัวอักษรและป้ายกำกับ (Typography Language)',
      labelEn: '07. Typography Language',
      placeholder: 'e.g. Clean technical sans-serif, Sarabun / Plus Jakarta',
    },
    {
      key: 'backgroundLogic',
      id: 'series-lock-background',
      labelTh: '08. ตรรกะฉากหลัง (Background Logic)',
      labelEn: '08. Background Logic',
      placeholder: 'e.g. Seamless slate neutral studio with blueprint grid',
    },
    {
      key: 'subjectProportions',
      id: 'series-lock-proportions',
      labelTh: '09. สัดส่วนและสเกล (Subject Proportions)',
      labelEn: '09. Subject Proportions',
      placeholder: 'e.g. 1:1 physically accurate mechanical scale',
    },
    {
      key: 'brandElements',
      id: 'series-lock-brand',
      labelTh: '10. เอกลักษณ์แบรนด์/สถาบัน (Brand / Institution)',
      labelEn: '10. Brand / Institution Elements',
      placeholder: 'e.g. NRRU Faculty of Industrial Technology seal',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="series-lock-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="series-lock-modal-title" className="text-fluid-h2 font-display font-bold text-white">
                {isThai ? 'กลไกล็อกความสม่ำเสมอของชุดภาพ (Series Consistency Engine)' : 'Series Consistency Lock Engine'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isThai
                  ? 'ล็อก 10 คุณลักษณะภาพเพื่อให้ทุกการสร้างภาพในอนาคตมีสไตล์และเอกลักษณ์เดียวกัน'
                  : 'Locks 10 visual attributes to enforce absolute identity consistency across multiple generations.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isThai ? 'ปิดหน้าต่างการตั้งค่า Series Lock' : 'Close Series Consistency Lock modal'}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-slate-950 border border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            {lockState.enabled ? (
              <Lock className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
            ) : (
              <Unlock className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
            )}
            <div>
              <span className="text-sm font-display font-semibold text-white block">
                {lockState.enabled
                  ? isThai ? 'สถานะ: ล็อกความสม่ำเสมอเปิดใช้งานอยู่ (ACTIVE)' : 'Series Lock: ACTIVE'
                  : isThai ? 'สถานะ: ปิดการล็อก (DISABLED)' : 'Series Lock: DISABLED'}
              </span>
              <span className="text-xs text-slate-300">
                {isThai
                  ? 'พร้อมต์และข้อกำหนดทางสายตาทั้งหมดจะสืบทอดคุณสมบัติที่ล็อกไว้อัตโนมัติ'
                  : 'All subsequent prompts will automatically inherit locked parameters.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            aria-pressed={lockState.enabled}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 ${
              lockState.enabled
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {lockState.enabled ? (isThai ? 'ปิดใช้งาน' : 'Disable Lock') : (isThai ? 'เปิดใช้งาน' : 'Enable Lock')}
          </button>
        </div>

        {/* 10 Lock Variables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lockFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-xs font-semibold text-slate-200 mb-1.5 tabular-nums">
                {isThai ? field.labelTh : field.labelEn}
              </label>
              <input
                id={field.id}
                type="text"
                value={lockState[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {isThai ? 'บันทึกและปิด' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
