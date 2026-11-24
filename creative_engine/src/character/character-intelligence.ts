import type { CharacterDossier, CharacterProfile } from "../types.js";

const unique = (values: string[]): string[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

export function analyzeCharacter(character: CharacterProfile): CharacterDossier {
  const performanceDirectives = unique([
    `Play the public mask first: ${character.publicMask}`,
    `Let the private pressure leak through behaviour, not explanation: ${character.privatePressure}`,
    `The character consciously wants: ${character.consciousWant}`,
    `The deeper need is different from the immediate want: ${character.deeperNeed}`,
    `Keep this contradiction active in the body: ${character.centralContradiction}`,
    ...character.defenceMechanisms.map((item) => `Defence mechanism: ${item}; show it in a small action rather than naming it.`),
    ...character.physicalHabits.map((item) => `Physical habit: ${item}; use only when motivated by the moment.`)
  ]);

  return {
    characterId: character.id,
    playableContradiction: character.centralContradiction,
    performanceDirectives,
    dialogueRules: unique([
      ...character.speechPatterns,
      "Prefer incomplete, conversational sentences over polished monologues.",
      "Allow humour to arrive as a defence, then let the silence after it carry the cost.",
      "Do not let the character explain information the audience can infer from the scene."
    ]),
    visualBehaviour: unique([
      ...character.visualMotifs,
      "Give the character a physical task that changes as the emotional pressure changes.",
      "Use eye-line, timing, object handling and posture as story information."
    ]),
    subtextQuestions: [
      "What is the character trying not to admit?",
      "What would the character do if nobody were watching?",
      "Which action contradicts what the character says?",
      "What ordinary task becomes unexpectedly difficult?"
    ],
    ambiguityRules: unique([
      "Do not reveal a complete biography unless the brief explicitly requires it.",
      "Let the audience infer relationships and history from specific clues.",
      "Do not label the emotion in dialogue when behaviour can communicate it.",
      ...character.boundaries
    ])
  };
}
