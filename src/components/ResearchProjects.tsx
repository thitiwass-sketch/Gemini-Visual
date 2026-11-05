import React from 'react';
import { RESEARCH_PROJECTS, ResearchPreset } from '../data/visualOsData';
import { GraduationCap, ArrowRight, BookOpen, Layers, CheckCircle, ExternalLink, Cpu } from 'lucide-react';

interface ResearchProjectsProps {
  onLoadProject: (project: ResearchPreset) => void;
  language: 'th' | 'en';
}

export const ResearchProjects: React.FC<ResearchProjectsProps> = ({ onLoadProject, language }) => {
  const isThai = language === 'th';

  const workflowSteps = [
    { code: '/INIT', descTh: 'เริ่มระบบ', descEn: 'Initialize' },
    { code: '/RESEARCH-PROFILE', descTh: 'กำหนดโปรไฟล์วิจัย', descEn: 'Research Profile' },
    { code: '/AUTO-RESEARCH', descTh: 'โหมดวิจัยอัตโนมัติ', descEn: 'Auto Research' },
    { code: '/conceptual-framework', descTh: 'กรอบแนวคิด', descEn: 'Framework' },
    { code: '/research-figure', descTh: 'สร้างภาพวิจัย', descEn: 'Research Figure' },
    { code: '/AUTO-ENGINEERING', descTh: 'วิศวกรรมระบบ', descEn: 'Auto Engineering' },
    { code: '/technical-drawing', descTh: 'แบบวิศวกรรม', descEn: 'Tech Drawing' },
    { code: '/front-view + /side-view + /top-view', descTh: 'ฉาย 3 ด้าน', descEn: '3 Ortho Views' },
    { code: '/exploded-view', descTh: 'ภาพแยกชิ้นส่วน', descEn: 'Exploded View' },
    { code: '/material-board', descTh: 'กำหนดวัสดุ', descEn: 'Materials' },
    { code: '/presentation', descTh: 'สไลด์นำเสนอ', descEn: 'Presentation' },
    { code: '/academic', descTh: 'เกณฑ์วิชาการ APA 7', descEn: 'Academic APA' },
    { code: '/qa', descTh: 'ตรวจ 50 QA', descEn: '50-Point QA' },
    { code: '/refine', descTh: 'ปรับแต่งให้สมบูรณ์', descEn: 'Refinement' },
    { code: '/FINAL-CHECK', descTh: 'อนุมัติการเผยแพร่', descEn: 'Final Approval' },
  ];

  return (
    <div className="space-y-8">
      {/* Creator & Institution Profile (H2) */}
      <section
        aria-labelledby="research-architect-heading"
        className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="shrink-0">
            <img
              src="/src/assets/images/avatar_researcher_nrru_1790215803748.jpg"
              alt={
                isThai
                  ? 'ภาพถ่ายอาจารย์ฐิติวัสส์ กาญจนพิมาย คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครราชสีมา'
                  : 'Portrait of Lecturer Thitiwas Kanjanaphimai, Faculty of Industrial Technology, NRRU'
              }
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/60"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="research-architect-heading" className="text-fluid-h2 font-display font-bold text-white">
                {isThai ? 'อาจารย์ฐิติวัสส์ กาญจนพิมาย' : 'Lecturer Thitiwas Kanjanaphimai'}
              </h2>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-xs font-mono font-semibold text-amber-300">
                SYSTEM ARCHITECT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isThai
                ? 'คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครราชสีมา (NRRU)'
                : 'Faculty of Industrial Technology, Nakhon Ratchasima Rajabhat University (NRRU)'}
            </p>
            <p className="text-xs text-slate-200 mt-2 max-w-2xl leading-relaxed">
              {isThai
                ? 'ระบบพัฒนาขึ้นเพื่อบูรณาการปัญญาประดิษฐ์ด้านภาพ (Visual Intelligence) เข้ากับตรรกะการวิจัยสากล (Research Logic First) และการเขียนแบบวิศวกรรมความแม่นยำสูง (Precision Engineering)'
                : 'Pioneering the integration of visual generative intelligence with empirical research logic, strict APA 7th academic standards, and mechanical engineering drafting.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 self-stretch md:self-auto text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-300 block text-xs">{isThai ? 'รากฐานระบบ:' : 'System Architecture:'}</span>
            <span className="font-mono text-slate-100 font-semibold">Academic Research → Visual Spec Engine</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-300 block text-xs">{isThai ? 'เป้าหมายหลัก:' : 'Guiding Principle:'}</span>
            <span className="text-amber-300 font-semibold">{isThai ? 'Evidence First · ความสัตย์จริงของข้อมูล' : 'Evidence First · Empirical Rigor'}</span>
          </div>
        </div>
      </section>

      {/* Recommended Research Projects Workflow Grid (H2) */}
      <section aria-labelledby="research-pipeline-heading" className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h2 id="research-pipeline-heading" className="text-fluid-h2 font-display font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400 shrink-0" aria-hidden="true" />
            <span>
              {isThai
                ? 'กระบวนการวิจัยและออกแบบทางวิศวกรรมมาตรฐาน (Standard Research & Engineering Pipeline)'
                : 'Standard Academic Research & Engineering Workflow'}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {isThai
              ? 'ลำดับขั้นการทำงาน 15 ขั้นตอนสำหรับโครงการวิจัยเทคโนโลยีอุตสาหกรรม'
              : 'Sequential 15-step operational pipeline for industrial technology publications.'}
          </p>
        </div>

        {/* Responsive Wrapping Grid (No Horizontal Clipping) */}
        <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {workflowSteps.map((step, idx) => (
            <li
              key={idx}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between"
            >
              <span className="text-[11px] font-mono text-slate-300 tabular-nums block mb-1">
                {String(idx + 1).padStart(2, '0')}.
              </span>
              <span className="font-mono text-xs font-semibold text-amber-300 break-words block">
                {step.code}
              </span>
              <span className="text-xs text-slate-200 mt-1 block">
                {isThai ? step.descTh : step.descEn}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 Core Research Projects (H2 -> H3) */}
      <section aria-labelledby="nrru-case-studies-heading" className="space-y-4">
        <div>
          <h2 id="nrru-case-studies-heading" className="text-fluid-h2 font-display font-bold text-white">
            {isThai ? 'ตัวอย่างโครงการวิจัยคณะเทคโนโลยีอุตสาหกรรม NRRU' : 'NRRU Industrial Technology Research Case Studies'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {isThai
              ? 'โครงการต้นแบบที่ผ่านการสังเคราะห์ข้อกำหนดภาพและมาตรฐาน 50-Point QA เรียบร้อยแล้ว'
              : 'Empirically audited design specifications ready for instant simulation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {RESEARCH_PROJECTS.map((proj) => (
            <article
              key={proj.id}
              className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={proj.imagePath}
                    alt={`${proj.titleEn} — ${proj.titleTh}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300 font-semibold">{proj.autoMode}</span>
                    <span className="text-slate-200">{proj.figureType}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-fluid-h3 font-display font-bold text-white">
                      {isThai ? proj.titleTh : proj.titleEn}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isThai ? proj.titleEn : proj.titleTh}
                    </p>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {isThai ? proj.defaultPromptTh : proj.defaultPromptEn}
                  </p>

                  {/* Commands metadata */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-amber-300">
                    {proj.commands.map((cmd, i) => (
                      <React.Fragment key={i}>
                        <span>{cmd}</span>
                        {i < proj.commands.length - 1 && (
                          <span className="text-slate-500" aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* APA Caption */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 italic leading-relaxed">
                    {isThai ? proj.apaCaptionTh : proj.apaCaptionEn}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onLoadProject(proj)}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <span>{isThai ? 'นำเข้าสตูดิโอคอนโซล' : 'Load into Studio Console'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
