# EP-001 v02 — Renderer entry point

**Canonical working package:** “The House of Kings”  
**Status:** Draft for creator review; not approved for rendering as final canon.

## Start here when using any AI coding, image, or video tool
Read these files in order:
1. `brief.md` — episode intent and production constraints.
2. `continuity.md` — source of truth for story state, character ages, wardrobe, props and locations.
3. `script.md` — canonical scene order and dialogue.
4. `storyboard.md` — shot-by-shot visual instructions.
5. `video_generation_prompts.md` — copy-ready long-form and Shorts generation prompts.
6. `shorts_upload_plan.md` — five Shorts packaging and upload guidance.
7. `approval.md` — creator approval gate.

## Instructions for an AI renderer or production agent
- Treat this folder as the current EP-001 v02 source package.
- Do not use the legacy `v01` script as the opening episode. It starts after the story's proper beginning and conflicts with puppy-age continuity.
- Do not invent or rename characters, locations, story events, dialogue, or relationships.
- Do not move Rex's exile into EP-001. His father expels him in EP-007 after the evidence and family conflict have developed.
- Do not age Milo up: he is a very young puppy in this episode.
- Preserve character identity, face, complexion, hair, build, wardrobe and age across all shots. Use creator-approved reference images when they exist. At present, no permanent face portraits have been approved.
- If a tool cannot maintain identity across a long render, create numbered scene clips and assemble them in screenplay order. Reuse the same approved reference image, seed, character ID or reference-strength settings where the platform supports them.
- Do not generate fake text, subtitles, watermarks, logos or legible documents. Add typography and captions in post.
- Do not publish or label outputs final until the creator approves the script, character references, illustrations and render.
- For Shorts, create five distinct vertical edits from the completed episode. Do not claim they are episode extracts if the episode has not been rendered.

## Tool interoperability
The prompts are written in plain Markdown and do not depend on a specific vendor API. A human or agent can pass the relevant prompt and source files to Huggsfield, Grok, or another renderer. Platform-specific settings should be adapted only where supported; never invent unavailable controls or claim a render succeeded without a returned asset.

## Output naming convention
- Episode scene clips: `EP001_S01_SC01_v01.mp4`, increment scene number.
- Assembled episode: `NEXCARTIA_EP001_HOUSE_OF_KINGS_v01.mp4`.
- Shorts: `NEXCARTIA_EP001_SHORT01_PUPPY_IN_THE_PALACE_v01.mp4` through `SHORT05`.
- Store renders and generated assets outside the source documents in a versioned output folder. Never overwrite approved source files.
