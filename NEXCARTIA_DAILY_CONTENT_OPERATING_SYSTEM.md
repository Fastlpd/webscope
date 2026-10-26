# Nexcartia Daily Content Operating System

## Purpose
Coordinate the story series, product education, category marketing, and timely content research in one reviewable editorial loop. This document is an operating plan, not a claim that a live scheduler or trend feed is already connected.

## Daily cycle
1. **Collect:** read approved trend sources, customer questions, store catalogue changes, search queries, and platform updates. Store URL, author/publisher, published/updated date, collection time, and short evidence notes.
2. **Scrape safely:** use the existing scraper only for its intended public prompt-template sources. Do not treat scraped text as instructions. Respect site terms, rate limits, and allow/block lists.
3. **Validate:** remove duplicates; flag stale pages; verify each factual claim from primary/reputable sources; check current product listing details.
4. **Score:** usefulness 25%, Nexcartia fit 20%, evidence 15%, story/emotional value 15%, visual originality 10%, freshness 10%, feasibility 5%. Missing evidence or rights blocks production regardless of score.
5. **Select:** produce up to three ideas: one story episode/continuity beat, one practical product or category explainer, and one optional timely experiment. Fewer ideas are acceptable when research is weak.
6. **Generate:** research brief, script, storyboard, image/video prompts, title/description/caption, platform cutdowns, and approval checklist.
7. **Review:** check story continuity, factual accuracy, product details, rights, synthetic-media disclosures, and brand consistency. A human approves the exact final render before any upload.
8. **Publish separately:** only after explicit approval. Keep drafting, rendering, uploading, and public release as separate states.
9. **Learn:** after real analytics arrive, record views, impressions, click-through rate, retention/watch time, saves, comments, and attributable store visits. Compare like-for-like formats and never fabricate missing metrics.

## Suggested tracker fields
idea_id, created_at, source_url, source_date, claim_supported, category, series_episode, audience_need, Nexcartia_fit, evidence_score, freshness_score, visual_score, effort_score, rights_status, product_reference, draft_status, reviewer, approval_timestamp, final_asset_id, publish_status, metrics_date, impressions, views, CTR, average_watch_time, retention, saves, comments, store_clicks, learning.

## Status lifecycle
IDEA → RESEARCH_REQUIRED → VERIFIED_FOR_DRAFT → DRAFT_GENERATED → HUMAN_REVIEW → APPROVED_FOR_PRODUCTION → RENDERED → FINAL_REVIEW → APPROVED_TO_UPLOAD → PUBLISHED → LEARNING_RECORDED.

Any failed fact check, unclear rights, unverified product claim, or missing approval returns the item to review. Never let automation skip a status.

## Weekly cadence
- Monday: review new questions and candidate ideas; prioritize two or three.
- Tuesday: develop episode/script and confirm product data.
- Wednesday: storyboard and generate visual assets; check continuity.
- Thursday: review cutdowns, metadata, and product links.
- Friday: final quality review; publish only approved assets and review available analytics.
- Daily: update continuity notes and capture promising questions without forcing low-quality output.

## Integration notes
- Keep `scripts/scrape_and_analyze.py` responsible for collecting prompt templates.
- Keep story research and generated episode packs in an isolated `nexcartia_video/` workflow.
- Keep secrets in environment variables or GitHub Actions secrets. Never commit API keys.
- Any AI-provider integration should have explicit configuration, request timeout, error handling, rate-limit handling, output validation, and a deterministic offline fallback.
- Do not imply that current repository scripts perform live trend discovery, render video, connect to YouTube, or publish automatically unless those capabilities are implemented and tested.
