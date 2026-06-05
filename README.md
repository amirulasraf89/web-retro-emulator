<div align="center">

# 🕹️ Retro Web Emulator

**Emulator konsol retro terus dalam pelayar web anda — tanpa install, tanpa repot.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>

---

## ✨ Tentang Projek

**Retro Web Emulator** adalah aplikasi web progresif (PWA) yang membolehkan anda memainkan permainan konsol retro klasik terus dalam pelayar — tanpa perlu memasang sebarang perisian tambahan.

Sokong **7 konsol** ikonik dari era keemasan permainan video, semua dalam satu antara muka yang bersih dan moden.

---

## 🎮 Konsol Yang Disokong

| Konsol | Core | Laluan |
|--------|------|--------|
| 🕹️ Arcade / NeoGeo | `fbneo` | `/neogeo` |
| 🎮 PlayStation 1 | `psx` | `/psx` |
| 🟥 Nintendo 64 | `n64` | `/n64` |
| 🟣 Super Nintendo (SNES) | `snes` | `/snes` |
| ⬜ Nintendo (NES) | `nes` | `/nes` |
| 🟡 Game Boy Advance | `gba` | `/gba` |
| 🔵 Sega Mega Drive | `genesis` | `/segag` |

---

## 🚀 Mula Jalankan

### Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- npm / yarn / pnpm

### Pemasangan

```bash
# 1. Klon repositori
git clone https://github.com/amirulasraf89/web-retro-emulator.git
cd web-retro-emulator

# 2. Salin fail persekitaran
cp .env.example .env

# 3. Pasang kebergantungan
npm install

# 4. Jalankan pelayan pembangunan
npm run dev
```

Buka pelayar dan pergi ke **http://localhost:3000**

### Bina untuk Pengeluaran

```bash
npm run build
npm run preview
```

---

## 🗂️ Struktur Projek

```
web-retro-emulator/
├── src/
│   ├── pages/          # Halaman setiap konsol (psx, n64, snes, gba...)
│   ├── components/     # Komponen boleh guna semula (ConsolePlayer)
│   ├── App.tsx         # Pemasangan laluan utama
│   └── main.tsx        # Titik masuk aplikasi
├── public/             # Aset statik & fail PWA
├── dist/               # Output binaan (dijana automatik)
├── vite.config.ts      # Konfigurasi Vite + PWA
└── vercel.json         # Konfigurasi deploy Vercel
```

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| **React 19** | Rangka kerja UI |
| **TypeScript** | Menaip statik |
| **Vite** | Alat binaan |
| **Tailwind CSS v4** | Gaya UI |
| **React Router v7** | Navigasi halaman |
| **vite-plugin-pwa** | Sokongan PWA |
| **Lucide React** | Ikon |
| **Motion** | Animasi |
| **Google GenAI** | Integrasi AI |

---

## ☁️ Deploy

Projek ini dikonfigurasi untuk deploy ke **Vercel** dan **Firebase Hosting**.

### Vercel (Disyorkan)

```bash
npx vercel --prod
```

### Firebase

```bash
npm run build
firebase deploy
```

---

## 📄 Lesen

Projek ini dibina untuk tujuan pendidikan dan peribadi.  
Sila pastikan anda memiliki ROM yang anda mainkan secara sah.

---

<div align="center">

Dibuat dengan ❤️ oleh **[amirulasraf89](https://github.com/amirulasraf89)**

</div>
