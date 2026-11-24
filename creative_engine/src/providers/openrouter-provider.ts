import type { GenerationContext, ScreenplayDraft, ScreenplayProvider } from "../types.js";

export interface OpenRouterProviderOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  appUrl?: string;
  appName?: string;
  systemPrompt?: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are the Nexcartia cinematic studio screenplay writer, character analyst, performance director and continuity editor. Generate one complete, shootable, continuous 2–4 minute studio performance for the supplied recurring misunderstood dreamer. Keep his identity and biography partly ambiguous. He is ambitious, observant, guarded and dryly sarcastic; he wants to be understood but hides behind humour and controlled appearances. Make his actions contradict his words sometimes. Use natural imperfect dialogue, subtext, physical behaviour, pauses and sound. Avoid generic motivational lines, quote collections, predictable heartbreak, repeated phone-notification plots and explicit moral endings. Use the supplied recent-session memory to avoid repeating situations and ending images. Stay within the studio, props, wardrobe and music constraints. Do not invent song lyrics or timestamps. Return only a valid JSON object matching ScreenplayDraft: title, logline, targetRuntimeSeconds, setting, propsUsed, wardrobe, lightingPlan, scenes (heading, startSeconds, endSeconds, action, dialogue, performanceDirection, shots with shotId/framing/cameraMovement/action/performanceNote/lighting/sound/editNote, musicCue), caption, pinnedComment. Include enough scene and shot detail for an actor, camera operator and editor to execute the film.`;

export class OpenRouterScreenplayProvider implements ScreenplayProvider {
  private readonly baseUrl: string;

  constructor(private readonly options: OpenRouterProviderOptions) {
    if (!options.apiKey.trim()) throw new Error("OPENROUTER_API_KEY is required.");
    if (!options.model.trim()) throw new Error("OPENROUTER_MODEL is required.");
    this.baseUrl = (options.baseUrl ?? "https://openrouter.ai/api/v1").replace(/\/$/, "");
  }

  async generate(context: GenerationContext): Promise<ScreenplayDraft> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
        ...(this.options.appUrl ? { "HTTP-Referer": this.options.appUrl } : {}),
        ...(this.options.appName ? { "X-Title": this.options.appName } : {})
      },
      body: JSON.stringify({
        model: this.options.model,
        temperature: 0.85,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: this.options.systemPrompt ?? DEFAULT_SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              character: context.character,
              characterDossier: context.dossier,
              brief: context.brief,
              storyPlan: context.plan,
              sessionMemory: context.sessionMemory
            })
          }
        ]
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenRouter request failed (${response.status}): ${detail.slice(0, 1000)}`);
    }

    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenRouter returned no screenplay content.");

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("OpenRouter response was not valid JSON. Retry with JSON mode or revise the provider prompt.");
    }
    if (!isScreenplayDraft(parsed)) {
      throw new Error("OpenRouter JSON did not match the required ScreenplayDraft structure.");
    }
    return parsed;
  }
}

function isScreenplayDraft(value: unknown): value is ScreenplayDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;
  return typeof draft.title === "string"
    && typeof draft.logline === "string"
    && typeof draft.targetRuntimeSeconds === "number"
    && typeof draft.setting === "string"
    && Array.isArray(draft.propsUsed)
    && Array.isArray(draft.wardrobe)
    && Array.isArray(draft.lightingPlan)
    && Array.isArray(draft.scenes)
    && typeof draft.caption === "string"
    && typeof draft.pinnedComment === "string";
}
