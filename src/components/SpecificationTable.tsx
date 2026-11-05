import React from 'react';
import { Camera, Sun, Palette, Compass, Layers, ShieldAlert, Cpu } from 'lucide-react';

interface SpecificationTableProps {
  spec: {
    intent?: string;
    subject?: string;
    purposeAudience?: string;
    composition?: string;
    camera?: string;
    lens?: string;
    perspective?: string;
    lighting?: string;
    color?: string;
    material?: string;
    environment?: string;
    style?: string;
    mood?: string;
    depth?: string;
    typographyText?: string;
    scale?: string;
    technicalConstraints?: string;
    negativeConstraints?: string;
    aspectRatio?: string;
    provenance?: string;
  };
  language: 'th' | 'en';
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({ spec, language }) => {
  const isThai = language === 'th';

  const groups = [
    {
      title: isThai ? '1. แกนหลักและวัตถุประสงค์' : '1. Core Identity & Intent',
      icon: <Compass className="w-4 h-4 text-amber-400" />,
      items: [
        { labelTh: '01 เจตจำนง (Intent)', labelEn: '01 Intent', val: spec.intent },
        { labelTh: '02 วัตถุหลัก (Subject)', labelEn: '02 Subject', val: spec.subject },
        { labelTh: '03 วัตถุประสงค์/กลุ่มเป้าหมาย', labelEn: '03 Purpose & Audience', val: spec.purposeAudience },
        { labelTh: '12 สไตล์การนำเสนอ', labelEn: '12 Style', val: spec.style },
        { labelTh: '13 อารมณ์ภาพ (Mood)', labelEn: '13 Mood', val: spec.mood },
      ],
    },
    {
      title: isThai ? '2. เลนส์ มุมมอง และแสง' : '2. Optics, Camera & Lighting',
      icon: <Camera className="w-4 h-4 text-sky-400" />,
      items: [
        { labelTh: '04 องค์ประกอบภาพ (Composition)', labelEn: '04 Composition', val: spec.composition },
        { labelTh: '05 มุมกล้อง (Camera)', labelEn: '05 Camera Angle', val: spec.camera },
        { labelTh: '06 ชนิดเลนส์ (Lens)', labelEn: '06 Lens Optics', val: spec.lens },
        { labelTh: '07 ทัศนมิติ (Perspective)', labelEn: '07 Perspective', val: spec.perspective },
        { labelTh: '08 การจัดแสง (Lighting)', labelEn: '08 Lighting Model', val: spec.lighting },
        { labelTh: '14 ระยะชัดลึก (Depth)', labelEn: '14 Depth of Field', val: spec.depth },
      ],
    },
    {
      title: isThai ? '3. วัสดุ สี และสภาพแวดล้อม' : '3. Materials, Palette & Scale',
      icon: <Palette className="w-4 h-4 text-emerald-400" />,
      items: [
        { labelTh: '09 จานสี (Color Palette)', labelEn: '09 Color Palette', val: spec.color },
        { labelTh: '10 คุณสมบัติวัสดุ (Material)', labelEn: '10 Material Surface', val: spec.material },
        { labelTh: '11 สภาพแวดล้อม (Environment)', labelEn: '11 Environment', val: spec.environment },
        { labelTh: '16 สัดส่วนและสเกล (Scale)', labelEn: '16 Scale & Ratio', val: spec.scale },
        { labelTh: '19 อัตราส่วนภาพ (Aspect Ratio)', labelEn: '19 Aspect Ratio', val: spec.aspectRatio },
      ],
    },
    {
      title: isThai ? '4. ข้อจำกัด ตัวอักษร และที่มา' : '4. Constraints, Typography & Provenance',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      items: [
        { labelTh: '15 ตัวอักษร/เลเบล (Typography)', labelEn: '15 Typography & Text', val: spec.typographyText },
        { labelTh: '17 ข้อกำหนดทางเทคนิค', labelEn: '17 Technical Constraints', val: spec.technicalConstraints },
        { labelTh: '18 ข้อจำกัดเชิงลบ (Negative)', labelEn: '18 Negative Constraints', val: spec.negativeConstraints },
        { labelTh: '20 แหล่งที่มา (Provenance)', labelEn: '20 Provenance & Protocol', val: spec.provenance },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-fluid-h3 font-display font-semibold text-white">
            {isThai ? 'ตารางข้อกำหนดทางสายตา 20 ข้อ (Visual Specification Engine)' : '20-Variable Visual Specification Engine'}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {isThai
              ? 'แปลงเจตนาเป็นตัวแปรควบคุมที่กำหนดผลลัพธ์ได้อย่างแม่นยำและทำซ้ำได้'
              : 'Translates raw intent into deterministic, reproducible visual control variables.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((grp, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <span aria-hidden="true">{grp.icon}</span>
              <h4 className="text-xs font-display font-semibold text-slate-100">
                {grp.title}
              </h4>
            </div>
            <dl className="space-y-2.5 text-xs">
              {grp.items.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <dt className="text-slate-300 font-medium shrink-0 sm:w-44 tabular-nums">
                    {isThai ? item.labelTh : item.labelEn}
                  </dt>
                  <dd className="text-slate-100 font-mono text-left sm:text-right break-words">
                    {item.val || (isThai ? 'ตามค่าปริยายของระบบ' : 'Default system parameter')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};
