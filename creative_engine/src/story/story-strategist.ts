import type {
  EmotionalTexture,
  ScreenplayBrief,
  StoryBeat,
  StoryPlan
} from "../types.js";

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const defaultTexture: EmotionalTexture = "awkward-intimacy";

export function buildStoryPlan(brief: ScreenplayBrief): StoryPlan {
  const runtime = clamp(brief.targetRuntimeSeconds, 120, 240);
  const texture = brief.emotionalTexture ?? defaultTexture;
  const points = [0, 0.14, 0.34, 0.58, 0.79, 1].map((ratio) =>
    Math.round(runtime * ratio)
  );

  const beatSpecs = [
    ["The ordinary task", "Establish a practical action and a readable immediate objective.", "The character appears in control.", "sparse"],
    ["The complication", "Introduce a believable interruption, request or small failure.", "The public mask becomes useful.", "natural"],
    ["The contradiction", "Make the character's behaviour disagree with their words.", "The private pressure becomes visible.", "sparse"],
    ["The choice", "Force a small decision with a personal cost.", "The character briefly stops performing.", "none"],
    ["The after-effect", "Show the consequence through an object, gesture or unfinished task.", "Leave the emotional meaning open.", "none"]
  ] as const;

  const beats: StoryBeat[] = beatSpecs.map((spec, index) => ({
    id: `B0${index + 1}`,
    label: spec[0],
    startSeconds: points[index]!,
    endSeconds: points[index + 1]!,
    dramaticFunction: spec[1],
    playableAction: index === 0
      ? `Begin doing something specific with: ${brief.props.join(", ") || "one ordinary studio object"}.`
      : spec[2],
    emotionalShift: spec[2],
    dialogueAllowance: spec[3]
  }));

  return {
    premise: brief.emotionalSituation,
    centralQuestion: brief.audienceRecognitionPoint ??
      "What familiar human behaviour will make the audience recognise themselves without being told what to feel?",
    emotionalTexture: texture,
    conflictMechanism: "A practical, ordinary task becomes difficult because the character's private need conflicts with the image they are trying to maintain.",
    revealStrategy: "Reveal information through changed behaviour, interrupted speech, object handling and visual repetition. Do not explain the character's entire past.",
    endingPrinciple: "End on a concrete action that changes the meaning of an earlier object or gesture; avoid a moral, slogan or neat emotional explanation.",
    beats,
    freshnessChecks: [
      ...brief.avoidRecentSituations.map((item) => `Do not reuse this recent situation: ${item}`),
      "Choose a different central dramatic mechanism from the last performance.",
      "Do not use a phone notification as the only source of conflict.",
      "Do not default to heartbreak, abandonment or a person leaving.",
      "Use sarcasm only when it fits the character's defence mechanism."
    ]
  };
}
