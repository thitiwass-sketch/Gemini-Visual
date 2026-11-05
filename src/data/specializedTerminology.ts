export interface SpecializedTerm {
  id: string;
  term: string;
  termTh: string;
  termEn: string;
  category: 'mechanics' | 'materials' | 'standards' | 'views' | 'structural' | 'bim' | 'rendering' | 'research';
  categoryLabelTh: string;
  categoryLabelEn: string;
  modes: string[]; // e.g. ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-ARCH']
  keywords: string[]; // Thai and English query keywords for predictive matching
  descriptionTh: string;
  descriptionEn: string;
  badge?: string; // e.g. 'ISO', 'GD&T', 'DIN', 'BIM', 'FEA', 'ASTM', 'APA 7'
}

export const SPECIALIZED_TERMINOLOGY: SpecializedTerm[] = [
  // ==========================================
  // ENGINEERING & MECHANICAL (AUTO-ENGINEERING, AUTO-TECH)
  // ==========================================
  {
    id: 'eng-vibratory-sieve',
    term: 'multi-deck vibratory sieve mechanism with eccentric drive',
    termTh: 'กลไกตะแกรงสั่นคัดแยกหลายชั้นพร้อมชุดขับเคลื่อนเยื้องศูนย์',
    termEn: 'Multi-deck Vibratory Sieve Mechanism',
    category: 'mechanics',
    categoryLabelTh: 'กลไกและชิ้นส่วนกล',
    categoryLabelEn: 'Kinematics & Mechanics',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-3D'],
    keywords: ['ตะแกรง', 'สั่น', 'คัดแยก', 'sieve', 'vibratory', 'vibration', 'separator', 'grain', 'ข้าว', 'เมล็ด'],
    descriptionTh: 'ชุดตะแกรงสั่นคัดแยกขนาดและคัดกรองสิ่งเจือปนด้วยแรงเหวี่ยงกล',
    descriptionEn: 'Multi-tier oscillating screen for particle and grain stratification',
    badge: 'MECH'
  },
  {
    id: 'eng-eccentric-camshaft',
    term: 'precision eccentric camshaft with counterbalanced flywheel',
    termTh: 'เพลาลูกเบี้ยวเยื้องศูนย์พร้อมล้อตุนกำลังถ่วงดุล',
    termEn: 'Eccentric Camshaft & Counterbalanced Flywheel',
    category: 'mechanics',
    categoryLabelTh: 'กลไกและชิ้นส่วนกล',
    categoryLabelEn: 'Kinematics & Mechanics',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['เพลา', 'ลูกเบี้ยว', 'cam', 'camshaft', 'eccentric', 'เพลาเยื้องศูนย์', 'flywheel', 'ล้อตุน'],
    descriptionTh: 'เพลาขับลูกเบี้ยวแปลงการหมุนเป็นการสั่นแบบเชิงเส้นสม่ำเสมอ',
    descriptionEn: 'Rotary-to-linear oscillatory motion transformation shaft',
    badge: 'KINEMATICS'
  },
  {
    id: 'eng-planetary-gear',
    term: 'epicyclic planetary gear reduction assembly with sun gear',
    termTh: 'ชุดเฟืองทดรอบดาวเคราะห์พร้อมเฟืองสุริยะ (Planetary Gearset)',
    termEn: 'Epicyclic Planetary Gear Assembly',
    category: 'mechanics',
    categoryLabelTh: 'กลไกและชิ้นส่วนกล',
    categoryLabelEn: 'Kinematics & Mechanics',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-3D'],
    keywords: ['เฟือง', 'เกียร์', 'ทดรอบ', 'gear', 'planetary', 'epicyclic', 'torque', 'ทด'],
    descriptionTh: 'ชุดทดรอบแรงบิดสูงขนาดกะทัดรัดสำหรับการส่งกำลังเชิงกล',
    descriptionEn: 'Compact coaxial gear train for high torque power transmission',
    badge: 'ISO 6336'
  },
  {
    id: 'eng-pneumatic-actuator',
    term: 'pneumatic linear cylinder actuator with 5/2-way solenoid valve',
    termTh: 'กระบอกสูบลมเชิงเส้นพร้อมโซลินอยด์วาล์ว 5/2 ทาง',
    termEn: 'Pneumatic Linear Cylinder Actuator',
    category: 'mechanics',
    categoryLabelTh: 'กลไกและชิ้นส่วนกล',
    categoryLabelEn: 'Kinematics & Mechanics',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['กระบอกลม', 'นิวแมติก', 'วาล์ว', 'pneumatic', 'cylinder', 'actuator', 'solenoid', 'ไฮดรอลิก'],
    descriptionTh: 'ระบบขับเคลื่อนด้วยลมอัดสำหรับระบบอัตโนมัติและดันคัดแยกชิ้นงาน',
    descriptionEn: 'Compressed-air actuator system for automated sorting actuation',
    badge: 'ISO 15552'
  },
  {
    id: 'eng-pillow-bearing',
    term: 'self-aligning pillow block ball bearing units (UCP205)',
    termTh: 'ตลับลูกปืนตุ๊กตาปรับแนวได้เอง (Pillow Block Bearing)',
    termEn: 'Self-aligning Pillow Block Bearings',
    category: 'mechanics',
    categoryLabelTh: 'กลไกและชิ้นส่วนกล',
    categoryLabelEn: 'Kinematics & Mechanics',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['ตลับลูกปืน', 'แบริ่ง', 'ตุ๊กตา', 'bearing', 'pillow block', 'housing', 'เพลา', 'bush'],
    descriptionTh: 'ตลับลูกปืนรองรับเพลาหมุนพร้อมเสื้อยึดฐานต้านทานแรงสั่นสะเทือน',
    descriptionEn: 'Flange-mounted spherical roller/ball bearing for rotating drive shafts',
    badge: 'DIN 625'
  },
  {
    id: 'eng-fea-stress',
    term: 'finite element analysis (FEA) Von Mises stress tensor distribution',
    termTh: 'การวิเคราะห์ความเค้น Von Mises ด้วยระเบียบวิธีไฟไนต์เอลิเมนต์ (FEA)',
    termEn: 'FEA Von Mises Stress Gradient',
    category: 'mechanics',
    categoryLabelTh: 'กลไกและชิ้นส่วนกล',
    categoryLabelEn: 'Kinematics & Mechanics',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['ความเค้น', 'ไฟไนต์', 'fea', 'stress', 'von mises', 'strain', 'finite element', 'จำลอง'],
    descriptionTh: 'แผนภาพความเค้นเฉือนและจุดรับภาระสูงสุดของโครงสร้างโลหะ',
    descriptionEn: 'Computational stress concentration and deformation gradient map',
    badge: 'FEA'
  },

  // MATERIALS & METALLURGY (ENGINEERING)
  {
    id: 'eng-mat-sus304',
    term: 'AISI 304 food-grade stainless steel with bead-blasted satin finish',
    termTh: 'เหล็กกล้าไร้สนิมเกรดอาหาร SUS304 ผิวพ่นทรายซาติน',
    termEn: 'AISI 304 Food-Grade Stainless Steel',
    category: 'materials',
    categoryLabelTh: 'วัสดุและวิศวกรรมพื้นผิว',
    categoryLabelEn: 'Materials & Surface',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-PRODUCT'],
    keywords: ['สแตนเลส', 'สแตนเลส 304', 'sus304', 'stainless', 'steel', 'เหล็ก', 'โลหะ', 'อาหาร'],
    descriptionTh: 'สแตนเลสทนการกัดกร่อนสูง ปลอดภัยต่อสัมผัสอาหารและผลผลิตเกษตร',
    descriptionEn: 'Austenitic corrosion-resistant stainless steel for sanitary equipment',
    badge: 'AISI 304'
  },
  {
    id: 'eng-mat-al6061',
    term: 'aircraft-grade 6061-T6 aluminum alloy with hard-anodized protective coating',
    termTh: 'อลูมิเนียมอัลลอยด์เกรดอากาศยาน 6061-T6 ชุบอโนไดซ์แข็ง',
    termEn: '6061-T6 Anodized Aluminum Alloy',
    category: 'materials',
    categoryLabelTh: 'วัสดุและวิศวกรรมพื้นผิว',
    categoryLabelEn: 'Materials & Surface',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-PRODUCT'],
    keywords: ['อลูมิเนียม', 'อโนไดซ์', 'aluminum', 'alloy', '6061', 'เบา', 'โครงอะลูมิเนียม'],
    descriptionTh: 'อลูมิเนียมน้ำหนักเบาความแข็งแรงสูง ต้านทานการขูดขีดและทนแรงล้า',
    descriptionEn: 'Precipitation-hardened aluminum alloy for structural armatures',
    badge: 'ASTM B221'
  },
  {
    id: 'eng-mat-s45c',
    term: 'high-carbon structural steel S45C induction-hardened to 55 HRC',
    termTh: 'เหล็กกล้าคาร์บอนปานกลาง S45C ชุบแข็งเหนี่ยวนำความถี่สูง 55 HRC',
    termEn: 'S45C Induction Hardened Steel',
    category: 'materials',
    categoryLabelTh: 'วัสดุและวิศวกรรมพื้นผิว',
    categoryLabelEn: 'Materials & Surface',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['s45c', 'คาร์บอน', 'เหล็กเพลา', 'carbon steel', 'hardened', 'hrc', 'ชุบแข็ง'],
    descriptionTh: 'เหล็กเพลาทนแรงบิดและแรงเฉือนสูง สำหรับเพลาขับและเฟืองส่งกำลัง',
    descriptionEn: 'Medium-carbon machine structural steel for driven transmission shafts',
    badge: 'JIS G4051'
  },
  {
    id: 'eng-mat-hdpe',
    term: 'wear-resistant ultra-high-molecular-weight polyethylene (UHMW-PE) slide guide',
    termTh: 'พลาสติกวิศวกรรมทนการเสียดสี UHMW-PE สำหรับรางเลื่อน',
    termEn: 'UHMW-PE Engineering Polymer',
    category: 'materials',
    categoryLabelTh: 'วัสดุและวิศวกรรมพื้นผิว',
    categoryLabelEn: 'Materials & Surface',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['พลาสติก', 'รางเลื่อน', 'uhmw', 'hdpe', 'polymer', 'teflon', 'เทฟลอน', 'บุช'],
    descriptionTh: 'พลาสติกสัมประสิทธิ์แรงเสียดทานต่ำ ไม่ต้องหล่อลื่นและทนต่อการสึกหรอ',
    descriptionEn: 'Self-lubricating low-friction polymer guide for sliding grain trays',
    badge: 'ISO 11542'
  },

  // STANDARDS, TOLERANCES & GD&T (ENGINEERING)
  {
    id: 'eng-std-iso2768',
    term: 'ISO 2768-mK linear and angular general machining tolerance class',
    termTh: 'พิกัดความเผื่อทั่วไปงานกลึงกัดระดับปานกลางตามมาตรฐาน ISO 2768-mK',
    termEn: 'ISO 2768-mK General Tolerances',
    category: 'standards',
    categoryLabelTh: 'มาตรฐานและพิกัดความเผื่อ',
    categoryLabelEn: 'Standards & Tolerances',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['พิกัด', 'ความเผื่อ', 'tolerance', 'iso', 'iso 2768', 'ขนาด', 'มิติ', 'ระยะเผื่อ'],
    descriptionTh: 'กำหนดเกณฑ์ความคลาดเคลื่อนที่ยอมรับได้ของการผลิตเชิงอุตสาหกรรม',
    descriptionEn: 'Standard manufacturing tolerance specification for linear/angular features',
    badge: 'ISO 2768'
  },
  {
    id: 'eng-std-gdt',
    term: 'GD&T positional tolerance ⌖ 0.05 mm datum A-B-C with concentricity callout',
    termTh: 'พิกัดความเผื่อทางเรขาคณิต GD&T ตำแหน่ง ⌖ 0.05 มม. อ้างอิงดาตัม A-B-C',
    termEn: 'GD&T Geometric Dimensioning & Tolerancing',
    category: 'standards',
    categoryLabelTh: 'มาตรฐานและพิกัดความเผื่อ',
    categoryLabelEn: 'Standards & Tolerances',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['gd&t', 'gdt', 'ความร่วมศูนย์', 'ดาตัม', 'datum', 'runout', 'concentricity', 'ระนาบ'],
    descriptionTh: 'ข้อกำหนดรูปทรง ตำแหน่ง และความร่วมศูนย์ตามมาตรฐานสากล ASME Y14.5',
    descriptionEn: 'Geometric dimensioning callouts for kinematic alignment verification',
    badge: 'ASME Y14.5'
  },
  {
    id: 'eng-std-roughness',
    term: 'precision ground surface finish Ra 0.8 µm with N6 roughness class',
    termTh: 'ความเรียบผิวชิ้นงานเจียระไนละเอียด Ra 0.8 ไมครอน (เกรด N6)',
    termEn: 'Ra 0.8 µm Surface Roughness (N6)',
    category: 'standards',
    categoryLabelTh: 'มาตรฐานและพิกัดความเผื่อ',
    categoryLabelEn: 'Standards & Tolerances',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['ผิวเรียบ', 'ra', 'ความหยาบผิว', 'roughness', 'surface finish', 'ไมครอน', 'micron'],
    descriptionTh: 'ระดับความเรียบผิวสัมผัสสำหรับชิ้นส่วนตลับลูกปืนและเพลาขับความเร็วสูง',
    descriptionEn: 'Micro-inch surface profile threshold for dynamic friction interfaces',
    badge: 'ISO 4287'
  },
  {
    id: 'eng-std-h7g6',
    term: 'precision ISO hole-shaft clearance fit H7/g6 for smooth sliding rotation',
    termTh: 'พิกัดสวมสลัก-รูสวมคลอนเคลื่อนที่แม่นยำ H7/g6 (Clearance Fit)',
    termEn: 'ISO H7/g6 Precision Sliding Fit',
    category: 'standards',
    categoryLabelTh: 'มาตรฐานและพิกัดความเผื่อ',
    categoryLabelEn: 'Standards & Tolerances',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['สวมคลอน', 'พิกัดสวม', 'h7', 'g6', 'fit', 'clearance', 'interference', 'ระยะฟิต'],
    descriptionTh: 'พิกัดสวมเพลากับรูเพลาหมุนได้อย่างคล่องตัวโดยไม่มีระยะคลอนสะบัด',
    descriptionEn: 'Precision cylindrical coupling fit for reliable rotary engagement',
    badge: 'ISO 286'
  },

  // ENGINEERING DRAWING VIEWS & PROJECTIONS
  {
    id: 'eng-view-exploded',
    term: '3D exploded assembly axonometric view with numbered balloon part callouts',
    termTh: 'ภาพวาดแยกชิ้นส่วนประกอบ 3 มิติ (Exploded Assembly) พร้อมบอลลูนระบุหมายเลข',
    termEn: '3D Exploded Assembly with Callouts',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-3D'],
    keywords: ['แยกส่วน', 'ระเบิด', 'exploded', 'assembly', 'callout', 'บอลลูน', 'ชิ้นส่วน', 'bom'],
    descriptionTh: 'แสดงชิ้นส่วนทุกชิ้นดึงแยกตามแนวแกนประกอบ พร้อมเส้นบอกลำดับการประกอบ',
    descriptionEn: 'Component spatial separation along assembly vectors with BOM markers',
    badge: 'ISO 10209'
  },
  {
    id: 'eng-view-section-aa',
    term: 'full cross-sectional cutaway view A-A revealing interior mechanical flow',
    termTh: 'ภาพตัดผ่าครึ่งมุมมอง A-A (Section Cutaway) เผยให้เห็นกลไกการไหลภายใน',
    termEn: 'Cross-Sectional Cutaway A-A',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-3D'],
    keywords: ['ภาพตัด', 'ผ่าครึ่ง', 'section', 'cutaway', 'cross section', 'ตัด', 'ภายใน', 'cross-sectional'],
    descriptionTh: 'ผ่าครึ่งชิ้นงานด้วยเส้นแฮทช์ลายตัด 45 องศาเพื่อแสดงกลไกภายใน',
    descriptionEn: 'Sectional hatch plane cutting through internal chambers and bearings',
    badge: 'ISO 128'
  },
  {
    id: 'eng-view-third-angle',
    term: 'third-angle orthographic projection (top, front, and right side views with dimensions)',
    termTh: 'ภาพฉายออร์โธกราฟิกมุมที่ 3 (Third-Angle Projection) แสดงด้านบน ด้านหน้า ด้านข้าง',
    termEn: 'Third-Angle Orthographic Views',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['ภาพฉาย', 'มุมมองที่ 3', 'orthographic', 'third angle', 'top view', 'front view', 'ด้านหน้า', 'ด้านข้าง'],
    descriptionTh: 'การฉายภาพ 3 ด้านตามมาตรฐานอุตสาหกรรมสากล พร้อมเส้นกำหนดขนาด',
    descriptionEn: 'Standard 3-view orthogonal drawing layout for fabrication fabrication',
    badge: 'ISO 5456'
  },
  {
    id: 'eng-view-isometric-grid',
    term: 'true 30-degree isometric axonometric grid projection with technical border',
    termTh: 'ภาพไอโซเมตริกทำมุม 30 องศาบนกริดวิศวกรรมพร้อมกรอบแบบมาตรฐาน',
    termEn: 'True 30° Isometric Wireframe Grid',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ENGINEERING', '/AUTO-TECH', '/AUTO-ARCH', '/AUTO-3D'],
    keywords: ['ไอโซเมตริก', 'isometric', '30 องศา', 'axonometric', 'wireframe', 'กริด', '3d'],
    descriptionTh: 'มุมมองไอโซเมตริก 30 องศา สัดส่วน 1:1:1 ไม่มีการบิดเบี้ยวของระยะ',
    descriptionEn: 'True isometric projection maintaining 1:1 scaling along coordinate axes',
    badge: 'ISO 5456'
  },

  // ==========================================
  // ARCHITECTURAL DESIGN (AUTO-ARCH)
  // ==========================================
  {
    id: 'arch-post-tensioned',
    term: 'post-tensioned reinforced concrete slab with tendon profile ducting',
    termTh: 'พื้นคอนกรีตอัดแรงชนิดดึงทีหลัง (Post-Tensioned Concrete Slab)',
    termEn: 'Post-Tensioned Concrete Slab',
    category: 'structural',
    categoryLabelTh: 'โครงสร้างทางสถาปัตยกรรม',
    categoryLabelEn: 'Architectural Structure',
    modes: ['/AUTO-ARCH', '/AUTO-ENGINEERING'],
    keywords: ['คอนกรีต', 'อัดแรง', 'พื้น', 'slab', 'post tension', 'post-tensioned', 'tendon', 'สลิง'],
    descriptionTh: 'พื้นคอนกรีตช่วงเสากว้างไร้คานเพื่อเพิ่มพื้นที่ใช้สอยทางสถาปัตยกรรม',
    descriptionEn: 'Long-span structural slab reinforced with pre-stressed tensioned steel strands',
    badge: 'ACI 318'
  },
  {
    id: 'arch-shear-wall',
    term: 'cast-in-place reinforced concrete shear wall core for lateral seismic resistance',
    termTh: 'แกนผนังรับแรงเฉือนคอนกรีตเสริมเหล็กต้านทานแรงแผ่นดินไหว (Shear Wall)',
    termEn: 'Reinforced Concrete Shear Wall Core',
    category: 'structural',
    categoryLabelTh: 'โครงสร้างทางสถาปัตยกรรม',
    categoryLabelEn: 'Architectural Structure',
    modes: ['/AUTO-ARCH', '/AUTO-ENGINEERING'],
    keywords: ['ผนังรับแรง', 'เชียร์วอลล์', 'shear wall', 'แกนลิฟต์', 'seismic', 'แผ่นดินไหว', 'โครงสร้าง'],
    descriptionTh: 'ผนังรับแรงเฉือนและแรงลมของอาคารสูงเพื่อความปลอดภัยเชิงโครงสร้าง',
    descriptionEn: 'Vertical structural walls engineered to resist lateral wind and seismic loads',
    badge: 'IBC 2024'
  },
  {
    id: 'arch-space-frame',
    term: 'triangulated structural steel space-frame canopy truss with MERO ball nodes',
    termTh: 'โครงหลังคาถักสามมิติแบบสเปซเฟรม (Space Frame) พร้อมลูกบอลข้อต่อ MERO',
    termEn: 'Space-Frame Truss with MERO Nodes',
    category: 'structural',
    categoryLabelTh: 'โครงสร้างทางสถาปัตยกรรม',
    categoryLabelEn: 'Architectural Structure',
    modes: ['/AUTO-ARCH', '/AUTO-ENGINEERING', '/AUTO-3D'],
    keywords: ['สเปซเฟรม', 'โครงหลังคา', 'space frame', 'truss', 'หลังคาถัก', 'mero', 'canopy', 'หลังคา'],
    descriptionTh: 'โครงสร้างหลังคาโปร่งช่วงกว้างน้ำหนักเบา รับแรงดึงและแรงอัดแบบ 3 มิติ',
    descriptionEn: 'Rigid 3-dimensional truss system spanning large column-free interior spaces',
    badge: 'AISC 360'
  },
  {
    id: 'arch-curtain-wall',
    term: 'unitized double-glazed Low-E curtain wall facade with thermally broken aluminum mullions',
    termTh: 'ผนังกระจกเคอร์เทนวอลล์แบบยูนิตสองชั้น Low-E พร้อมโครงมัลเลียนตัดสะพานความร้อน',
    termEn: 'Unitized Low-E Double-Glazed Curtain Wall',
    category: 'structural',
    categoryLabelTh: 'โครงสร้างทางสถาปัตยกรรม',
    categoryLabelEn: 'Architectural Structure',
    modes: ['/AUTO-ARCH', '/AUTO-3D', '/AUTO-PRODUCT'],
    keywords: ['กระจก', 'เคอร์เทนวอลล์', 'curtain wall', 'facade', 'low-e', 'ฟาซาด', 'เปลือกอาคาร', 'mullion'],
    descriptionTh: 'ผนังกระจกประหยัดพลังงานกันความร้อนและรังสี UV พร้อมรอยต่อกันน้ำรั่วซึม',
    descriptionEn: 'High-performance solar control insulated glass envelope facade system',
    badge: 'AAMA 501'
  },
  {
    id: 'arch-cantilever',
    term: 'structural cantilevered steel overhang canopy with tension tie rods',
    termTh: 'กันสาดโครงสร้างเหล็กยื่นย้อยไร้เสาค้ำ (Cantilever) พร้อมสลิงดึงรับแรง',
    termEn: 'Cantilevered Steel Overhang Canopy',
    category: 'structural',
    categoryLabelTh: 'โครงสร้างทางสถาปัตยกรรม',
    categoryLabelEn: 'Architectural Structure',
    modes: ['/AUTO-ARCH', '/AUTO-ENGINEERING'],
    keywords: ['กันสาด', 'โครงยื่น', 'cantilever', 'overhang', 'คานยื่น', 'ไร้เสา'],
    descriptionTh: 'โครงสร้างยื่นลอยตัวสร้างร่มเงาและมุมมองทางสถาปัตยกรรมที่โดดเด่น',
    descriptionEn: 'Projecting structural beam supported only at one anchored end',
    badge: 'STRUCT'
  },

  // ARCHITECTURAL PLANS, SECTIONS & VIEWS
  {
    id: 'arch-view-longitudinal-sec',
    term: 'detailed longitudinal architectural building section showing vertical circulation and floor slabs',
    termTh: 'รูปตัดสถาปัตยกรรมตามยาว (Longitudinal Section) แสดงโถงสัญจรและระดับชั้น',
    termEn: 'Longitudinal Building Section',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ARCH', '/AUTO-TECH'],
    keywords: ['รูปตัด', 'section', 'longitudinal', 'ตัดตามยาว', 'ระดับพื้น', 'ความสูงชั้น', 'ตัด'],
    descriptionTh: 'แสดงความสัมพันธ์เชิงพื้นที่ ความสูงระหว่างชั้น และระบบสัญจรแนวดิ่ง',
    descriptionEn: 'Vertical cut revealing spatial hierarchy, ceiling heights, and stair/elevator shafts',
    badge: 'ARCH-SEC'
  },
  {
    id: 'arch-view-ground-plan',
    term: 'dimensioned ground floor architectural layout plan with furniture, door swings, and egress paths',
    termTh: 'แปลนพื้นชั้นล่างสถาปัตยกรรม (Ground Floor Plan) พร้อมแนวเปิดประตูและเส้นทางหนีไฟ',
    termEn: 'Dimensioned Ground Floor Plan',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ARCH', '/AUTO-TECH'],
    keywords: ['แปลน', 'แปลนพื้น', 'floor plan', 'ground plan', 'ผังพื้น', 'ทางเดิน', 'ประตู', 'egress'],
    descriptionTh: 'ผังพื้นแสดงการแบ่งพื้นที่ใช้สอย การเข้าถึง และมิติระยะที่ชัดเจน',
    descriptionEn: 'Horizontal projection at 1.20m cut level displaying circulation and room zones',
    badge: 'ARCH-PLAN'
  },
  {
    id: 'arch-view-reflected-ceiling',
    term: 'reflected ceiling plan (RCP) coordinating recessed linear luminaires and HVAC diffusers',
    termTh: 'แปลนฝ้าเพดานสะท้อน (RCP) จัดวางตำแหน่งโคมไฟฝังและหัวจ่ายลมปรับอากาศ',
    termEn: 'Reflected Ceiling Plan (RCP)',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ARCH', '/AUTO-TECH'],
    keywords: ['ฝ้าเพดาน', 'rcp', 'reflected ceiling', 'โคมไฟ', 'แสงสว่าง', 'หัวจ่ายลม', 'hvac diffusers'],
    descriptionTh: 'ผังระบบไฟส่องสว่าง ระบบดับเพลิง และช่องจ่ายแอร์ที่ฝ้าเพดาน',
    descriptionEn: 'Ceiling layout mapping electrical lighting fixtures and MEP distribution diffusers',
    badge: 'RCP'
  },
  {
    id: 'arch-view-site-contour',
    term: 'site development plan with 1.0m contour topography, vehicular circulation, and setback boundaries',
    termTh: 'ผังบริเวณโครงการ (Site Plan) แสดงเส้นชั้นความสูง 1.0 ม. ทางสัญจร และระยะร่นกฎหมาย',
    termEn: 'Topographical Site & Master Plan',
    category: 'views',
    categoryLabelTh: 'มุมมองและการฉายภาพ',
    categoryLabelEn: 'Projection & Views',
    modes: ['/AUTO-ARCH'],
    keywords: ['ผังบริเวณ', 'site plan', 'contour', 'ความสูงดิน', 'ระยะร่น', 'ที่จอดรถ', 'topography'],
    descriptionTh: 'ผังแม่บทแสดงความลาดชันของดิน ทางเข้าออกอาคาร และแนวเขตที่ดิน',
    descriptionEn: 'Master layout showing site boundaries, topographic contours, and access routes',
    badge: 'SITE'
  },

  // ARCHITECTURAL BIM & MATERIALS
  {
    id: 'arch-bim-lod350',
    term: 'BIM Level of Development (LOD) 350 modeled assembly with MEP clash detection',
    termTh: 'แบบจำลองสารสนเทศอาคาร BIM LOD 350 พร้อมการตรวจสอบการชนกันของระบบ (Clash Detection)',
    termEn: 'BIM LOD 350 Model with Clash Detection',
    category: 'bim',
    categoryLabelTh: 'ระบบ BIM และสารสนเทศอาคาร',
    categoryLabelEn: 'BIM & Building Information',
    modes: ['/AUTO-ARCH', '/AUTO-ENGINEERING'],
    keywords: ['bim', 'lod', 'lod 350', 'clash', 'revit', 'แบบจำลองอาคาร', 'mep', 'ท่อชน'],
    descriptionTh: 'ความละเอียดของโมเดลสำหรับการก่อสร้างจริง ประสานงานสถาปัตย์-โครงสร้าง-งานระบบ',
    descriptionEn: 'Precise BIM elements with exact geometry, connections, and clash clearance',
    badge: 'BIM LOD 350'
  },
  {
    id: 'arch-mat-fairfaced-concrete',
    term: 'exposed fair-faced board-formed architectural concrete with visible tie-rod holes',
    termTh: 'คอนกรีตเปลือยลายไม้แบบหล่อ (Board-Formed Concrete) พร้อมรูยึดไทร็อดสม่ำเสมอ',
    termEn: 'Board-Formed Architectural Concrete',
    category: 'materials',
    categoryLabelTh: 'วัสดุและวิศวกรรมพื้นผิว',
    categoryLabelEn: 'Materials & Surface',
    modes: ['/AUTO-ARCH', '/AUTO-3D'],
    keywords: ['คอนกรีตเปลือย', 'ปูนเปลือย', 'concrete', 'board formed', 'tie rod', 'สถาปัตยกรรม'],
    descriptionTh: 'คอนกรีตโชว์เนื้อแท้ลายเสี้ยนไม้ธรรมชาติ สไตล์ Brutalist หรือ Modern Minimalist',
    descriptionEn: 'Cast concrete retaining distinctive timber grain texture and formwork indentations',
    badge: 'MAT'
  },
  {
    id: 'arch-mat-clt',
    term: 'sustainable cross-laminated timber (CLT) structural floor and wall panels',
    termTh: 'แผ่นไม้ประกอบข้ามชั้นโครงสร้างยั่งยืน (Cross-Laminated Timber - CLT)',
    termEn: 'Cross-Laminated Timber (CLT)',
    category: 'materials',
    categoryLabelTh: 'วัสดุและวิศวกรรมพื้นผิว',
    categoryLabelEn: 'Materials & Surface',
    modes: ['/AUTO-ARCH', '/AUTO-ENGINEERING'],
    keywords: ['ไม้clt', 'clt', 'ไม้โครงสร้าง', 'timber', 'sustainable', 'กรีนบิลดิ้ง', 'wood'],
    descriptionTh: 'วัสดุคาร์บอนต่ำสำหรับอาคารไม้สูง เป็นมิตรต่อสิ่งแวดล้อมและแข็งแรง',
    descriptionEn: 'Engineered mass timber panel manufactured from orthogonally glued lumber layers',
    badge: 'LEED/CLT'
  },
  {
    id: 'arch-passive-louvers',
    term: 'parametric motorized sun-shading louvers optimized for solar zenith angles',
    termTh: 'แผงระแนงบังแดดพาราเมตริกปรับองศาอัตโนมัติตามมุมตกกระทบของดวงอาทิตย์',
    termEn: 'Parametric Solar Shading Louvers',
    category: 'structural',
    categoryLabelTh: 'โครงสร้างทางสถาปัตยกรรม',
    categoryLabelEn: 'Architectural Structure',
    modes: ['/AUTO-ARCH'],
    keywords: ['ระแนง', 'บังแดด', 'louver', 'shading', 'parametric', 'solar', 'แดด', 'ฟาซาด'],
    descriptionTh: 'อุปกรณ์บังแดดสถาปัตยกรรมลดความร้อนเข้าสู่อาคารโดยไม่บดบังแสงธรรมชาติ',
    descriptionEn: 'Kinetic or static sun louvers calculated for maximum seasonal shading coefficient',
    badge: 'PASSIVE'
  },

  // ==========================================
  // RESEARCH FIGURES & ACADEMIC STANDARDS (AUTO-RESEARCH, AUTO-ACADEMIC)
  // ==========================================
  {
    id: 'res-conceptual-framework',
    term: 'conceptual research framework diagram showing directional path coefficients and mediating hypotheses',
    termTh: 'แผนภาพกรอบแนวคิดการวิจัย (Conceptual Framework) แสดงสัมประสิทธิ์เส้นทางและตัวแปรส่งผ่าน',
    termEn: 'Conceptual Research Framework Diagram',
    category: 'research',
    categoryLabelTh: 'แผนภาพวิจัยและมาตรฐาน APA 7th',
    categoryLabelEn: 'Research & APA 7th Standard',
    modes: ['/AUTO-RESEARCH', '/AUTO-ACADEMIC', '/AUTO-DIAGRAM'],
    keywords: ['กรอบแนวคิด', 'วิจัย', 'conceptual framework', 'ตัวแปร', 'hypothesis', 'thesis', 'apa'],
    descriptionTh: 'แผนภาพแสดงความสัมพันธ์ระหว่างตัวแปรอิสระ ตัวแปรส่งผ่าน และตัวแปรตามอย่างชัดเจน',
    descriptionEn: 'Structured schematic illustrating hypothesized theoretical interactions',
    badge: 'APA 7th'
  },
  {
    id: 'res-error-bar',
    term: 'quantitative dual-axis bar plot with ±1 standard error margin and p < 0.01 significance markers',
    termTh: 'แผนภูมิแท่งแกนคู่พร้อมแถบแสดงค่าความคลาดเคลื่อนมาตรฐาน (±1 SE) และระดับนัยสำคัญ p < 0.01',
    termEn: 'Quantitative Error Bar Plot (p < 0.01)',
    category: 'research',
    categoryLabelTh: 'แผนภาพวิจัยและมาตรฐาน APA 7th',
    categoryLabelEn: 'Research & APA 7th Standard',
    modes: ['/AUTO-RESEARCH', '/AUTO-ACADEMIC', '/AUTO-INFOGRAPHIC'],
    keywords: ['error bar', 'สถิติ', 'นัยสำคัญ', 'p value', 'ค่าความคลาดเคลื่อน', 'กราฟ', 'วิจัย'],
    descriptionTh: 'การนำเสนอข้อมูลเชิงปริมาณทางวิชาการตามหลัก Evidence First ปราศจากข้อมูลแต่งเติม',
    descriptionEn: 'Empirical data visualization with statistical error bounds and confidence intervals',
    badge: 'EVIDENCE'
  },
  {
    id: 'res-apa-typography',
    term: 'APA 7th edition publication format with sans-serif 8-10 pt labels and formal figure caption',
    termTh: 'รูปแบบการจัดวางตัวอักษรและแคปชันแผนภาพตามเกณฑ์มาตรฐาน APA ฉบับที่ 7',
    termEn: 'APA 7th Edition Figure Typography',
    category: 'research',
    categoryLabelTh: 'แผนภาพวิจัยและมาตรฐาน APA 7th',
    categoryLabelEn: 'Research & APA 7th Standard',
    modes: ['/AUTO-RESEARCH', '/AUTO-ACADEMIC'],
    keywords: ['apa 7', 'apa', 'ฟอนต์วิจัย', 'caption', 'scopus', 'tci', 'วารสาร', 'วิชาการ'],
    descriptionTh: 'ขนาดอักษร เส้นกรอบ และคำบรรยายใต้ภาพตามมาตรฐานวารสารวิชาการระดับสากล',
    descriptionEn: 'Academic journal layout typography complying with APA 7th guidelines',
    badge: 'APA 7th'
  },

  // ==========================================
  // 3D / CGI & ADVANCED RENDERING (AUTO-3D, AUTO-PHOTO, AUTO-CINEMA)
  // ==========================================
  {
    id: 'render-pbr-workflow',
    term: 'physically-based rendering (PBR) metallic-roughness workflow with microfacet specular reflections',
    termTh: 'การเรนเดอร์พื้นผิวเสมือนจริงตามหลักฟิสิกส์ (PBR Metallic-Roughness)',
    termEn: 'PBR Metallic-Roughness Material',
    category: 'rendering',
    categoryLabelTh: 'การเรนเดอร์และฟิสิกส์แสง 3D',
    categoryLabelEn: '3D Rendering & Optics',
    modes: ['/AUTO-3D', '/AUTO-PHOTO', '/AUTO-PRODUCT'],
    keywords: ['pbr', 'เรนเดอร์', 'metallic', 'roughness', 'วัสดุ3d', 'เงา', 'สะท้อน', 'specular'],
    descriptionTh: 'การคำนวณการกระจายแสงและการสะท้อนตามคุณสมบัติทางฟิสิกส์ของเนื้อวัสดุจริง',
    descriptionEn: 'Accurate energy-conserving material shader simulating real-world light bounce',
    badge: 'PBR'
  },
  {
    id: 'render-ambient-occlusion',
    term: 'contact ambient occlusion pass emphasizing mechanical seams and structural crevasses',
    termTh: 'การสร้างแสงเงาตกกระทบซอกมุม (Ambient Occlusion) เน้นรอยต่อและร่องเครื่องกล',
    termEn: 'Contact Ambient Occlusion (AO)',
    category: 'rendering',
    categoryLabelTh: 'การเรนเดอร์และฟิสิกส์แสง 3D',
    categoryLabelEn: '3D Rendering & Optics',
    modes: ['/AUTO-3D', '/AUTO-TECH', '/AUTO-ENGINEERING'],
    keywords: ['ao', 'ambient occlusion', 'เงา', 'รอยต่อ', 'ซอก', 'ความลึก', 'แสงเงา'],
    descriptionTh: 'ช่วยขับเน้นมิติความลึก รอยประกอบชิ้นส่วน และขอบมุมเชิงกลให้ชัดเจนคมชัด',
    descriptionEn: 'Contact shadow depth computation accentuating joint geometry and component recesses',
    badge: 'CGI'
  },
  {
    id: 'render-dof-f8',
    term: 'controlled deep depth-of-field at f/8 with zero chromatic aberration',
    termTh: 'การควบคุมระยะชัดลึกแบบกว้าง f/8 เพื่อความคมชัดตลอดทุกชิ้นส่วน ไร้ความคลาดสี',
    termEn: 'Deep Depth-of-Field (f/8 Aperture)',
    category: 'rendering',
    categoryLabelTh: 'การเรนเดอร์และฟิสิกส์แสง 3D',
    categoryLabelEn: '3D Rendering & Optics',
    modes: ['/AUTO-3D', '/AUTO-PHOTO', '/AUTO-ENGINEERING', '/AUTO-TECH'],
    keywords: ['f8', 'ชัดลึก', 'dof', 'depth of field', 'รูรับแสง', 'ไม่เบลอ', 'คมชัด'],
    descriptionTh: 'ทุกชิ้นส่วนในภาพทั้งด้านหน้าและด้านหลังมีความคมชัดเพื่อการตรวจสอบทางวิศวกรรม',
    descriptionEn: 'Broad focal plane ensuring complete mechanical assembly clarity without distortion',
    badge: 'OPTICS'
  }
];

/**
 * Returns terms that belong to the active mode or engineering/architectural umbrella.
 */
export function getTermsForMode(mode: string): SpecializedTerm[] {
  // Normalize mode string (handles with or without leading slash, uppercase/lowercase)
  const normalized = mode.toUpperCase();

  // If specific mode matched directly:
  const directMatches = SPECIALIZED_TERMINOLOGY.filter((t) =>
    t.modes.some((m) => m.toUpperCase() === normalized || normalized.includes(m.replace('/', '').toUpperCase()))
  );

  if (directMatches.length > 0) {
    return directMatches;
  }

  // If mode relates to engineering/tech
  if (normalized.includes('ENGINEER') || normalized.includes('TECH') || normalized.includes('CAD')) {
    return SPECIALIZED_TERMINOLOGY.filter((t) =>
      t.modes.includes('/AUTO-ENGINEERING') || t.modes.includes('/AUTO-TECH')
    );
  }

  // If mode relates to architecture
  if (normalized.includes('ARCH') || normalized.includes('PLAN') || normalized.includes('BUILDING')) {
    return SPECIALIZED_TERMINOLOGY.filter((t) => t.modes.includes('/AUTO-ARCH'));
  }

  // If mode relates to research/academic
  if (normalized.includes('RESEARCH') || normalized.includes('ACADEMIC') || normalized.includes('DIAGRAM')) {
    return SPECIALIZED_TERMINOLOGY.filter((t) =>
      t.modes.includes('/AUTO-RESEARCH') || t.modes.includes('/AUTO-ACADEMIC')
    );
  }

  // Fallback: return high-value engineering & architectural vocabulary
  return SPECIALIZED_TERMINOLOGY.slice(0, 12);
}

/**
 * Predictive query matching based on what the user is typing.
 */
export function queryPredictiveTerms(
  mode: string,
  query: string,
  limit: number = 8
): SpecializedTerm[] {
  const terms = getTermsForMode(mode);
  const clean = query.trim().toLowerCase();

  if (!clean) {
    return terms.slice(0, limit);
  }

  // Score each term based on keyword and string match
  const scored = terms.map((t) => {
    let score = 0;

    // Direct term match
    if (t.term.toLowerCase().includes(clean)) score += 10;
    if (t.termTh.toLowerCase().includes(clean)) score += 10;
    if (t.termEn.toLowerCase().includes(clean)) score += 8;

    // Keyword match
    t.keywords.forEach((kw) => {
      const kwLower = kw.toLowerCase();
      if (kwLower === clean) score += 15;
      else if (kwLower.includes(clean) || clean.includes(kwLower)) score += 6;
    });

    // Badge match (e.g. "ISO", "FEA", "BIM", "GD&T")
    if (t.badge && t.badge.toLowerCase().includes(clean)) score += 7;

    return { term: t, score };
  });

  const matches = scored.filter((item) => item.score > 0);
  matches.sort((a, b) => b.score - a.score);

  if (matches.length > 0) {
    return matches.slice(0, limit).map((m) => m.term);
  }

  // If no match found but query is short, return mode defaults
  return terms.slice(0, limit);
}
