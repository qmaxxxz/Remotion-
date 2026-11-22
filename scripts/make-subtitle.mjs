// Membuat subtitles.json (format Caption dari @remotion/captions) dari voiceover.json.
// Waktu dihitung dari kecepatan bicara (wpm). Setelah rekam suara asli,
// ganti dengan hasil transkripsi (mis. Whisper) agar tepat.
import fs from 'node:fs';

const timing = JSON.parse(fs.readFileSync('src/timing.json', 'utf8'));
const vo = JSON.parse(fs.readFileSync('voiceover.json', 'utf8'));
const secPerWord = 60 / vo.wpm;

const info = {};
let acc = 0;
for (const s of timing.scenes) {
  info[s.id] = {start: acc, seconds: s.seconds};
  acc += s.seconds;
}

const out = [];
for (const sc of vo.scenes) {
  const {start, seconds} = info[sc.id];
  let t = start + (sc.offsetSeconds ?? 0);
  const sentences = sc.text.match(/[^.!?]+[.!?]+/g) ?? [sc.text];
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    const parts = Math.ceil(words.length / 12);
    const size = Math.ceil(words.length / parts);
    for (let i = 0; i < words.length; i += size) {
      const chunk = words.slice(i, i + size);
      const dur = chunk.length * secPerWord;
      out.push({
        text: chunk.join(' '),
        startMs: Math.round(t * 1000),
        endMs: Math.round((t + dur) * 1000),
        timestampMs: Math.round((t + dur / 2) * 1000),
        confidence: null,
      });
      t += dur;
    }
    t += 0.3;
  }
  const spoken = t - (start + (sc.offsetSeconds ?? 0));
  console.log(`${sc.id}: suara ~${spoken.toFixed(0)}s dari scene ${seconds}s`);
}

fs.writeFileSync('subtitles.json', JSON.stringify(out, null, 2));
const total = timing.scenes.reduce((a, s) => a + s.seconds, 0);
console.log(`Total ${out.length} cue. Video ${total}s.`);
