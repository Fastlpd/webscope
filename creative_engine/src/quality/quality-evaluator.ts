import type {
  QualityDimension,
  QualityReport,
  ScreenplayDraft
} from "../types.js";

const GENERIC_PHRASES = [
  "some distances",
  "everything happens for a reason",
  "never give up",
  "keep chasing your dreams",
  "some people",
  "the journey is",
  "i am stronger than"
];

const average = (values: number[]): number =>
  Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));

export function evaluateScreenplay(draft: ScreenplayDraft): QualityReport {
  const dialogue = draft.scenes.flatMap((scene) => scene.dialogue).join(" ").toLowerCase();
  const action = draft.scenes.map((scene) => scene.action).join(" ").toLowerCase();
  const allText = `${dialogue} ${action}`.toLowerCase();
  const shots = draft.scenes.flatMap((scene) => scene.shots);
  const totalDialogueWords = dialogue.split(/\s+/).filter(Boolean).length;
  const duration = draft.targetRuntimeSeconds;
  const genericHits = GENERIC_PHRASES.filter((phrase) => allText.includes(phrase));
  const actionSignals = ["looks", "touch", "fold", "wipe", "adjust", "put", "remove", "pick", "stop", "wait", "listen", "turn", "hold"];
  const actionCount = actionSignals.reduce((count, word) => count + (action.match(new RegExp(`\\b${word}\\w*\\b`, "g"))?.length ?? 0), 0);
  const dialoguePerMinute = totalDialogueWords / Math.max(duration / 60, 1);
  const sceneCount = draft.scenes.length;

  const dimensions: Record<QualityDimension, number> = {
    emotionalCredibility: clampScore(3 + (actionCount >= 7 ? 1 : 0) - (genericHits.length ? 1 : 0)),
    subtext: clampScore(2 + (actionCount >= 5 ? 1 : 0) + (draft.scenes.some((scene) => scene.performanceDirection.length > 0) ? 1 : 0)),
    dialogueNaturalness: clampScore(4 - (genericHits.length ? 2 : 0) - (dialoguePerMinute > 115 ? 1 : 0)),
    visualStorytelling: clampScore(2 + (shots.length >= sceneCount * 2 ? 2 : shots.length > 0 ? 1 : 0)),
    originality: clampScore(4 - genericHits.length),
    productionFeasibility: clampScore(3 + (draft.setting.toLowerCase().includes("studio") ? 1 : 0) + (draft.propsUsed.length <= 6 ? 1 : 0)),
    characterConsistency: clampScore(3 + (draft.scenes.some((scene) => scene.performanceDirection.length > 0) ? 1 : 0)),
    pacing: clampScore(sceneCount >= 4 && sceneCount <= 7 ? 4 : 3)
  };

  const strengths: string[] = [];
  const revisionTargets: string[] = [];
  const flags: string[] = [];

  if (actionCount >= 7) strengths.push("The draft includes playable physical behaviour, not dialogue alone.");
  else revisionTargets.push("Add specific physical actions that reveal pressure or contradiction.");

  if (shots.length >= sceneCount * 2) strengths.push("Every scene has useful shot coverage.");
  else revisionTargets.push("Add a master shot and motivated detail / reaction coverage to each scene.");

  if (dialoguePerMinute <= 115) strengths.push("Dialogue density leaves room for silence and performance.");
  else revisionTargets.push("Reduce dialogue density; let expressions, pauses and sound carry more meaning.");

  if (genericHits.length) flags.push(`Generic or familiar phrasing detected: ${genericHits.join(", ")}.`);
  if (duration < 120 || duration > 240) flags.push("Runtime is outside the requested 2–4 minute range.");
  if (draft.propsUsed.length > 8) flags.push("Prop count may be unnecessarily difficult for a small studio shoot.");
  if (sceneCount < 4) revisionTargets.push("Consider a clearer progression of dramatic beats without fragmenting the performance.");

  const overall = average(Object.values(dimensions));
  return { overall, dimensions, strengths, revisionTargets, flags };
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(5, value));
}
