# Nexcartia video content drafts (free-first)

This module adds a video-content workflow without duplicating `scripts/scrape_and_analyze.py`.
The existing scraper collects prompt templates into `prompts/prompt_bank.csv`. This module
uses its own small, human-curated `ideas.csv` as editorial input and writes text-only packs.
It requires Python 3.10+ and the standard library only. No paid API key is needed.

## Run locally

```bash
python nexcartia_video/generate_packs.py --limit 3 --include-unverified
python -m unittest discover -s nexcartia_video/tests -v
```

`--include-unverified` allows exploratory draft packs to be written, but their status remains
blocked until sources are verified and rights are cleared. Without that flag, only ideas with
`evidence_status=verified`, `rights_status=cleared`, and non-placeholder sources are generated.

Output folders are created under `nexcartia_video/output/`. Each contains research, script,
storyboard, metadata, and a human approval checklist. No video rendering, upload, or publishing
is implemented. A human must review facts, sources, rights, and final content.

## Weekly workflow

1. Add 2–3 candidate ideas to `ideas.csv`.
2. Verify source URLs and rights status before marking an idea ready.
3. Run the generator to prepare draft packs.
4. Review and edit every pack manually.
5. Only separately approved content may move to recording/production.

The generated text is a starting draft, not verified research or professional pet-care advice.
