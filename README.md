# How the World Connects: The Internet in 9 Minutes

Video explainer data (Remotion 4, 1920x1080, 30 fps, 9:05 = 16.350 frame).
Hanya SVG + CSS + React, tanpa aset video/gambar. Font Inter diunduh sekali dari Google Fonts.

## 1. Instal
```
npm install
```
Butuh Node.js 18+. Chromium untuk render diunduh otomatis pertama kali (~200 MB).

## 2. Pratinjau
```
npm start
```

## 3. Render per chunk 60 detik (hemat RAM & disk)
```
npm run render:chunks
```
- Total 10 chunk: `out/chunk-01.mp4` ... `out/chunk-10.mp4` (chunk terakhir hanya 5 detik).
- Bisa dilanjutkan: kalau terhenti, jalankan lagi, chunk yang sudah selesai dilewati.
- Manual satu chunk (catatan: `--frames` inklusif, jadi 60 detik = 0-1799, bukan 0-1800):
  ```
  npx remotion render src/index.ts Main out/chunk-01.mp4 --frames=0-1799 --concurrency=1
  npx remotion render src/index.ts Main out/chunk-02.mp4 --frames=1800-3599 --concurrency=1
  ```

## 4. Gabung dengan FFmpeg
```
npm run render:merge
```
atau manual (file `out/list.txt` dibuat otomatis):
```
ffmpeg -f concat -safe 0 -i out/list.txt -c copy out/final.mp4
```

## 5. Subtitle & suara
- Teks narasi ada di `voiceover.json`. `npm run subtitles` membuat ulang `subtitles.json` (150 wpm).
- Setelah rekam suara asli, ganti `subtitles.json` dengan hasil transkripsi (format `@remotion/captions`).
- Semua waktu animasi ada di `BEATS` pada `src/data.ts`; durasi scene di `src/timing.json`.

## Catatan
- Angka di `src/data.ts` bersifat ilustratif (dibulatkan dari estimasi ITU). Verifikasi sebelum publikasi.
- Semua paket Remotion harus versi yang sama (4.0.250). Kalau npm menolak versi itu, samakan semuanya ke versi 4.0.x terbaru.
