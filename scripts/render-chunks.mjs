// Render per 60 detik (1800 frame) supaya RAM/disk aman. Bisa dilanjutkan:
// chunk yang sudah ada di out/ dilewati.
//   node scripts/render-chunks.mjs          -> render semua chunk
//   node scripts/render-chunks.mjs --merge  -> render lalu gabung dengan FFmpeg
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const timing = JSON.parse(fs.readFileSync('src/timing.json', 'utf8'));
const total = timing.scenes.reduce((a, s) => a + s.seconds, 0) * timing.fps;
const CHUNK = 60 * timing.fps;

fs.mkdirSync('out', {recursive: true});
const files = [];

for (let start = 0, n = 1; start < total; start += CHUNK, n++) {
  const end = Math.min(start + CHUNK, total) - 1; // --frames inklusif
  const name = `chunk-${String(n).padStart(2, '0')}.mp4`;
  files.push(name);
  if (fs.existsSync(`out/${name}`)) {
    console.log(`Lewati ${name} (sudah ada)`);
    continue;
  }
  console.log(`\n=== ${name}: frame ${start}-${end} ===`);
  const r = spawnSync(
    'npx',
    ['remotion', 'render', 'src/index.ts', 'Main', `out/${name}`, `--frames=${start}-${end}`, '--concurrency=1'],
    {stdio: 'inherit', shell: true},
  );
  if (r.status !== 0) {
    console.error(`Gagal di ${name}. Jalankan lagi, chunk yang selesai akan dilewati.`);
    process.exit(1);
  }
}

fs.writeFileSync('out/list.txt', files.map((f) => `file '${f}'`).join('\n') + '\n');
console.log('\nSemua chunk selesai. Daftar gabung: out/list.txt');

if (process.argv.includes('--merge')) {
  const m = spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', 'out/list.txt', '-c', 'copy', 'out/final.mp4'], {
    stdio: 'inherit',
    shell: true,
  });
  process.exit(m.status ?? 1);
} else {
  console.log('Gabung: ffmpeg -f concat -safe 0 -i out/list.txt -c copy out/final.mp4');
}
