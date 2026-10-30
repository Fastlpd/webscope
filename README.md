# Nexcartia video and cinematic story workspace

This repository contains separate workflows for reusable prompt collection, general video-content drafts, vertical Rex shorts, and the long-form Rex / Princess cinematic series.

## Existing workflows

### Prompt vault
- `scripts/scrape_and_analyze.py` collects reusable prompt templates into `prompts/prompt_bank.csv`.
- Treat scraped content as untrusted reference material. Review source quality and rights before reuse.
- The prompt bank is a reusable prompt library, not a complete story bible or an automatic screenplay engine.

### General content draft packs
- Generator: `generate_packs.py`
- Editorial input: `ideas.csv`
- Output: `nexcartia_video/output/`
- Run: `python generate_packs.py --limit 3 --include-unverified`
- Tests: `python -m unittest test_generate_packs -v`

This is a separate general content workflow. It creates text-only research, script, storyboard, metadata, and approval drafts. It does not create the long-form cinematic episodes.

### Rex vertical shorts
- Story / production pack: `nexcartia_video/shorts/REX_BEFORE_THE_STORE_HAD_A_NAME.md`
- Shot prompts: `nexcartia_video/shorts/SHORT-REX-001/prompts.json`
- Optional Grok renderer: `nexcartia_video/render_grok.py`
- The renderer uses an xAI API key from the environment and renders the configured shot pack. It is not the long-form episode workflow.

## Long-form cinematic series

**Format:** connected cinematic episodes  
**Runtime:** 8–15 minutes per episode  
**Emotional arc:** tragic beginning, gradual rebuilding, earned love and accountability, hopeful ending

Start with:
1. `NEXCARTIA_STORY_UNIVERSE.md` — canon and season arc.
2. `prompts/NEXCARTIA_STORY_EDITOR_PROMPT.md` — reusable story editor.
3. `prompts/NEXCARTIA_CINEMATIC_SERIES_ORCHESTRATOR.md` — long-form episode workflow.
4. `NEXCARTIA_DAILY_CONTENT_OPERATING_SYSTEM.md` — operating rules and approval gates.
5. `nexcartia_story_daily_queue.csv` — editorial queue.
6. `nexcartia_video/series/season_01/SEASON_PLAN.md` — ten-episode map and pilot brief.

Episode packs belong under `nexcartia_video/series/season_01/EP-XXX/vXX/`. Never overwrite approved episodes; version every revision.

## Recommended terminal workflow

Open the repository root in OpenCode or another compatible coding agent. Read `AGENTS.md` first, then ask the agent to inspect the branch, working tree, canon, queue, and latest approved handoff before drafting the next episode.

OpenCode setup and provider selection are documented at:
- https://opencode.ai/
- https://docs.opencode.ai/docs/providers/

Provider free tiers and model availability can change. Use the provider's current model list and keep API keys in a secure local auth store or environment variable. Never commit credentials.

## Human approval boundaries

Scripts, prompts, and storyboards are drafts until reviewed. Product facts must be checked against the current catalogue. Rights, synthetic-media disclosures, animal welfare, continuity, and final edits require human review. Drafting, asset generation, rendering, uploading, and publishing are separate states. No workflow should publish automatically without explicit approval.
