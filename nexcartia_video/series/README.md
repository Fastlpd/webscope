# Cinematic episode workflow

This directory is the long-form home for Rex and Princess episodes. It is intentionally separate from the existing vertical-short renderer and the general product-education draft generator.

## Canonical inputs
- `../../../../NEXCARTIA_STORY_UNIVERSE.md`
- `../../../../prompts/NEXCARTIA_STORY_EDITOR_PROMPT.md`
- `../../../../prompts/NEXCARTIA_CINEMATIC_SERIES_ORCHESTRATOR.md`
- `../../../../NEXCARTIA_DAILY_CONTENT_OPERATING_SYSTEM.md`
- `../../../../nexcartia_story_daily_queue.csv`

## Episode folder convention
```
season_01/
  EP-001/
    v01/
      brief.md
      script.md
      storyboard.md
      continuity.md
      brand_integration.md
      sound_edit.md
      handoff.md
      approval.md
```

Never overwrite an approved version. Create `v02` for a revision and update the handoff only after human approval.

## One-terminal workflow
From the repository root, start the configured terminal agent (OpenCode is the recommended option) and ask it to:
1. Inspect the current branch, working tree, and all canonical inputs.
2. Load the season plan and latest approved handoff.
3. Draft only the next episode in queue.
4. Run a continuity and factual/product check before writing final files.
5. Save a versioned episode pack and run available validation/tests.
6. Summarize changed files, unresolved decisions, and human approval requirements.

Do not assume an LLM provider is free or available. Select a model from the provider's current model list, use its documented free tier if one exists, and keep credentials in local environment variables or the provider's secure auth store. Never commit keys.

## Production states
`IDEA → CANON_CHECKED → SCRIPT_DRAFT → SCRIPT_APPROVED → SHOT_PROMPTS_APPROVED → ASSETS_GENERATED → EDITED → FINAL_REVIEW → APPROVED_TO_PUBLISH → PUBLISHED`.

Writing a script does not authorize image/video generation, rendering, upload, or publication. Each is a separate approval step.
