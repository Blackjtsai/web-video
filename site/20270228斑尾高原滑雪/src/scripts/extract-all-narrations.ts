/**
 * extract-all-narrations.ts
 *
 * This project runs TWO independent presentations from one codebase:
 *   - the split-screen web version (src/registry/chapters.ts → src/chapters/NN-sp-.../narrations.ts)
 *   - the mobile version (src/mobile-narrations.ts → MOBILE_SEGMENTS)
 *
 * Both need TTS audio, and synthesize-audio.sh consumes a single flat
 * audio-segments.json ({ chapter, step, text, audio }). This script merges
 * both narration sources into that one file so `npm run extract-narrations`
 * covers both pipelines in one pass without either one clobbering the other.
 *
 * Web chapter ids are prefixed `sp-` (see registry/chapters.ts) specifically
 * so their audio path (`public/audio/sp-coldopen/1.mp3`, ...) never collides
 * with the pre-existing mobile audio path (`public/audio/coldopen/1.mp3`,
 * ...) that reuses the same short ids. This script does not enforce that
 * prefix itself — it just flattens whatever each source declares — but if
 * you ever change chapter ids, make sure the two id sets stay disjoint or
 * synthesize-audio.sh will silently overwrite one set with the other.
 *
 * Run via: npm run extract-narrations
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const REGISTRY_PATH = resolve(ROOT, "src/registry/chapters.ts");
const CHAPTERS_DIR = resolve(ROOT, "src/chapters");
const MOBILE_NARRATIONS_PATH = resolve(ROOT, "src/mobile-narrations.ts");
const OUT_PATH = resolve(ROOT, "audio-segments.json");

interface Segment {
  chapter: string;
  step: number;
  text: string;
  audio: string;
}

/** Parse `src/registry/chapters.ts` to learn web chapter id → folder order. */
async function readChapterOrder(): Promise<{ id: string; folder: string }[]> {
  const src = await readFile(REGISTRY_PATH, "utf8");
  const ids: string[] = [];
  const folders: Record<string, string> = {};

  for (const m of src.matchAll(/id:\s*["']([^"']+)["']/g)) ids.push(m[1]!);
  for (const m of src.matchAll(
    /from\s+["']\.\.\/chapters\/([^"'/]+)\/narrations["']/g,
  )) {
    const folder = m[1]!;
    folders[folder] = folder;
  }

  const result: { id: string; folder: string }[] = [];
  for (const id of ids) {
    const candidates = Object.keys(folders).filter((f) => f.endsWith(`-${id}`));
    const folder = candidates[0] ?? Object.keys(folders).find((f) => f === id);
    if (!folder) {
      throw new Error(
        `chapter id "${id}" registered but no matching folder found ` +
          `under src/chapters/. Expected something like NN-${id}/narrations.ts`,
      );
    }
    result.push({ id, folder });
  }
  return result;
}

async function loadNarrations(folder: string): Promise<unknown[]> {
  const file = join(CHAPTERS_DIR, folder, "narrations.ts");
  if (!existsSync(file)) {
    throw new Error(`missing narrations.ts: ${file}`);
  }
  const url = pathToFileURL(file).href;
  const mod = await import(url);
  if (!Array.isArray(mod.narrations)) {
    throw new Error(
      `narrations.ts in ${folder} must export an array named "narrations"`,
    );
  }
  return mod.narrations as unknown[];
}

async function collectWebChapterSegments(): Promise<{ segments: Segment[]; silentSteps: number }> {
  const order = await readChapterOrder();
  const segments: Segment[] = [];
  let silentSteps = 0;
  for (const { id, folder } of order) {
    const arr = await loadNarrations(folder);
    arr.forEach((entry, i) => {
      const step = i + 1;
      if (typeof entry !== "string") {
        throw new Error(
          `chapter "${id}" step ${step}: narration must be a string (got ${typeof entry}).`,
        );
      }
      if (entry.trim() === "") {
        silentSteps++;
        return;
      }
      segments.push({ chapter: id, step, text: entry, audio: `${id}/${step}.mp3` });
    });
  }
  return { segments, silentSteps };
}

async function collectMobileSegments(): Promise<Segment[]> {
  if (!existsSync(MOBILE_NARRATIONS_PATH)) return [];
  const srcFile = pathToFileURL(MOBILE_NARRATIONS_PATH).href;
  const { MOBILE_SEGMENTS } = (await import(srcFile)) as {
    MOBILE_SEGMENTS: Array<{ id: string; step: number; cardId: string; text: string }>;
  };
  return MOBILE_SEGMENTS.map(({ id, step, text }) => ({
    chapter: id,
    step,
    text,
    audio: `${id}/${step}.mp3`,
  }));
}

async function main() {
  const print = process.argv.includes("--print");

  const { segments: webSegments, silentSteps } = await collectWebChapterSegments();
  const mobileSegments = await collectMobileSegments();

  // Sanity check: the two id sets must stay disjoint, or one pipeline's
  // audio would silently overwrite the other's during synthesis.
  const webChapterIds = new Set(webSegments.map((s) => s.chapter));
  const mobileChapterIds = new Set(mobileSegments.map((s) => s.chapter));
  const collisions = [...webChapterIds].filter((id) => mobileChapterIds.has(id));
  if (collisions.length > 0) {
    throw new Error(
      `web chapter id(s) collide with mobile-narrations id(s): ${collisions.join(", ")}. ` +
        `Audio paths are "<chapter>/<step>.mp3" — a collision means synthesize-audio ` +
        `would treat both pipelines' steps as the same files. Rename one side's ids.`,
    );
  }

  const segments = [...webSegments, ...mobileSegments];
  await writeFile(OUT_PATH, JSON.stringify(segments, null, 2) + "\n", "utf8");

  console.error(
    `✓ extracted ${webSegments.length} web-chapter segments` +
      (silentSteps > 0 ? ` (skipped ${silentSteps} silent steps)` : "") +
      ` + ${mobileSegments.length} mobile segments = ${segments.length} total`,
  );
  console.error(`  → ${OUT_PATH}`);
  if (print) console.log(JSON.stringify(segments, null, 2));
}

main().catch((err) => {
  console.error(`✗ ${err.message ?? err}`);
  process.exit(1);
});
