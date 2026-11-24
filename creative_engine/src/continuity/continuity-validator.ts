import type {
  CharacterProfile,
  ScreenplayBrief,
  ScreenplayDraft,
  ValidationResult
} from "../types.js";

export function validateScreenplay(
  character: CharacterProfile,
  brief: ScreenplayBrief,
  draft: ScreenplayDraft
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!draft.title.trim()) errors.push("Screenplay title is missing.");
  if (!draft.logline.trim()) errors.push("Logline is missing.");
  if (draft.targetRuntimeSeconds < 120 || draft.targetRuntimeSeconds > 240) {
    errors.push("Draft runtime must be between 120 and 240 seconds.");
  }
  if (Math.abs(draft.targetRuntimeSeconds - brief.targetRuntimeSeconds) > 20) {
    warnings.push("Draft runtime differs from the requested target by more than 20 seconds.");
  }
  if (brief.studioOnly && !draft.setting.toLowerCase().includes("studio")) {
    errors.push("Studio-only brief must use a studio setting.");
  }
  if (brief.continuousPerformance && draft.scenes.length > 8) {
    warnings.push("Many scene divisions may make the performance feel episodic rather than continuous.");
  }
  if (draft.scenes.length === 0) errors.push("No screenplay scenes were generated.");

  const sorted = [...draft.scenes].sort((a, b) => a.startSeconds - b.startSeconds);
  for (let index = 0; index < sorted.length; index += 1) {
    const scene = sorted[index]!;
    if (scene.endSeconds <= scene.startSeconds) {
      errors.push(`Scene ${index + 1} has an invalid time range.`);
    }
    if (index > 0 && scene.startSeconds > sorted[index - 1]!.endSeconds + 3) {
      warnings.push(`Possible timeline gap before scene ${index + 1}.`);
    }
  }

  const usedProps = new Set(draft.propsUsed.map((prop) => prop.toLowerCase()));
  for (const prop of brief.props) {
    if (!usedProps.has(prop.toLowerCase())) {
      warnings.push(`Brief prop not accounted for in production pack: ${prop}.`);
    }
  }
  if (!draft.wardrobe.length) errors.push("Wardrobe direction is missing.");
  if (!draft.lightingPlan.length) errors.push("Lighting plan is missing.");
  if (draft.scenes.some((scene) => scene.shots.length === 0)) {
    errors.push("Every scene needs at least one sample shot direction.");
  }
  if (!draft.caption.trim() || !draft.pinnedComment.trim()) {
    warnings.push("Release caption or pinned-comment prompt is missing.");
  }
  if (!character.name.trim()) errors.push("Character identity is missing.");

  return { valid: errors.length === 0, errors, warnings };
}
