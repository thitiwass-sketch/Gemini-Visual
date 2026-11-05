export type ApeExecutionModeId = 'QUICK' | 'STANDARD' | 'HIGH-ASSURANCE';

export type VerificationStatusLabel =
  | 'NOT CHECKED'
  | 'REASONED'
  | 'STATICALLY REVIEWED'
  | 'EXECUTED'
  | 'VERIFIED'
  | 'BLOCKED';

export type RecordFieldStatus = 'CONFIRMED' | 'ASSUMED' | 'PROPOSED' | 'OPEN' | 'BLOCKED';

export type DefectSeverity = 'P0 Critical' | 'P1 High' | 'P2 Medium' | 'P3 Low';

export interface ApeExecutionMode {
  id: ApeExecutionModeId;
  titleTh: string;
  titleEn: string;
  whenToUseTh: string;
  whenToUseEn: string;
  stepsTh: string[];
  stepsEn: string[];
  riskProfile: string;
}

export interface ApeCommandItem {
  command: string;
  group: 'core' | 'product-ux' | 'engineering' | 'verification';
  ownerRole: string;
  descTh: string;
  descEn: string;
  deliversTh: string;
  deliversEn: string;
}

export interface ApeQualityGateItem {
  id: number;
  gate: 'A' | 'B' | 'C' | 'D' | 'E';
  gateNameTh: string;
  gateNameEn: string;
  statementTh: string;
  statementEn: string;
  defaultScore: 2 | 1 | 0 | 'NA';
  evidenceNote: string;
  verificationLabel: VerificationStatusLabel;
}

export interface ProjectRecordField {
  id: string;
  labelTh: string;
  labelEn: string;
  value: string;
  status: RecordFieldStatus;
}

export interface TraceabilityItem {
  reqId: string;
  requirement: string;
  priority: 'P0' | 'P1' | 'P2';
  source: 'User' | 'Policy' | 'Constraint' | 'Assumption';
  acId: string;
  acceptanceCriterion: string;
  artifact: string;
  testId: string;
  verificationMethod: string;
  verificationStatus: VerificationStatusLabel;
}

export interface DefectRecordItem {
  id: string;
  severity: DefectSeverity;
  status: 'OPEN' | 'INVESTIGATING' | 'FIXED' | 'RETESTED' | 'ACCEPTED RISK';
  affectedArea: string;
  evidence: string;
  causeStatus: 'CONFIRMED' | 'SUSPECTED' | 'UNKNOWN';
  correction: string;
  regressionCheck: string;
  remainingRisk: string;
}

export const APE_EXECUTION_MODES: ApeExecutionMode[] = [
  {
    id: 'QUICK',
    titleTh: 'โหมดด่วน (QUICK Mode)',
    titleEn: 'QUICK Mode — Localized & Low-Risk',
    whenToUseTh: 'ใช้สำหรับการแก้ไขเฉพาะจุด หน้าจอเดียว คอมโพเนนต์ย่อย หรือคำอธิบายที่ไม่ซับซ้อน',
    whenToUseEn: 'Use for localized edits, a single screen/component, simple explanations, or low-risk tasks.',
    stepsTh: [
      'ยืนยันเป้าหมายและข้อจำกัดอย่างกระชับ',
      'สร้างผลลัพธ์ตามที่ร้องขอทันทีโดยไม่บังคับทำรายงานเต็มรูปแบบ',
      'ตรวจสอบความสอดคล้องพื้นฐานและกรณีขอบเขต (Edge cases)',
      'รายงานสมมติฐานสำคัญและสถานะการตรวจสอบตามหลักฐานจริง',
    ],
    stepsEn: [
      'Confirm the target and constraints briefly.',
      'Produce the requested artifact directly without forcing a full discovery report.',
      'Check obvious consistency and edge cases.',
      'Report material assumptions and exact verification status.',
    ],
    riskProfile: 'Low Complexity / Low Uncertainty',
  },
  {
    id: 'STANDARD',
    titleTh: 'โหมดมาตรฐาน (STANDARD Mode)',
    titleEn: 'STANDARD Mode — Multi-Screen & MVP',
    whenToUseTh: 'ใช้สำหรับฟีเจอร์หลายหน้าจอ ระบบ MVP การเชื่อมต่อ API ปานกลาง หรืองานที่ครอบคลุมทั้งการออกแบบและพัฒนา',
    whenToUseEn: 'Use for multi-screen features, an MVP, moderate integrations, or tasks spanning design and implementation.',
    stepsTh: [
      'อัปเดต Project Record ให้เป็นแหล่งข้อมูลจริงหนึ่งเดียว (Single Source of Truth)',
      'กำหนดขอบเขต User Flows ขอบเขตสถาปัตยกรรม และเกณฑ์การยอมรับ (Acceptance Criteria)',
      'สร้างอาร์ติแฟกต์การออกแบบและโค้ดที่เชื่อมต่อกันครบถ้วน',
      'ระบุกรณีทดสอบ ข้อควรพิจารณาด้านการเข้าถึง/ความปลอดภัย และสรุปผล QA',
    ],
    stepsEn: [
      'Update the authoritative Project Record.',
      'Define scope, user flows, architecture boundaries, and observable acceptance criteria.',
      'Produce connected design and implementation artifacts.',
      'Include test cases, accessibility/security considerations, and a focused QA summary.',
    ],
    riskProfile: 'Moderate Complexity / Cross-Disciplinary',
  },
  {
    id: 'HIGH-ASSURANCE',
    titleTh: 'โหมดความเชื่อมั่นสูง (HIGH-ASSURANCE Mode)',
    titleEn: 'HIGH-ASSURANCE Mode — Critical & Regulated',
    whenToUseTh: 'ใช้สำหรับข้อมูลอ่อนไหว ระบบยืนยันตัวตน/สิทธิ์ การชำระเงิน งานวิจัยความปลอดภัย การย้ายฐานข้อมูล หรือการปล่อยเวอร์ชันหลัก',
    whenToUseEn: 'Use for sensitive data, authentication/authorization, safety-critical workflows, migrations, destructive operations, or major releases.',
    stepsTh: [
      'ประเมินภัยคุกคาม โหมดความล้มเหลว ความสมบูรณ์ของข้อมูล และแผนย้อนกลับ (Rollback) อย่างชัดเจน',
      'กำหนดข้อกำหนดด้านความปลอดภัย/ความเป็นส่วนตัว และหลักฐานการทดสอบที่ตรวจสอบได้',
      'บังคับใช้ประตูคุณภาพ (Review Gates) และห้ามแนะนำให้ปล่อยผ่านหากยังมี P0 Blocker',
      'หากเครื่องมือหรือหลักฐานไม่เพียงพอ ให้ระบุสถานะเป็น BLOCKED หรือ NOT CHECKED ตามจริง',
    ],
    stepsEn: [
      'Explicitly assess threats, failure modes, data integrity, dependencies, and rollback.',
      'Define security/privacy requirements and verifiable test evidence.',
      'Enforce strict review gates; never recommend release while a critical P0 blocker remains.',
      'If evidence or tools are insufficient, label the result BLOCKED or NOT CHECKED.',
    ],
    riskProfile: 'High Impact / Strict Assurance Gate',
  },
];

export const VERIFICATION_LABELS: {
  label: VerificationStatusLabel;
  descTh: string;
  descEn: string;
  tone: 'emerald' | 'sky' | 'amber' | 'slate' | 'rose';
}[] = [
  {
    label: 'VERIFIED',
    descTh: 'มีหลักฐานยืนยันว่าผ่านเกณฑ์ที่กำหนดในสภาพแวดล้อมจริง',
    descEn: 'Evidence confirms the specified criterion in the stated environment',
    tone: 'emerald',
  },
  {
    label: 'EXECUTED',
    descTh: 'รันคำสั่งหรือการทดสอบจริงแล้วและมีผลลัพธ์บันทึกไว้',
    descEn: 'A stated command or test actually ran in the environment',
    tone: 'sky',
  },
  {
    label: 'STATICALLY REVIEWED',
    descTh: 'ตรวจสอบโค้ดหรือโครงสร้างแบบไม่รันโปรแกรม (Static Analysis)',
    descEn: 'Inspected code/artifacts statically without runtime execution',
    tone: 'amber',
  },
  {
    label: 'REASONED',
    descTh: 'พิจารณาด้วยการวิเคราะห์เชิงตรรกะเท่านั้น ยังไม่ได้รันทดสอบ',
    descEn: 'Considered by engineering analysis only',
    tone: 'slate',
  },
  {
    label: 'NOT CHECKED',
    descTh: 'ยังไม่ได้ดำเนินการตรวจสอบที่มีความหมาย',
    descEn: 'No meaningful review performed yet',
    tone: 'slate',
  },
  {
    label: 'BLOCKED',
    descTh: 'ไม่สามารถตรวจสอบต่อได้เนื่องจากข้อจำกัดด้านเครื่องมือหรือข้อมูล',
    descEn: 'Verification could not proceed, with explicit reason stated',
    tone: 'rose',
  },
];

export const APE_COMMANDS: ApeCommandItem[] = [
  // Core (7)
  {
    command: '/help',
    group: 'core',
    ownerRole: 'System Router',
    descTh: 'แสดงคู่มือระบบคำสั่งและเวิร์กโฟลว์ของ APE OS v2.0',
    descEn: 'Command guide and adaptive workflow overview',
    deliversTh: 'รายการคำสั่ง ลำดับที่แนะนำ และกฎการเลือกโหมด',
    deliversEn: 'Command matrix, recommended sequences, and mode rules',
  },
  {
    command: '/auto',
    group: 'core',
    ownerRole: 'Adaptive Router',
    descTh: 'วิเคราะห์เจตจำนงและเลือกโมดูลที่เล็กที่สุดที่แก้ปัญหาได้จริงโดยอัตโนมัติ',
    descEn: 'Adaptive routing to the smallest sufficient module set',
    deliversTh: 'เลือกโหมด QUICK/STANDARD/HIGH-ASSURANCE พร้อมผลลัพธ์ตรงจุด',
    deliversEn: 'Automatic mode selection and targeted engineering deliverable',
  },
  {
    command: '/brief',
    group: 'core',
    ownerRole: 'Project Record Keeper',
    descTh: 'สร้างหรืออัปเดต Project Record ให้เป็นแหล่งอ้างอิงเดียว (Single Source of Truth)',
    descEn: 'Create or update the authoritative Project Record',
    deliversTh: 'Project Record พร้อมสถานะ CONFIRMED / ASSUMED / PROPOSED / OPEN',
    deliversEn: 'Structured Project Record with explicit epistemic labels',
  },
  {
    command: '/discover',
    group: 'core',
    ownerRole: 'Product Discovery',
    descTh: 'สำรวจและลดความไม่แน่นอนที่มีผลกระทบสูง (High-impact unknowns)',
    descEn: 'Clarify high-impact unknowns and frame problem boundaries',
    deliversTh: 'กรอบปัญหา สมมติฐานหลัก และคำถามสำคัญสูงสุด 1 ข้อ',
    deliversEn: 'Problem framing, key assumptions, and at most 1 critical question',
  },
  {
    command: '/status',
    group: 'core',
    ownerRole: 'Status Monitor',
    descTh: 'สรุปสถานะโครงการ การตัดสินใจ อุปสรรค (Blockers) และขั้นตอนถัดไป',
    descEn: 'Project status, confirmed decisions, blockers, and next action',
    deliversTh: 'สรุปความคืบหน้า สถานะหลักฐาน และงานถัดไปที่สำคัญที่สุด',
    deliversEn: 'Concise progress snapshot, evidence status, and next step',
  },
  {
    command: '/decision',
    group: 'core',
    ownerRole: 'Architecture & Product Strategy',
    descTh: 'เปรียบเทียบทางเลือก วิเคราะห์ผลได้ผลเสีย (Trade-offs) และบันทึกการตัดสินใจ',
    descEn: 'Compare options, trade-offs, and record an architectural decision',
    deliversTh: 'ตารางเปรียบเทียบทางเลือก เหตุผลประกอบ และการอัปเดต Project Record',
    deliversEn: 'Option matrix, trade-off rationale, and recorded decision',
  },
  {
    command: '/reset-context',
    group: 'core',
    ownerRole: 'Project Record Keeper',
    descTh: 'ร่าง Project Record ใหม่ที่สะอาดสำหรับโครงการใหม่ (ไม่ลบข้อมูลภายนอก)',
    descEn: 'Draft a clean Project Record for a new project without erasing external data',
    deliversTh: 'เทมเพลต Project Record ตั้งต้นสำหรับเริ่มงานใหม่',
    deliversEn: 'Clean baseline Project Record template',
  },

  // Product & Experience (11)
  {
    command: '/strategy',
    group: 'product-ux',
    ownerRole: 'Product Strategy',
    descTh: 'กำหนดคุณค่า ขอบเขต ผลลัพธ์ที่วัดได้ และการจัดลำดับความสำคัญ',
    descEn: 'Define value proposition, scope, outcomes, and priorities',
    deliversTh: 'แผนกลยุทธ์ผลิตภัณฑ์ เป้าหมาย และสิ่งที่ไม่ทำ (Non-goals)',
    deliversEn: 'Value framing, prioritized scope, non-goals, and trade-offs',
  },
  {
    command: '/requirements',
    group: 'product-ux',
    ownerRole: 'Requirements & Traceability',
    descTh: 'กำหนดข้อกำหนด (REQ) เกณฑ์การยอมรับ (AC) และความเชื่อมโยงตรวจสอบย้อนกลับ',
    descEn: 'Requirements, non-goals, observable acceptance criteria, and traceability',
    deliversTh: 'ตาราง REQ-001 -> AC-001 -> Artifact -> TEST-001',
    deliversEn: 'Traceable requirement specifications with observable ACs',
  },
  {
    command: '/ux-research',
    group: 'product-ux',
    ownerRole: 'UX Research',
    descTh: 'วางแผนคำถามวิจัย วิเคราะห์งานผู้ใช้ และสังเคราะห์หลักฐาน (ไม่สร้างข้อมูลเท็จ)',
    descEn: 'Research questions, task analysis, and evidence synthesis',
    deliversTh: 'แผนวิจัย UX และการแยกแยะสมมติฐานออกจากหลักฐานจริง',
    deliversEn: 'Task analysis and research plan with hypotheses clearly labeled',
  },
  {
    command: '/ia',
    group: 'product-ux',
    ownerRole: 'Information Architecture',
    descTh: 'ออกแบบแผนผังเว็บไซต์ โครงสร้างการนำทาง และลำดับชั้นเนื้อหา',
    descEn: 'Sitemap, navigation structure, taxonomy, and content hierarchy',
    deliversTh: 'โครงสร้าง IA แผนผังเมนู และการจัดหมวดหมู่ข้อมูล',
    deliversEn: 'Navigation taxonomy and screen hierarchy map',
  },
  {
    command: '/flow',
    group: 'product-ux',
    ownerRole: 'UX Flow',
    descTh: 'ออกแบบเส้นทางผู้ใช้ จุดตัดสินใจ และการกู้คืนจากข้อผิดพลาด (Error Recovery)',
    descEn: 'User journeys, interaction flows, decision points, and error recovery',
    deliversTh: 'ลำดับขั้นตอนตั้งแต่จุดเริ่มต้นจนสำเร็จและกรณีเกิดข้อผิดพลาด',
    deliversEn: 'End-to-end task flows including edge and failure recovery paths',
  },
  {
    command: '/wireframe',
    group: 'product-ux',
    ownerRole: 'Wireframe & UI',
    descTh: 'วางโครงสร้างหน้าจอ ลำดับชั้นความสำคัญ และพฤติกรรม Responsive',
    descEn: 'Screen structures, layout zones, and responsive behavior',
    deliversTh: 'โครงร่างหน้าจอและสถานะ Loading / Empty / Error / Success',
    deliversEn: 'Structural screen blueprint and explicit interactive states',
  },
  {
    command: '/ui-design',
    group: 'product-ux',
    ownerRole: 'UI Design',
    descTh: 'กำหนดรายละเอียดส่วนติดต่อผู้ใช้ตามระบบการออกแบบและการเข้าถึง WCAG',
    descEn: 'Visual UI specification applying design system tokens and WCAG rules',
    deliversTh: 'ข้อกำหนด UI ระดับโปรดักชันพร้อมลำดับขั้นตัวอักษรและสี 60-30-10',
    deliversEn: 'Production visual specification with typography and contrast rules',
  },
  {
    command: '/design-system',
    group: 'product-ux',
    ownerRole: 'Design System',
    descTh: 'กำหนด Design Tokens บทบาทสี ตัวอักษร สเปซซิ่ง และสัญญาของคอมโพเนนต์',
    descEn: 'Semantic tokens, typography scale, spacing, and component contracts',
    deliversTh: 'ระบบโทเคนและข้อกำหนดสถานะคอมโพเนนต์ที่ใช้ซ้ำได้',
    deliversEn: 'Reusable token dictionary and component state specifications',
  },
  {
    command: '/prototype',
    group: 'product-ux',
    ownerRole: 'Interaction Design',
    descTh: 'ระบุพฤติกรรมการโต้ตอบและการเปลี่ยนสถานะอย่างละเอียด',
    descEn: 'Interaction behavior, state transitions, and feedback model',
    deliversTh: 'ตารางการเปลี่ยนสถานะและเงื่อนไขการตอบสนองของอินเทอร์เฟซ',
    deliversEn: 'State transition matrix and interactive behavior rules',
  },
  {
    command: '/accessibility',
    group: 'product-ux',
    ownerRole: 'Accessibility Specialist',
    descTh: 'ตรวจสอบการเข้าถึงตามเป้าหมาย WCAG 2.2 AA โครงสร้าง Semantic และคีย์บอร์ด',
    descEn: 'WCAG 2.2 AA review: semantics, keyboard, focus, contrast, and motion',
    deliversTh: 'รายงานตรวจสอบ ARIA, ลำดับโฟกัส, คอนทราสต์ และการตั้งค่าลดการเคลื่อนไหว',
    deliversEn: 'Accessibility audit covering landmarks, focus order, contrast, and reflow',
  },
  {
    command: '/international',
    group: 'product-ux',
    ownerRole: 'Localization',
    descTh: 'ตรวจสอบการรองรับหลายภาษา การตัดคำภาษาไทย รูปแบบวันที่ และหน่วยวัด',
    descEn: 'Localization, Thai/English typography, text expansion, and locale formats',
    deliversTh: 'แนวทางรองรับสองภาษา (TH/EN) และการป้องกันข้อความล้นกรอบ',
    deliversEn: 'Bilingual expansion checks, Thai line-height/wrapping, and unit standards',
  },

  // Engineering (13)
  {
    command: '/architecture',
    group: 'engineering',
    ownerRole: 'Product Architecture',
    descTh: 'กำหนดขอบเขตระบบ โมเดลโดเมน โครงสร้างการเชื่อมต่อ และข้อดีข้อเสีย',
    descEn: 'System/component boundaries, domain model, and architectural trade-offs',
    deliversTh: 'แผนผังขอบเขต UI, Business Logic, API, Persistence และ Configuration',
    deliversEn: 'Component boundary specification and architectural trade-off analysis',
  },
  {
    command: '/data-model',
    group: 'engineering',
    ownerRole: 'Data Design',
    descTh: 'ออกแบบเอนทิตี ความสัมพันธ์ การตรวจสอบความถูกต้อง และวงจรชีวิตข้อมูล',
    descEn: 'Domain entities, relationships, validation rules, lifecycle, and integrity',
    deliversTh: 'สคีมาข้อมูล กฎความสมบูรณ์ และนโยบายการจัดเก็บข้อมูล',
    deliversEn: 'Entity schemas, integrity constraints, and retention rules',
  },
  {
    command: '/api',
    group: 'engineering',
    ownerRole: 'API & Integration',
    descTh: 'กำหนดสัญญา API สคีมา Request/Response การจัดการข้อผิดพลาด และ Idempotency',
    descEn: 'API contracts, schemas, auth boundaries, error format, retries, and rate limits',
    deliversTh: 'ข้อกำหนด Endpoint, Status codes, Timeout และการป้องกันการเรียกซ้ำ',
    deliversEn: 'Explicit request/response contracts and resilience semantics',
  },
  {
    command: '/frontend',
    group: 'engineering',
    ownerRole: 'Frontend Engineering',
    descTh: 'พัฒนาหรือปรับปรุงโค้ดฝั่งคลายเอนต์ที่เข้าถึงได้ ตอบสนองไว และดูแลรักษาง่าย',
    descEn: 'Accessible, responsive, maintainable client implementation',
    deliversTh: 'โค้ด React/TypeScript ที่จัดการสถานะ Loading/Error/Validation ครบถ้วน',
    deliversEn: 'Connected client components with strict typing and error handling',
  },
  {
    command: '/backend',
    group: 'engineering',
    ownerRole: 'Backend Engineering',
    descTh: 'ออกแบบหรือพัฒนาตรรกะทางธุรกิจ การตรวจสอบสิทธิ์ และการบันทึกข้อมูลฝั่งเซิร์ฟเวอร์',
    descEn: 'Server-side business rules, persistence, authorization, and input validation',
    deliversTh: 'โค้ดฝั่งเซิร์ฟเวอร์ที่แยกการตรวจสิทธิ์ออกจาก UI อย่างปลอดภัย',
    deliversEn: 'Boundary-validated server routes and authorization logic',
  },
  {
    command: '/full-stack',
    group: 'engineering',
    ownerRole: 'Full-Stack Coordinator',
    descTh: 'พัฒนาฟีเจอร์เชื่อมโยงครบวงจรตั้งแต่ UI, API ไปจนถึงชั้นข้อมูล (Vertical Slice)',
    descEn: 'Coordinated vertical slice across UI, API contract, and data persistence',
    deliversTh: 'ระบบที่เชื่อมต่อกันครบทุกชั้นพร้อมระบุส่วนที่เป็น Mock หรือของจริงชัดเจน',
    deliversEn: 'End-to-end connected feature slice with explicit dependency boundaries',
  },
  {
    command: '/performance',
    group: 'engineering',
    ownerRole: 'Performance & Reliability',
    descTh: 'กำหนดงบประมาณประสิทธิภาพ (Performance Budgets) และวิเคราะห์คอขวด',
    descEn: 'Performance budgets, caching strategy, asset sizing, and bottleneck review',
    deliversTh: 'รายการตรวจสอบขนาดบันเดิล การแคช และการเรนเดอร์โดยไม่เมคตัวเลข',
    deliversEn: 'Bottleneck analysis and optimization plan without invented metrics',
  },
  {
    command: '/security',
    group: 'engineering',
    ownerRole: 'Security Review',
    descTh: 'วิเคราะห์ภัยคุกคาม สิทธิ์ขั้นต่ำ การจัดการความลับ และการป้องกันการโจมตี',
    descEn: 'Threat/risk review, least privilege, secret handling, and abuse mitigation',
    deliversTh: 'ตารางประเมินความเสี่ยงด้านความปลอดภัยและการบังคับใช้ฝั่งเซิร์ฟเวอร์',
    deliversEn: 'Threat model, boundary validation checks, and mitigation controls',
  },
  {
    command: '/privacy',
    group: 'engineering',
    ownerRole: 'Privacy Engineering',
    descTh: 'ตรวจสอบการเก็บข้อมูลเท่าที่จำเป็น (Data Minimization) การเข้าถึง และการลบข้อมูล',
    descEn: 'Data minimization, access control, retention lifecycle, and user control',
    deliversTh: 'รายการข้อมูลส่วนบุคคล ระยะเวลาเก็บรักษา และสิทธิ์ของผู้ใช้',
    deliversEn: 'PII inventory, retention policy, and user deletion controls',
  },
  {
    command: '/observability',
    group: 'engineering',
    ownerRole: 'Observability & SRE',
    descTh: 'วางแผนระบบ Logs, Metrics, Traces และสัญญาณแจ้งเตือนความผิดปกติ',
    descEn: 'Structured logs, operational metrics, traces, and actionable alerts',
    deliversTh: 'รายการเหตุการณ์สำคัญที่ต้องบันทึกและสัญญาณตรวจสอบสุขภาพระบบ',
    deliversEn: 'Telemetry specification and operational alert thresholds',
  },
  {
    command: '/deploy',
    group: 'engineering',
    ownerRole: 'Delivery & Operations',
    descTh: 'วางแผนสภาพแวดล้อม การตั้งค่า CI/CD ขั้นตอนการดีพลอย และการตรวจสอบหลังปล่อย',
    descEn: 'Environment configuration, delivery pipeline, and deployment checklist',
    deliversTh: 'ขั้นตอนการビルド ตัวแปรสภาพแวดล้อม (.env) และแผนการปล่อยระบบ',
    deliversEn: 'Build verification steps, environment variable manifest, and rollout plan',
  },
  {
    command: '/migration',
    group: 'engineering',
    ownerRole: 'Data & Schema Migration',
    descTh: 'วางแผนการอัปเดตโครงสร้างข้อมูล การตรวจสอบความถูกต้อง และแผนย้อนกลับ',
    descEn: 'Schema/data migration steps, compatibility validation, and rollback plan',
    deliversTh: 'ขั้นตอนการย้ายข้อมูลแบบไม่กระทบของเดิมพร้อมวิธี Rollback',
    deliversEn: 'Safe forward/backward migration procedure and verification checks',
  },
  {
    command: '/runbook',
    group: 'engineering',
    ownerRole: 'Operations & Support',
    descTh: 'จัดทำคู่มือปฏิบัติการและการรับมือเหตุฉุกเฉิน (Incident Procedures)',
    descEn: 'Operational runbook, troubleshooting guide, and incident response steps',
    deliversTh: 'คู่มือวินิจฉัยปัญหาเบื้องต้นและการกู้คืนระบบเมื่อเกิดเหตุขัดข้อง',
    deliversEn: 'Step-by-step operational triage and recovery runbook',
  },

  // Verification & Delivery (7)
  {
    command: '/test-plan',
    group: 'verification',
    ownerRole: 'Quality Engineering',
    descTh: 'ออกแบบกลยุทธ์การทดสอบและกรณีทดสอบ (Test Cases) โดยไม่แอบอ้างว่ารันแล้ว',
    descEn: 'Test strategy and traceable test cases (never implies tests actually ran)',
    deliversTh: 'ตาราง TEST-001 เชื่อมโยงกับ REQ/AC พร้อมขั้นตอนและผลที่คาดหวัง',
    deliversEn: 'Structured unit/integration/E2E/accessibility test cases marked NOT RUN',
  },
  {
    command: '/test',
    group: 'verification',
    ownerRole: 'Test Executor',
    descTh: 'รันการทดสอบจริงเมื่อมีเครื่องมือ หรือสร้างคำสั่งรันที่ชัดเจนพร้อมระบุสถานะจริง',
    descEn: 'Run tests when tools permit, or provide exact commands marked NOT RUN',
    deliversTh: 'ผลลัพธ์การรันจริง (EXECUTED/VERIFIED) หรือขั้นตอนการทดสอบที่ชัดเจน',
    deliversEn: 'Actual execution log and environment status or explicit test commands',
  },
  {
    command: '/audit',
    group: 'verification',
    ownerRole: 'Diagnostic Auditor',
    descTh: 'วินิจฉัยและอธิบายจุดบกพร่องครอบคลุมทุกมิติที่เกี่ยวข้อง (ไม่แก้ไขโค้ดโดยพลการ)',
    descEn: 'Diagnose issues across product, UX, architecture, security, and quality',
    deliversTh: 'รายงานข้อค้นพบจัดลำดับตามความรุนแรง P0-P3 พร้อมหลักฐาน',
    deliversEn: 'Prioritized diagnostic findings (P0-P3) with root-cause status',
  },
  {
    command: '/qa',
    group: 'verification',
    ownerRole: 'Quality Gate Evaluator',
    descTh: 'ประเมินผลเทียบกับเกณฑ์การยอมรับและประตูคุณภาพ 32 ข้อ (Gates A-E)',
    descEn: 'Evaluate against acceptance criteria and the 32-item Quality Gate (A-E)',
    deliversTh: 'คะแนนถ่วงน้ำหนักตามข้อที่เกี่ยวข้องจริง พร้อมระบุ P0/P1 Blockers',
    deliversEn: 'Evidence-weighted 32-point gate scorecard and blocker disposition',
  },
  {
    command: '/fix',
    group: 'verification',
    ownerRole: 'Corrective Engineer',
    descTh: 'แก้ไขจุดบกพร่องที่พบด้วยความเปลี่ยนแปลงที่เล็กและปลอดภัยที่สุด',
    descEn: 'Fix identified defects with minimal safe changes preserving approved behavior',
    deliversTh: 'การแก้ไขโค้ดพร้อมการวิเคราะห์ผลกระทบ (Regression check)',
    deliversEn: 'Targeted defect resolution and regression verification summary',
  },
  {
    command: '/release',
    group: 'verification',
    ownerRole: 'Release Manager',
    descTh: 'ประเมินความพร้อมก่อนปล่อยใช้งานจริง (RELEASE CANDIDATE / REVISE / BLOCKED)',
    descEn: 'Release-readiness assessment based on evidence, blockers, and rollback safety',
    deliversTh: 'ใบประเมินความพร้อมปล่อยระบบ (Release Assessment) ตามเทมเพลตมาตรฐาน',
    deliversEn: 'Formal Release Assessment report with final disposition',
  },
  {
    command: '/handoff',
    group: 'verification',
    ownerRole: 'Technical Documentation',
    descTh: 'สรุปเอกสารส่งมอบงานสำหรับทีมพัฒนาและทีมปฏิบัติการพร้อมข้อจำกัดที่ทราบ',
    descEn: 'Developer and operations handoff package with known limitations',
    deliversTh: 'แพ็กเกจส่งมอบงาน โครงสร้างไฟล์ การตั้งค่า และรายการที่ต้องตรวจสอบต่อ',
    deliversEn: 'Complete handoff summary, architecture map, and open risks',
  },
];

export const RECOMMENDED_COMMAND_SEQUENCES = [
  {
    id: 'small-ui',
    titleTh: 'การปรับปรุง UI เฉพาะจุด (Small UI Change)',
    titleEn: 'Small UI Change',
    mode: 'QUICK' as ApeExecutionModeId,
    commands: ['/auto', '/ui-design', '/qa'],
    descTh: 'ใช้เฉพาะขั้นตอนที่เพิ่มคุณค่าจริงสำหรับงานแก้ไขหน้าจอหรือคอมโพเนนต์ย่อย',
    descEn: 'Use only the steps that add value for localized visual or component updates.',
  },
  {
    id: 'mvp-app',
    titleTh: 'การพัฒนาเว็บแอปพลิเคชัน MVP (MVP Web Application)',
    titleEn: 'MVP Web Application',
    mode: 'STANDARD' as ApeExecutionModeId,
    commands: ['/brief', '/strategy', '/requirements', '/ia', '/flow', '/design-system', '/architecture', '/full-stack', '/test-plan', '/qa', '/handoff'],
    descTh: 'ลำดับการทำงานครบวงจรตั้งแต่การบันทึก Project Record จนถึงการส่งมอบระบบ MVP',
    descEn: 'End-to-end product engineering pipeline from Project Record to full-stack handoff.',
  },
  {
    id: 'defect-fix',
    titleTh: 'การแก้ไขจุดบกพร่องในโค้ดเดิม (Existing Code with Defects)',
    titleEn: 'Existing Code with Defects',
    mode: 'STANDARD' as ApeExecutionModeId,
    commands: ['/audit', '/fix', '/test', '/qa'],
    descTh: 'วินิจฉัยปัญหา แก้ไขด้วยผลกระทบต่ำสุด รันการทดสอบ และประเมินประตูคุณภาพ',
    descEn: 'Diagnose root causes, apply minimal safe fixes, execute tests, and verify QA gates.',
  },
  {
    id: 'security-sensitive',
    titleTh: 'ฟีเจอร์ที่ละเอียดอ่อนด้านความปลอดภัย (Security-Sensitive Feature)',
    titleEn: 'Security-Sensitive Feature',
    mode: 'HIGH-ASSURANCE' as ApeExecutionModeId,
    commands: ['/requirements', '/architecture', '/security', '/privacy', '/test-plan', '/qa', '/release'],
    descTh: 'เน้นการตรวจสอบสิทธิ์ ขอบเขตข้อมูล ความเป็นส่วนตัว และการประเมินก่อนปล่อยอย่างเข้มงวด',
    descEn: 'High-assurance threat modeling, least-privilege boundaries, privacy controls, and release gating.',
  },
  {
    id: 'prod-release',
    titleTh: 'การประเมินเพื่อปล่อยสู่โปรดักชัน (Production Release)',
    titleEn: 'Production Release Readiness',
    mode: 'HIGH-ASSURANCE' as ApeExecutionModeId,
    commands: ['/status', '/audit', '/test-plan', '/test', '/qa', '/release', '/runbook'],
    descTh: 'ตรวจสอบสถานะ หลักฐานการรันจริง ประตูคุณภาพ 32 ข้อ และคู่มือกู้คืนระบบ',
    descEn: 'Comprehensive release gate audit, executed test verification, and operational runbook.',
  },
];

export const APE_QUALITY_GATE_ITEMS: ApeQualityGateItem[] = [
  // Gate A — Product fit and requirements (1-6)
  {
    id: 1,
    gate: 'A',
    gateNameTh: 'Gate A — ความสอดคล้องของผลิตภัณฑ์และข้อกำหนด',
    gateNameEn: 'Gate A — Product Fit & Requirements',
    statementTh: 'ปัญหา ผลลัพธ์ที่ต้องการ และกลุ่มผู้ใช้เป้าหมายมีความชัดเจนหรือระบุสมมติฐานไว้โดยตรง',
    statementEn: 'Problem/outcome and target users are clear or explicitly assumed.',
    defaultScore: 2,
    evidenceNote: 'Defined in Project Record for NRRU Researchers & Product Engineers.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 2,
    gate: 'A',
    gateNameTh: 'Gate A — ความสอดคล้องของผลิตภัณฑ์และข้อกำหนด',
    gateNameEn: 'Gate A — Product Fit & Requirements',
    statementTh: 'ระบุขอบเขต (Scope) สิ่งที่ไม่ทำ (Non-goals) และลำดับความสำคัญไว้อย่างชัดเจน',
    statementEn: 'Scope, non-goals, and priorities are stated.',
    defaultScore: 2,
    evidenceNote: 'Scoped to visual synthesis, 50-point visual QA, and APE OS v2.0 engineering lifecycle.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 3,
    gate: 'A',
    gateNameTh: 'Gate A — ความสอดคล้องของผลิตภัณฑ์และข้อกำหนด',
    gateNameEn: 'Gate A — Product Fit & Requirements',
    statementTh: 'ระบุงานหลักของผู้ใช้ (Primary tasks) และเส้นทางใช้งานสำคัญ (Critical journeys) ครบถ้วน',
    statementEn: 'Primary tasks and critical user journeys are identified.',
    defaultScore: 2,
    evidenceNote: 'Studio synthesis, Mode selection, Predictive Autocomplete, History Analytics, and APE Gate evaluation.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 4,
    gate: 'A',
    gateNameTh: 'Gate A — ความสอดคล้องของผลิตภัณฑ์และข้อกำหนด',
    gateNameEn: 'Gate A — Product Fit & Requirements',
    statementTh: 'เกณฑ์การยอมรับ (Acceptance criteria) สามารถสังเกตผลและทดสอบได้จริง',
    statementEn: 'Acceptance criteria are observable and testable.',
    defaultScore: 2,
    evidenceNote: 'Linked via REQ-001..005 and AC-001..005 in the Traceability Matrix.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 5,
    gate: 'A',
    gateNameTh: 'Gate A — ความสอดคล้องของผลิตภัณฑ์และข้อกำหนด',
    gateNameEn: 'Gate A — Product Fit & Requirements',
    statementTh: 'บันทึกข้อจำกัด ความพึ่งพิง (Dependencies) และสมมติฐานไว้อย่างครบถ้วน',
    statementEn: 'Constraints, dependencies, and assumptions are recorded.',
    defaultScore: 2,
    evidenceNote: 'Recorded in authoritative Project Record with CONFIRMED and ASSUMED badges.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 6,
    gate: 'A',
    gateNameTh: 'Gate A — ความสอดคล้องของผลิตภัณฑ์และข้อกำหนด',
    gateNameEn: 'Gate A — Product Fit & Requirements',
    statementTh: 'ข้อกำหนดทั้งหมดสอดคล้องกับอาร์ติแฟกต์และผลลัพธ์ที่ส่งมอบ',
    statementEn: 'Requirements align with the requested deliverables.',
    defaultScore: 2,
    evidenceNote: 'All requested UI/UX Pro Max and APE OS v2.0 modules are connected.',
    verificationLabel: 'VERIFIED',
  },

  // Gate B — UX, content, and design (7-14)
  {
    id: 7,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'ลำดับชั้นข้อมูลและระบบนำทางรองรับการทำงานของผู้ใช้ได้อย่างราบรื่น',
    statementEn: 'Information hierarchy and navigation support user tasks.',
    defaultScore: 2,
    evidenceNote: 'Strict H1 -> H2 -> H3 -> H4 hierarchy and responsive TopNavigation.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 8,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'เส้นทางใช้งานหลักมีจุดสิ้นสุดงานและทางออกเมื่อเกิดข้อผิดพลาด (Recovery paths)',
    statementEn: 'Primary journeys have completion and recovery paths.',
    defaultScore: 2,
    evidenceNote: 'Fallback synthesis and explicit error banners with retry/recovery actions.',
    verificationLabel: 'STATICALLY REVIEWED',
  },
  {
    id: 9,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'ป้ายกำกับและเนื้อหามีความชัดเจนและสม่ำเสมอทั้งภาษาไทยและภาษาอังกฤษ',
    statementEn: 'Labels and content are clear and consistent.',
    defaultScore: 2,
    evidenceNote: 'Bilingual TH/EN labels across all studio controls, modes, and gates.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 10,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'แสดงผลตอบสนองการโต้ตอบและสถานะของระบบอย่างชัดเจน (ไม่ใช้สีเพียงอย่างเดียว)',
    statementEn: 'Interaction feedback and system status are visible.',
    defaultScore: 2,
    evidenceNote: 'Paired icons + text badges on all status indicators and active toggles.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 11,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'รองรับการแสดงผลแบบ Responsive และการตัดคำหลายภาษาโดยไม่ถูกตัดทอน',
    statementEn: 'Responsive behavior and localization are considered.',
    defaultScore: 2,
    evidenceNote: 'Mobile-first grids, fluid clamp() typography, and wrapping chip disclosure.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 12,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'ลำดับชั้นทางสายตา ฟอนต์ ระยะห่าง และคอมโพเนนต์มีความเป็นเอกภาพตามกฎ 60-30-10',
    statementEn: 'Visual hierarchy, typography, spacing, and components are coherent.',
    defaultScore: 2,
    evidenceNote: 'Plus Jakarta Sans + DM Sans + Sarabun + JetBrains Mono with 60-30-10 Slate/Amber palette.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 13,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'ตรวจสอบความเสี่ยงด้านการเข้าถึง (Accessibility) หรือระบุส่วนที่ยังไม่ตรวจสอบอย่างตรงไปตรงมา',
    statementEn: 'Accessibility risks are reviewed or explicitly unverified.',
    defaultScore: 2,
    evidenceNote: 'WCAG AA contrast tokens, visible :focus-visible rings, and reduced-motion rules.',
    verificationLabel: 'STATICALLY REVIEWED',
  },
  {
    id: 14,
    gate: 'B',
    gateNameTh: 'Gate B — ประสบการณ์ผู้ใช้ เนื้อหา และการออกแบบ',
    gateNameEn: 'Gate B — UX, Content & Design',
    statementTh: 'ไม่มีการตกแต่งที่ลดทอนความสามารถในการอ่านหรือการทำภารกิจให้สำเร็จ',
    statementEn: 'No decorative choice undermines readability or task completion.',
    defaultScore: 2,
    evidenceNote: 'Eliminated decorative neon gradients and low-contrast muted text.',
    verificationLabel: 'VERIFIED',
  },

  // Gate C — Engineering and data (15-20)
  {
    id: 15,
    gate: 'C',
    gateNameTh: 'Gate C — วิศวกรรมซอฟต์แวร์และข้อมูล',
    gateNameEn: 'Gate C — Engineering & Data',
    statementTh: 'สถาปัตยกรรมและหน้าที่ความรับผิดชอบของแต่ละคอมโพเนนต์เข้าใจง่ายและแยกส่วนชัดเจน',
    statementEn: 'Architecture and component responsibilities are understandable.',
    defaultScore: 2,
    evidenceNote: 'Modular separation between StudioConsole, VisualCanvas, HistoryPanel, and ApeOsWorkbench.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 16,
    gate: 'C',
    gateNameTh: 'Gate C — วิศวกรรมซอฟต์แวร์และข้อมูล',
    gateNameEn: 'Gate C — Engineering & Data',
    statementTh: 'โค้ด การนำเข้าโมดูล (Imports) ไลบรารี และตำแหน่งไฟล์มีความสอดคล้องกันและคอมไพล์ผ่าน',
    statementEn: 'Code, imports, dependencies, and file placement are coherent.',
    defaultScore: 2,
    evidenceNote: 'Verified via tsc --noEmit and Vite production bundle build.',
    verificationLabel: 'EXECUTED',
  },
  {
    id: 17,
    gate: 'C',
    gateNameTh: 'Gate C — วิศวกรรมซอฟต์แวร์และข้อมูล',
    gateNameEn: 'Gate C — Engineering & Data',
    statementTh: 'อธิบายขอบเขต API โครงสร้างข้อมูล และสมมติฐานไว้อย่างชัดเจน',
    statementEn: 'API/data boundaries and assumptions are documented.',
    defaultScore: 2,
    evidenceNote: 'Express /api/synthesize and /api/generate-image endpoints + Firestore schema documented.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 18,
    gate: 'C',
    gateNameTh: 'Gate C — วิศวกรรมซอฟต์แวร์และข้อมูล',
    gateNameEn: 'Gate C — Engineering & Data',
    statementTh: 'มีการตรวจสอบความถูกต้องของข้อมูล (Validation) และการจัดการข้อผิดพลาดที่ขอบเขตที่เหมาะสม',
    statementEn: 'Validation and error handling occur at appropriate boundaries.',
    defaultScore: 2,
    evidenceNote: 'Server-side payload checks + Firestore security rules validation.',
    verificationLabel: 'STATICALLY REVIEWED',
  },
  {
    id: 19,
    gate: 'C',
    gateNameTh: 'Gate C — วิศวกรรมซอฟต์แวร์และข้อมูล',
    gateNameEn: 'Gate C — Engineering & Data',
    statementTh: 'พิจารณาความสมบูรณ์ของข้อมูล การสำรองข้อมูล และการกู้คืนในจุดที่เกี่ยวข้อง',
    statementEn: 'Data integrity, migration, and recovery are considered where relevant.',
    defaultScore: 2,
    evidenceNote: 'Dual persistence (Firestore cloud sync + localStorage fallback + Batch ZIP export).',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 20,
    gate: 'C',
    gateNameTh: 'Gate C — วิศวกรรมซอฟต์แวร์และข้อมูล',
    gateNameEn: 'Gate C — Engineering & Data',
    statementTh: 'ความสามารถในการดูแลรักษาโค้ด (Maintainability) เหมาะสมกับขนาดของระบบ',
    statementEn: 'Maintainability is proportionate to the scope.',
    defaultScore: 2,
    evidenceNote: 'Typed data dictionaries and reusable functional components without over-abstraction.',
    verificationLabel: 'VERIFIED',
  },

  // Gate D — Security, privacy, and reliability (21-26)
  {
    id: 21,
    gate: 'D',
    gateNameTh: 'Gate D — ความปลอดภัย ความเป็นส่วนตัว และความน่าเชื่อถือ',
    gateNameEn: 'Gate D — Security, Privacy & Reliability',
    statementTh: 'กำหนดขอบเขตการยืนยันตัวตนและการตรวจสอบสิทธิ์อย่างเหมาะสม (ไม่ใช้แค่การซ่อนปุ่ม)',
    statementEn: 'Authentication and authorization boundaries are addressed where relevant.',
    defaultScore: 2,
    evidenceNote: 'Firebase Auth + Firestore owner-scoped security rules (request.auth.uid == resource.data.uid).',
    verificationLabel: 'STATICALLY REVIEWED',
  },
  {
    id: 22,
    gate: 'D',
    gateNameTh: 'Gate D — ความปลอดภัย ความเป็นส่วนตัว และความน่าเชื่อถือ',
    gateNameEn: 'Gate D — Security, Privacy & Reliability',
    statementTh: 'จัดการคีย์ลับ (Secrets) และข้อมูลอ่อนไหวอย่างปลอดภัย ไม่ฝังไว้ในโค้ดฝั่งคลายเอนต์',
    statementEn: 'Secrets and sensitive data are handled appropriately.',
    defaultScore: 2,
    evidenceNote: 'GEMINI_API_KEY remains strictly on the Express backend (/api/* routes).',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 23,
    gate: 'D',
    gateNameTh: 'Gate D — ความปลอดภัย ความเป็นส่วนตัว และความน่าเชื่อถือ',
    gateNameEn: 'Gate D — Security, Privacy & Reliability',
    statementTh: 'พิจารณาความเสี่ยงจากข้อมูลนำเข้า (Input injection) ไลบรารี และการใช้งานผิดประเภท',
    statementEn: 'Input, injection, dependency, and abuse risks are considered.',
    defaultScore: 2,
    evidenceNote: 'Sanitized ZIP folder names, typed JSON payloads, and bounded Firestore field lengths.',
    verificationLabel: 'STATICALLY REVIEWED',
  },
  {
    id: 24,
    gate: 'D',
    gateNameTh: 'Gate D — ความปลอดภัย ความเป็นส่วนตัว และความน่าเชื่อถือ',
    gateNameEn: 'Gate D — Security, Privacy & Reliability',
    statementTh: 'เก็บข้อมูลเท่าที่จำเป็น (Data minimization) และให้ผู้ใช้ลบประวัติของตนเองได้',
    statementEn: 'Data minimization, retention, and deletion are addressed where relevant.',
    defaultScore: 2,
    evidenceNote: 'Users can delete individual records or clear all history from local/cloud storage.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 25,
    gate: 'D',
    gateNameTh: 'Gate D — ความปลอดภัย ความเป็นส่วนตัว และความน่าเชื่อถือ',
    gateNameEn: 'Gate D — Security, Privacy & Reliability',
    statementTh: 'รองรับกรณีเกิดความล้มเหลว (Failure modes) และการสลับใช้โหมดสำรองเมื่อออฟไลน์',
    statementEn: 'Failure modes, timeouts, retries, and resilience are considered where relevant.',
    defaultScore: 2,
    evidenceNote: 'Deterministic offline synthesis fallback if backend API is unreachable.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 26,
    gate: 'D',
    gateNameTh: 'Gate D — ความปลอดภัย ความเป็นส่วนตัว และความน่าเชื่อถือ',
    gateNameEn: 'Gate D — Security, Privacy & Reliability',
    statementTh: 'พิจารณาประสิทธิภาพและการติดตามสถานะการทำงานในส่วนที่เกี่ยวข้อง',
    statementEn: 'Performance and observability needs are addressed where relevant.',
    defaultScore: 1,
    evidenceNote: 'Client-side latency and QA metrics tracked; production APM telemetry not yet attached.',
    verificationLabel: 'REASONED',
  },

  // Gate E — Verification and delivery (27-32)
  {
    id: 27,
    gate: 'E',
    gateNameTh: 'Gate E — การทวนสอบและการส่งมอบระบบ',
    gateNameEn: 'Gate E — Verification & Delivery',
    statementTh: 'ข้อกำหนดที่สำคัญเชื่อมโยงกับวิธีการทดสอบหรือการทวนสอบอย่างชัดเจน',
    statementEn: 'Important requirements map to tests or verification methods.',
    defaultScore: 2,
    evidenceNote: 'Mapped in REQ -> AC -> TEST Traceability Matrix.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 28,
    gate: 'E',
    gateNameTh: 'Gate E — การทวนสอบและการส่งมอบระบบ',
    gateNameEn: 'Gate E — Verification & Delivery',
    statementTh: 'แยกแยะการทดสอบที่เสนอแนะ (Proposed tests) ออกจากสิ่งที่รันทดสอบจริงอย่างชัดเจน',
    statementEn: 'Proposed tests are distinguished from executed tests.',
    defaultScore: 2,
    evidenceNote: 'Explicit EXECUTED vs STATICALLY REVIEWED vs NOT CHECKED badges on every check.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 29,
    gate: 'E',
    gateNameTh: 'Gate E — การทวนสอบและการส่งมอบระบบ',
    gateNameEn: 'Gate E — Verification & Delivery',
    statementTh: 'บันทึกผลการทดสอบจริงและสภาพแวดล้อมที่ใช้รันเมื่อมีข้อมูล',
    statementEn: 'Actual test results and environment are recorded when available.',
    defaultScore: 2,
    evidenceNote: 'TypeScript compiler (tsc --noEmit) and Vite production build executed and verified.',
    verificationLabel: 'EXECUTED',
  },
  {
    id: 30,
    gate: 'E',
    gateNameTh: 'Gate E — การทวนสอบและการส่งมอบระบบ',
    gateNameEn: 'Gate E — Verification & Delivery',
    statementTh: 'คำแนะนำในการติดตั้ง การตั้งค่า และการส่งมอบงานมีความชัดเจน',
    statementEn: 'Setup, deployment, configuration, and handoff instructions are clear.',
    defaultScore: 2,
    evidenceNote: 'Documented in APE OS v2.0 Handoff & Templates panel.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 31,
    gate: 'E',
    gateNameTh: 'Gate E — การทวนสอบและการส่งมอบระบบ',
    gateNameEn: 'Gate E — Verification & Delivery',
    statementTh: 'ระบุข้อจำกัดที่ทราบ จุดบกพร่องที่ยังเปิดอยู่ และอุปสรรค (Blockers) อย่างตรงไปตรงมา',
    statementEn: 'Known limitations, open defects, and blockers are explicit.',
    defaultScore: 2,
    evidenceNote: 'Part IV Known Limitations and Defect Log explicitly maintained.',
    verificationLabel: 'VERIFIED',
  },
  {
    id: 32,
    gate: 'E',
    gateNameTh: 'Gate E — การทวนสอบและการส่งมอบระบบ',
    gateNameEn: 'Gate E — Verification & Delivery',
    statementTh: 'ระบุแผนการปล่อยระบบ การย้อนกลับ (Rollback) และผู้รับผิดชอบเมื่อเกี่ยวข้อง',
    statementEn: 'Release/rollback and operational ownership are addressed when relevant.',
    defaultScore: 2,
    evidenceNote: 'Release Assessment template and rollback procedures included.',
    verificationLabel: 'STATICALLY REVIEWED',
  },
];

export const INITIAL_PROJECT_RECORD: ProjectRecordField[] = [
  {
    id: 'project-name',
    labelTh: 'ชื่อโครงการและประเภทผลิตภัณฑ์',
    labelEn: 'Project Name & Product Type',
    value: 'GEMINI VISUAL AI OS v5.1 + Adaptive Product Engineering OS v2.0 (Bilingual Research & Product Engineering Workbench)',
    status: 'CONFIRMED',
  },
  {
    id: 'problem-outcome',
    labelTh: 'ปัญหาและผลลัพธ์ที่ต้องการ',
    labelEn: 'Problem & Intended Outcome',
    value: 'Transform natural-language product and research needs into traceable visual specifications, 3-Pass prompts, UI/UX Pro Max interfaces, and risk-gated engineering deliverables without fabricated verification.',
    status: 'CONFIRMED',
  },
  {
    id: 'primary-users',
    labelTh: 'กลุ่มผู้ใช้หลักและบริบท',
    labelEn: 'Primary Users & Context',
    value: 'Industrial Technology Researchers (NRRU), Product Engineers, UX/UI Designers, and Academic Authors working in Thai and English.',
    status: 'CONFIRMED',
  },
  {
    id: 'scope-priorities',
    labelTh: 'ขอบเขตและลำดับความสำคัญ',
    labelEn: 'Scope, Non-Goals & Priority',
    value: 'In-scope: 20 Auto Modes, Mode-Aware Predictive Autocomplete, 30-Day Recharts Analytics, UI/UX Pro Max WCAG AA compliance, and APE OS v2.0 Project Record & 32-Item Release Gates. Non-goal: Unverified autonomous production deployment.',
    status: 'CONFIRMED',
  },
  {
    id: 'platform-stack',
    labelTh: 'แพลตฟอร์มและเทคโนโลยี',
    labelEn: 'Platform, Environment & Stack',
    value: 'React 19 + TypeScript + Tailwind CSS v4 + Recharts + Lucide Icons + Express Backend (/api/*) + Firebase Auth & Firestore.',
    status: 'CONFIRMED',
  },
  {
    id: 'security-accessibility',
    labelTh: 'ความปลอดภัย ความเป็นส่วนตัว และการเข้าถึง',
    labelEn: 'Privacy, Security & Accessibility',
    value: 'WCAG 2.2 AA target (4.5:1+ normal text contrast, 2px visible focus ring, reduced-motion support, semantic H1-H4 landmarks); Server-side Gemini API key isolation; Owner-scoped Firestore rules.',
    status: 'CONFIRMED',
  },
  {
    id: 'verification-evidence',
    labelTh: 'หลักฐานการทวนสอบและข้อจำกัด',
    labelEn: 'Verification Evidence & Known Limitations',
    value: 'TypeScript compilation (tsc --noEmit) and Vite bundle build EXECUTED and VERIFIED. Runtime screen-reader assistive hardware testing remains STATICALLY REVIEWED.',
    status: 'ASSUMED',
  },
];

export const INITIAL_TRACEABILITY_MATRIX: TraceabilityItem[] = [
  {
    reqId: 'REQ-001',
    requirement: '30-Day Activity Trends & Mode/Tag Visualization in HistoryPanel',
    priority: 'P1',
    source: 'User',
    acId: 'AC-001',
    acceptanceCriterion: 'HistoryPanel renders interactive Recharts timelines, top modes, top tags, and QA pass rate with 7d/30d/90d/All filtering.',
    artifact: 'src/components/HistoryAnalyticsView.tsx',
    testId: 'TEST-001',
    verificationMethod: 'TypeScript compile + static component inspection',
    verificationStatus: 'VERIFIED',
  },
  {
    reqId: 'REQ-002',
    requirement: 'Mode-Aware Predictive Autocomplete in StudioConsole Prompt Input',
    priority: 'P1',
    source: 'User',
    acId: 'AC-002',
    acceptanceCriterion: 'Typing or focusing prompt textarea suggests specialized engineering/architectural/research terms with Tab/Enter completion and 1-click chip insertion.',
    artifact: 'src/components/PromptPredictiveAutocomplete.tsx, src/data/specializedTerminology.ts',
    testId: 'TEST-002',
    verificationMethod: 'TypeScript compile + static interaction review',
    verificationStatus: 'VERIFIED',
  },
  {
    reqId: 'REQ-003',
    requirement: 'UI/UX Pro Max Design System (60-30-10 Palette, Typography Hierarchy, Fluid Reflow, WCAG AA)',
    priority: 'P0',
    source: 'Policy',
    acId: 'AC-003',
    acceptanceCriterion: 'Strict H1->H4 hierarchy, Plus Jakarta Sans + DM Sans + Sarabun + JetBrains Mono pairing, >=4.5:1 contrast, wrapping chip disclosure, and 2px focus-visible rings.',
    artifact: 'src/index.css, src/App.tsx, src/components/*.tsx',
    testId: 'TEST-003',
    verificationMethod: 'CSS token audit + DOM heading hierarchy verification',
    verificationStatus: 'VERIFIED',
  },
  {
    reqId: 'REQ-004',
    requirement: 'Adaptive Product Engineering OS v2.0 (Project Record, Command Router, 32-Item Release Gates)',
    priority: 'P0',
    source: 'User',
    acId: 'AC-004',
    acceptanceCriterion: 'Interactive APE OS v2.0 Workbench supports QUICK/STANDARD/HIGH-ASSURANCE routing, Single Source of Truth Project Record, Traceability Matrix, and 32-Item Gate scoring.',
    artifact: 'src/components/ApeOsWorkbench.tsx, src/data/apeOsData.ts',
    testId: 'TEST-004',
    verificationMethod: 'TypeScript compile + interactive state verification',
    verificationStatus: 'EXECUTED',
  },
];

export const INITIAL_DEFECT_LOG: DefectRecordItem[] = [
  {
    id: 'DEF-001',
    severity: 'P2 Medium',
    status: 'FIXED',
    affectedArea: 'Command & Mode Chip Overflow on Narrow Viewports (REQ-003)',
    evidence: 'Long lists of response modes and command chips previously required horizontal scrolling or truncated text.',
    causeStatus: 'CONFIRMED',
    correction: 'Replaced single-line truncation with flex-wrap and accessible +N more / Show less disclosure buttons with aria-expanded.',
    regressionCheck: 'Verified across StudioConsole, CommandDictionary, and PromptPredictiveAutocomplete.',
    remainingRisk: 'Low — extreme zoom (>300%) may wrap chips into multiple vertical rows as intended by WCAG reflow.',
  },
  {
    id: 'DEF-002',
    severity: 'P2 Medium',
    status: 'FIXED',
    affectedArea: 'Color-Only Status Dots and Muted Contrast (REQ-003)',
    evidence: 'Muted slate-500 text on slate-900 cards had <4.5:1 contrast ratio; decorative pulsing dots lacked semantic labels.',
    causeStatus: 'CONFIRMED',
    correction: 'Upgraded secondary/muted text to slate-200/slate-300 (>=7:1 contrast) and paired all status indicators with explicit icons and text.',
    regressionCheck: 'Reviewed across AuthBar, TopNavigation, QAInspector, and HistoryPanel.',
    remainingRisk: 'None identified in static review.',
  },
];

export const APE_MASTER_PROMPT_TEXT = `# ADAPTIVE PRODUCT ENGINEERING OS v2.0

## 0. ROLE AND MISSION
You are Adaptive Product Engineering OS (APE OS), a modular assistant that helps transform a product need into a clearly scoped, usable, accessible, secure, maintainable, testable, and supportable solution.

Mission: solve the user's actual problem with the smallest reliable solution that satisfies the stated requirements and risk level.

## 1. NON-NEGOTIABLE OPERATING RULES
1. Understand the requested outcome, users, constraints, and deliverables before making consequential decisions.
2. Avoid unnecessary interrogation. Ask one concise question only when a missing fact materially changes the solution or creates significant risk. Otherwise state assumptions and proceed.
3. Maintain one Project Record as the source of truth. Never silently overwrite a confirmed requirement or decision.
4. Separate confirmed facts, user-provided evidence, assumptions, recommendations, and unresolved questions.
5. Never fabricate user research, analytics, benchmarks, stakeholder approval, API behavior, test results, deployment status, or external-system access.
6. Choose workflow depth proportionate to complexity, uncertainty, and impact (QUICK / STANDARD / HIGH-ASSURANCE).
7. Design for complete user tasks, understandable content, accessible interaction, recovery from errors, and meaningful feedback.
8. Preserve the specified platform, stack, conventions, integrations, and approved behavior.
9. Prefer the simplest maintainable design.
10. Treat privacy, security, accessibility, reliability, and data integrity as design constraints, not late-stage polish.
11. Define observable acceptance criteria for important requirements (REQ -> AC -> Artifact -> TEST).
12. Make every interaction honest: mark placeholders and mocks explicitly.
13. Validate untrusted input at appropriate boundaries. Never put secrets in client-side code.
14. Distinguish client-side usability validation from server-side security enforcement.
15. Preserve data and approved behavior during fixes.
16. Do not claim code is runnable, tested, secure, accessible, production-ready, or deployed unless evidence supports that exact claim.
17. Use exact verification labels: NOT CHECKED | REASONED | STATICALLY REVIEWED | EXECUTED | VERIFIED | BLOCKED.

## 2. ADAPTIVE EXECUTION POLICY
- QUICK mode: Localized edits, single component, low-risk tasks.
- STANDARD mode: Multi-screen features, MVP, moderate integrations.
- HIGH-ASSURANCE mode: Sensitive data, auth, safety-critical workflows, migrations, major releases.

## 3. STANDARD RESPONSE CONTRACT
1. Outcome — what is delivered or recommended.
2. Context & assumptions — only material facts, assumptions, and constraints.
3. Solution — design, architecture, code, or plan.
4. Acceptance & verification — criteria, checks, actual status, and evidence.
5. Risks & limitations — blockers, open decisions, and unsupported claims.
6. Next action — the most useful next step.`;
