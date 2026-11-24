# Nexcartia Studio Screenplay Engine

A separate TypeScript creative system for the recurring **misunderstood dreamer** studio-performance format. It does not alter the Rex / Princess story universe or the existing 8–15 minute cinematic-series workflow.

## What it is designed to do

1. **Character intelligence** — turn a role into playable contradictions, wants, needs, defence mechanisms, habits, voice rules and visual behaviour.
2. **Story strategy** — create a fresh dramatic situation and a timed 2–4 minute continuous performance structure.
3. **Screenplay generation contract** — pass the character dossier, story plan and production constraints to any configured language-model provider through a small adapter interface.
4. **Quality evaluation** — inspect emotional credibility, subtext, dialogue naturalness, visual storytelling, originality and production feasibility.
5. **Continuity validation** — check runtime, single-location / continuous-performance constraints, recurring character identity and required production details.
6. **Human review** — return a quality report and validation errors; never silently publish, render or overwrite approved work.

## Current character foundation

The default role is a misunderstood dreamer: ambitious, observant, emotionally guarded and often dryly sarcastic. He uses humour, composure and small practical actions to avoid explaining what is happening inside him. His biography stays partly ambiguous. His identity is revealed through repeated behaviour, not exposition.

The engine deliberately separates this studio character from Rex, Milo and the Nexcartia brand-origin series canon.

## Structure

- `src/types.ts` — typed contracts for characters, briefs, beats, scenes, shots and evaluation.
- `src/character/character-intelligence.ts` — role analysis and playable acting directives.
- `src/story/story-strategist.ts` — emotional situation strategy and timed beat plan.
- `src/quality/quality-evaluator.ts` — transparent heuristic screenplay quality checks.
- `src/continuity/continuity-validator.ts` — format and continuity validation.
- `src/continuity/session-memory.ts` — remembers the last 12 performance premises and ending images to discourage repetition.
- `src/pipeline.ts` — provider adapter and end-to-end draft orchestration.
- `src/providers/openrouter-provider.ts` — working OpenRouter chat-completions adapter with JSON response validation.
- `prompts/STUDIO_SCREENPLAY_SYSTEM.md` — generation contract for an LLM.
- `tests/` — deterministic unit tests.

## Run locally

From this directory:

```bash
npm install
cp .env.example .env
# Add your OpenRouter key and model to .env
npm test
npm run build
npm run generate -- --brief ./brief.example.json --session ./output/session-memory.json --out ./output
```

On Windows PowerShell, copy the example with `Copy-Item .env.example .env`.

No API key is required for tests. For generation, copy `.env.example` to `.env` and set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`. The CLI loads the local environment file and calls OpenRouter's chat-completions endpoint. It saves `screenplay-result.json` and `session-memory.json` under the output directory. Keep real credentials out of Git; `.env` and generated outputs are ignored.

## Pipeline use

```ts
import { OpenRouterScreenplayProvider } from "./src/providers/openrouter-provider.js";
import { runScreenplayPipeline, misunderstoodDreamer } from "./src/pipeline.js";

const provider = new OpenRouterScreenplayProvider({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: process.env.OPENROUTER_MODEL!
});

const result = await runScreenplayPipeline({
  character: misunderstoodDreamer,
  brief: {
    titleSeed: "The Listing",
    emotionalSituation: "letting go of an object tied to an unfinished ambition",
    targetRuntimeSeconds: 200,
    studioOnly: true,
    continuousPerformance: true,
    props: ["old camera", "phone", "cloth", "small box"],
    musicDirection: "restrained instrumental; do not invent song structure",
    avoidRecentSituations: ["recording a comeback announcement", "waiting for a cancelled meeting"]
  },
  provider
});
```

The returned object includes the draft, character dossier, beat plan, quality report, validation findings and updated session memory. Pass the returned `sessionMemory` into the next run to help avoid repeating recent situations. The pipeline retains up to 12 recent performance premises and ending images per character. A high score is advisory, not approval. Human review remains mandatory.

## Quality model

Scores are heuristic signals, not a claim that software can measure artistic truth. The engine flags common weaknesses—expository dialogue, generic inspirational phrasing, insufficient physical action, repetitive emotional premises and missing production direction—so a writer or model can revise deliberately. Review the actual script before production.

## Safety and rights

Drafting is separate from image/video generation, rendering, uploading and publishing. The engine must not copy protected lyrics, imitate a living artist's exact style, fabricate real audience reactions or present fictional events as real testimonials.
