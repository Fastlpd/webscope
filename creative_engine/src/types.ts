export type EmotionalTexture =
  | "dry-comedy" | "quiet-tension" | "bittersweet" | "awkward-intimacy"
  | "restrained-anger" | "uncertainty" | "tenderness" | "absurd-realism";

export interface CharacterProfile {
  id: string; name: string; role: string; agePresentation?: string;
  traits: string[]; publicMask: string; privatePressure: string;
  consciousWant: string; deeperNeed: string; centralContradiction: string;
  defenceMechanisms: string[]; physicalHabits: string[];
  speechPatterns: string[]; visualMotifs: string[]; boundaries: string[];
}
export interface CharacterDossier {
  characterId: string; playableContradiction: string; performanceDirectives: string[];
  dialogueRules: string[]; visualBehaviour: string[]; subtextQuestions: string[];
  ambiguityRules: string[];
}
export interface PerformanceRecord {
  title: string; emotionalSituation: string; emotionalTexture: EmotionalTexture;
  endingImage: string;
}
export interface CharacterSessionMemory {
  characterId: string; recentPerformances: PerformanceRecord[];
  establishedMotifs: string[]; unresolvedThreads: string[];
  lastEmotionalTemperature?: string;
}
export interface ScreenplayBrief {
  titleSeed?: string; emotionalSituation: string; emotionalTexture?: EmotionalTexture;
  targetRuntimeSeconds: number; studioOnly: boolean; continuousPerformance: boolean;
  props: string[]; musicDirection: string; audienceRecognitionPoint?: string;
  avoidRecentSituations: string[]; additionalConstraints?: string[];
}
export interface StoryBeat {
  id: string; label: string; startSeconds: number; endSeconds: number;
  dramaticFunction: string; playableAction: string; emotionalShift: string;
  dialogueAllowance: "none" | "sparse" | "natural";
}
export interface StoryPlan {
  premise: string; centralQuestion: string; emotionalTexture: EmotionalTexture;
  conflictMechanism: string; revealStrategy: string; endingPrinciple: string;
  beats: StoryBeat[]; freshnessChecks: string[];
}
export interface ShotDirection {
  shotId: string; framing: string; cameraMovement: string; action: string;
  performanceNote: string; lighting: string; sound: string; editNote: string;
}
export interface ScreenplayScene {
  heading: string; startSeconds: number; endSeconds: number; action: string;
  dialogue: string[]; performanceDirection: string[]; shots: ShotDirection[];
  musicCue: string;
}
export interface ScreenplayDraft {
  title: string; logline: string; targetRuntimeSeconds: number; setting: string;
  propsUsed: string[]; wardrobe: string[]; lightingPlan: string[];
  scenes: ScreenplayScene[]; caption: string; pinnedComment: string;
}
export type QualityDimension =
  | "emotionalCredibility" | "subtext" | "dialogueNaturalness" | "visualStorytelling"
  | "originality" | "productionFeasibility" | "characterConsistency" | "pacing";
export interface QualityReport {
  overall: number; dimensions: Record<QualityDimension, number>;
  strengths: string[]; revisionTargets: string[]; flags: string[];
}
export interface ValidationResult { valid: boolean; errors: string[]; warnings: string[]; }
export interface GenerationContext {
  character: CharacterProfile; dossier: CharacterDossier; brief: ScreenplayBrief;
  plan: StoryPlan; sessionMemory: CharacterSessionMemory;
}
export interface ScreenplayProvider { generate(context: GenerationContext): Promise<ScreenplayDraft>; }
export interface PipelineResult {
  draft: ScreenplayDraft; dossier: CharacterDossier; plan: StoryPlan;
  quality: QualityReport; validation: ValidationResult;
  sessionMemory: CharacterSessionMemory;
  status: "DRAFT_NEEDS_REVIEW" | "READY_FOR_HUMAN_REVIEW" | "REVISION_REQUIRED";
}
