import { analyzeCharacter } from "./character/character-intelligence.js";
import { validateScreenplay } from "./continuity/continuity-validator.js";
import { createSessionMemory, recordPerformance } from "./continuity/session-memory.js";
import { evaluateScreenplay } from "./quality/quality-evaluator.js";
import { buildStoryPlan } from "./story/story-strategist.js";
import type {
  CharacterProfile,
  CharacterSessionMemory,
  PipelineResult,
  ScreenplayBrief,
  ScreenplayProvider
} from "./types.js";

export interface PipelineInput {
  character: CharacterProfile;
  brief: ScreenplayBrief;
  provider: ScreenplayProvider;
  sessionMemory?: CharacterSessionMemory;
}

export async function runScreenplayPipeline(input: PipelineInput): Promise<PipelineResult> {
  const dossier = analyzeCharacter(input.character);
  const priorMemory = input.sessionMemory ?? createSessionMemory(input.character.id);\n  if (priorMemory.characterId !== input.character.id) {\n    throw new Error("Session memory characterId does not match the active character.");\n  }
  const plan = buildStoryPlan(input.brief, priorMemory);
  const draft = await input.provider.generate({
    character: input.character,
    dossier,
    brief: input.brief,
    plan,
    sessionMemory: priorMemory
  });

  const quality = evaluateScreenplay(draft);
  const validation = validateScreenplay(input.character, input.brief, draft);
  const status = !validation.valid || quality.overall < 3
    ? "REVISION_REQUIRED"
    : quality.overall >= 4 && quality.flags.length === 0
      ? "READY_FOR_HUMAN_REVIEW"
      : "DRAFT_NEEDS_REVIEW";

  const sessionMemory = recordPerformance(priorMemory, input.brief, draft);
  return { draft, dossier, plan, quality, validation, sessionMemory, status };
}

export const misunderstoodDreamer: CharacterProfile = {
  id: "misunderstood-dreamer",
  name: "The Dreamer",
  role: "A recurring, partly ambiguous studio-performance character",
  agePresentation: "Adult; exact age and biography intentionally unspecified",
  traits: ["ambitious", "observant", "guarded", "resourceful", "dryly funny"],
  publicMask: "composed, casually confident, capable of laughing at himself",
  privatePressure: "the distance between what he imagined and what ordinary life currently allows",
  consciousWant: "to be taken seriously without having to explain himself",
  deeperNeed: "to be honest about uncertainty without feeling that he has lost dignity",
  centralContradiction: "he wants to be understood but repeatedly hides behind humour and controlled appearances",
  defenceMechanisms: ["sarcasm", "changing the subject", "over-preparing", "pretending not to care"],
  physicalHabits: ["adjusting a cuff or collar when uncomfortable", "handling an ordinary object for longer than necessary", "starting a task and briefly forgetting why"],
  speechPatterns: ["short conversational phrases", "understated sarcasm", "occasional self-correction", "incomplete thoughts and meaningful pauses"],
  visualMotifs: ["empty chair", "phone screen", "mirror reflection", "hands completing an ordinary task"],
  boundaries: [
    "Do not make every story about romance or abandonment.",
    "Do not turn sarcasm into constant punchlines.",
    "Do not give the character a neat biography or explain every motive.",
    "Do not end with a motivational quote or an explicit moral."
  ]
};
