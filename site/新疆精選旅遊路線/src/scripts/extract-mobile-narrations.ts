/**
 * extract-mobile-narrations.ts
 * Reads MOBILE_SEGMENTS from src/mobile-narrations.ts and writes audio-segments.json.
 * Run via: npm run extract-narrations
 */
import { writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "audio-segments.json");

const srcFile = pathToFileURL(resolve(ROOT, "src/mobile-narrations.ts")).href;
const { MOBILE_SEGMENTS } = await import(srcFile) as {
  MOBILE_SEGMENTS: Array<{ id: string; step: number; cardId: string; text: string }>;
};

const segments = MOBILE_SEGMENTS.map(({ id, step, text }) => ({
  chapter: id,
  step,
  text,
  audio: `${id}/${step}.mp3`,
}));

await writeFile(OUT_PATH, JSON.stringify(segments, null, 2) + "\n", "utf8");
console.error(`✓ extracted ${segments.length} mobile segments → ${OUT_PATH}`);
