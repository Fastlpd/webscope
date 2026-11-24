import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { runScreenplayPipeline, misunderstoodDreamer } from "./pipeline.js";
import { OpenRouterScreenplayProvider } from "./providers/openrouter-provider.js";
import { createSessionMemory } from "./continuity/session-memory.js";
import type { CharacterSessionMemory, ScreenplayBrief } from "./types.js";

function option(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

async function main(): Promise<void> {
  const briefPath = option("--brief");
  if (!briefPath) {
    throw new Error("Usage: npm run generate -- --brief ./brief.json [--session ./session.json] [--out ./output]");
  }

  const brief = JSON.parse(await readFile(resolve(briefPath), "utf8")) as ScreenplayBrief;
  if (!brief.emotionalSituation || !brief.targetRuntimeSeconds || !Array.isArray(brief.props)) {
    throw new Error("Brief must include emotionalSituation, targetRuntimeSeconds and props.");
  }

  const sessionPath = option("--session");
  let sessionMemory: CharacterSessionMemory = createSessionMemory(misunderstoodDreamer.id);
  if (sessionPath) {
    try {
      sessionMemory = JSON.parse(await readFile(resolve(sessionPath), "utf8")) as CharacterSessionMemory;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  if (!apiKey || !model) throw new Error("Set OPENROUTER_API_KEY and OPENROUTER_MODEL in your local environment.");

  const provider = new OpenRouterScreenplayProvider({
    apiKey,
    model,
    baseUrl: process.env.OPENROUTER_BASE_URL,
    appUrl: process.env.OPENROUTER_APP_URL,
    appName: process.env.OPENROUTER_APP_NAME ?? "Nexcartia Studio Screenplay Engine"
  });

  const result = await runScreenplayPipeline({
    character: misunderstoodDreamer,
    brief,
    provider,
    sessionMemory
  });

  const outputDir = resolve(option("--out", "./output")!);
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "screenplay-result.json"), JSON.stringify(result, null, 2), "utf8");
  await writeFile(resolve(outputDir, "session-memory.json"), JSON.stringify(result.sessionMemory, null, 2), "utf8");

  process.stdout.write([
    `Title: ${result.draft.title}`,
    `Status: ${result.status}`,
    `Quality score: ${result.quality.overall}/5`,
    `Validation: ${result.validation.valid ? "passed" : "failed"}`,
    `Saved: ${outputDir}`,
    ...result.validation.errors.map((item) => `ERROR: ${item}`),
    ...result.quality.revisionTargets.map((item) => `REVISION: ${item}`)
  ].join("\n") + "\n");
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
