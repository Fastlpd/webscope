import test from "node:test";
import assert from "node:assert/strict";
import { analyzeCharacter } from "../src/character/character-intelligence.js";
import { validateScreenplay } from "../src/continuity/continuity-validator.js";
import { createSessionMemory, recordPerformance } from "../src/continuity/session-memory.js";
import { evaluateScreenplay } from "../src/quality/quality-evaluator.js";
import { buildStoryPlan } from "../src/story/story-strategist.js";
import { misunderstoodDreamer } from "../src/pipeline.js";
import type { ScreenplayBrief, ScreenplayDraft } from "../src/types.js";

const brief: ScreenplayBrief = {
  emotionalSituation: "A man prepares to return an object he has kept for years.",
  targetRuntimeSeconds: 200,
  studioOnly: true,
  continuousPerformance: true,
  props: ["old camera", "phone"],
  musicDirection: "restrained instrumental",
  avoidRecentSituations: ["comeback announcement", "cancelled meeting"]
};

const draft: ScreenplayDraft = {
  title: "The Return",
  logline: "A practical errand becomes unexpectedly personal.",
  targetRuntimeSeconds: 200,
  setting: "One dark studio room",
  propsUsed: ["old camera", "phone"],
  wardrobe: ["charcoal shirt", "dark trousers"],
  lightingPlan: ["soft side key", "warm practical lamp"],
  scenes: [{
    heading: "INT. STUDIO - CONTINUOUS",
    startSeconds: 0,
    endSeconds: 200,
    action: "He wipes the camera, looks at the scratch, folds the cloth, waits, then puts the object back in its case.",
    dialogue: ["That's one way to organise your life."],
    performanceDirection: ["Do not play sadness; let the hand pause before the case closes."],
    shots: [
      { shotId: "A", framing: "wide", cameraMovement: "locked", action: "He enters and sits.", performanceNote: "composed", lighting: "soft side light", sound: "room tone", editNote: "hold" },
      { shotId: "B", framing: "close-up", cameraMovement: "locked", action: "He wipes the lens.", performanceNote: "hesitation", lighting: "warm practical", sound: "cloth friction", editNote: "cut on action" }
    ],
    musicCue: "instrumental bed, flexible"
  }],
  caption: "An ordinary errand.",
  pinnedComment: "What do you think made him hesitate?"
};

test("character analysis turns contradictions into playable direction", () => {
  const dossier = analyzeCharacter(misunderstoodDreamer);
  assert.match(dossier.playableContradiction, /understood/i);
  assert.ok(dossier.performanceDirectives.length >= 5);
});

test("story plan respects the 2–4 minute range and avoids recent premises", () => {
  const plan = buildStoryPlan(brief);
  assert.equal(plan.beats.length, 5);
  assert.equal(plan.beats[0]?.startSeconds, 0);
  assert.equal(plan.beats[4]?.endSeconds, 200);
  assert.ok(plan.freshnessChecks.some((item) => item.includes("cancelled meeting")));
});

test("session memory records recent premises and blocks repetition", () => {
  const memory = recordPerformance(createSessionMemory(misunderstoodDreamer.id), brief, draft);
  const plan = buildStoryPlan({ ...brief, emotionalSituation: "A different ordinary situation." }, memory);
  assert.equal(memory.recentPerformances.length, 1);
  assert.ok(plan.freshnessChecks.some((item) => item.includes(brief.emotionalSituation)));
});

test("valid studio draft passes continuity validation", () => {
  const result = validateScreenplay(misunderstoodDreamer, brief, draft);
  assert.equal(result.valid, true);
});

test("quality evaluator returns bounded, explainable scores", () => {
  const report = evaluateScreenplay(draft);
  assert.ok(report.overall >= 1 && report.overall <= 5);
  assert.ok(report.dimensions.productionFeasibility >= 1);
});
