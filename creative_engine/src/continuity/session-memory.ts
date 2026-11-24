import type {
  CharacterSessionMemory, PerformanceRecord, ScreenplayBrief, ScreenplayDraft
} from "../types.js";

export function createSessionMemory(characterId: string): CharacterSessionMemory {
  return { characterId, recentPerformances: [], establishedMotifs: [], unresolvedThreads: [] };
}

export function mergeRecentSituations(
  brief: ScreenplayBrief,
  memory: CharacterSessionMemory
): ScreenplayBrief {
  return {
    ...brief,
    avoidRecentSituations: [...new Set([
      ...brief.avoidRecentSituations,
      ...memory.recentPerformances.map((item) => item.emotionalSituation)
    ])]
  };
}

export function recordPerformance(
  memory: CharacterSessionMemory,
  brief: ScreenplayBrief,
  draft: ScreenplayDraft
): CharacterSessionMemory {
  const record: PerformanceRecord = {
    title: draft.title,
    emotionalSituation: brief.emotionalSituation,
    emotionalTexture: brief.emotionalTexture ?? "awkward-intimacy",
    endingImage: draft.scenes.at(-1)?.action ?? "Ending image not recorded"
  };
  return {
    ...memory,
    recentPerformances: [...memory.recentPerformances, record].slice(-12),
    lastEmotionalTemperature: record.emotionalTexture
  };
}
