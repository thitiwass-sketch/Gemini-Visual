# 🤖 Gemini Visual AI OS v5.1

**Gemini Visual AI OS v5.1** เป็นระบบปฏิบัติการเชิงการมองเห็น (Visual AI Operating System) บนเว็บแอปพลิเคชัน ขับเคลื่อนด้วยปัญญาประดิษฐ์และสถาปัตยกรรมที่ประมวลผลด้วยเทคโนโลยีสมัยใหม่

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend Framework:** React + [Vite](https://vitejs.dev/) (`vite.config.ts`)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (99.4%)
* **Runtime & Package Manager:** [Bun](https://bun.sh/) (`bun.lock`)
* **Database & Backend Services:** Firebase / Cloud Firestore (`firestore.rules`, `firebase-blueprint.json`, `firebase-applet-config.json`)
* **Server Execution:** TypeScript (`server.ts`)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
Gemini-Visual/
├── public/assets/aistudio/     # รูปภาพ สื่อ และ Static Assets สำหรับ AI Studio
├── src/                        # ซอร์สโค้ดหลักของแอปพลิเคชัน (React Components, UI, Hooks)
├── .env.example                # ตัวอย่างการตั้งค่า Environment Variables / API Keys
├── .gitignore                  # รายการไฟล์ที่ไม่ต้องการจัดเก็บลง Git Repository
├── bun.lock                    # ไฟล์ Lock Dependencies ของ Bun
├── firebase-applet-config.json # ไฟล์ตั้งค่าคอนฟิก Firebase Applet
├── firebase-blueprint.json     # ผังโครงสร้างพิมพ์เขียวข้อมูลของ Firebase
├── firestore.rules             # กฎความปลอดภัยของ Firestore Database
├── index.html                  # ไฟล์ HTML หลักสำหรับแสดงผลเว็บแอปพลิเคชัน
├── metadata.json               # รายละเอียด Metadata ของระบบ
├── package.json                # รายชื่อ Dependencies และ Command Scripts
├── server.ts                   # ไฟล์เซิร์ฟเวอร์หลัก (TypeScript / Bun Server)
├── tsconfig.json               # การตั้งค่าตัวแปลภาษา TypeScript
└── vite.config.ts              # การตั้งค่า Build และ Dev Server ด้วย Vite
```

---

## 🚀 การติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)

ต้องติดตั้ง **Bun** บนเครื่องพัฒนาเรียบร้อยแล้ว:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. ดาวน์โหลดโปรเจกต์ (Clone Repository)

```bash
git clone https://github.com/thitiwass-sketch/Gemini-Visual.git
cd Gemini-Visual
```

### 3. ติดตั้ง Dependencies

```bash
bun install
```

### 4. ตั้งค่า Environment Variables

คัดลอกไฟล์ตัวอย่าง `.env.example` ไปเป็น `.env` แล้วใส่ค่า API Key / Firebase Config:

```bash
cp .env.example .env
```

### 5. การรันโปรเจกต์ (Running the Project)

* **รัน Development Server (Vite):**
  ```bash
  bun run dev
  ```
* **รัน Backend / Server:**
  ```bash
  bun server.ts
  ```
* **การ Build สำหรับ Production:**
  ```bash
  bun run build
  ```

---

## 👥 ผู้พัฒนา (Contributors)

* **Thitiwass Kanchanaphimai** ([@thitiwass-sketch](https://github.com/thitiwass-sketch))

---

## 📄 License

พัฒนาสำหรับ **Gemini Visual AI OS v5.1 Project**
