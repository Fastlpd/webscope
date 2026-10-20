from __future__ import annotations

import argparse
import csv
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IDEAS_FILE = ROOT / "nexcartia_video" / "ideas.csv"
OUTPUT_DIR = ROOT / "nexcartia_video" / "output"
PLACEHOLDER_MARKERS = ("REPLACE_WITH_VERIFIED_SOURCE", "example.com", "your-source-here")


def slugify(text: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text.lower())).strip("-")[:70] or "untitled"


def load_ideas(path: Path = IDEAS_FILE) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def has_real_source(idea: dict[str, str]) -> bool:
    sources = [s.strip() for s in idea.get("sources", "").split(";") if s.strip()]
    return bool(sources) and not any(marker.lower() in " ".join(sources).lower() for marker in PLACEHOLDER_MARKERS)


def passes_evidence_gate(idea: dict[str, str]) -> bool:
    return has_real_source(idea) and idea.get("evidence_status", "").strip().lower() == "verified" and idea.get("rights_status", "").strip().lower() == "cleared"


def make_pack(idea: dict[str, str], index: int, output_dir: Path = OUTPUT_DIR) -> Path:
    episode_id = f"{date.today():%Y%m%d}-PET-{index:02d}"
    folder = output_dir / f"{episode_id}-{slugify(idea.get('title', 'untitled'))}"
    folder.mkdir(parents=True, exist_ok=True)
    sources = [s.strip() for s in idea.get("sources", "").split(";") if s.strip()]
    approved_for_review = passes_evidence_gate(idea)
    status = "READY_FOR_HUMAN_REVIEW" if approved_for_review else "BLOCKED_PENDING_RESEARCH_REVIEW"
    title = idea.get("title", "Untitled").strip()
    problem = idea.get("audience_problem", "").strip()
    angle = idea.get("angle", "").strip()

    (folder / "research.md").write_text(f"""# Research brief: {title}

- Episode ID: `{episode_id}`
- Created: {date.today().isoformat()}
- Status: `{status}`

## Viewer problem
{problem}

## Proposed angle
{angle}

## Product reference
{idea.get('product_reference', '').strip() or 'None selected. Do not add product claims until a current listing is verified.'}

## Sources supplied
""" + ("\n".join(f"- {s}" for s in sources) if sources else "- None supplied.") + """

## Required checks
- [ ] Open each source and confirm it supports the relevant statement.
- [ ] Check factual and pet-care claims against reputable sources.
- [ ] Verify product details on a current listing before mentioning them.
- [ ] Check media licensing and record asset provenance.
- [ ] Human reviewer approves the idea and script before production.
""", encoding="utf-8")

    (folder / "script.md").write_text(f"""# Script draft: {title}

**Voice:** warm, calm, useful documentary narration  
**Status:** DRAFT — not approved for recording or upload

## Hook (0:00–0:20)
Start with a relatable everyday moment: {problem}. Avoid invented testimonials or claims that imply personal experience.

## Main story
1. **Set the scene:** Explain the viewer's problem in simple, empathetic language.
2. **Useful considerations:** Offer practical, low-risk ideas related to: {angle}. Verify factual claims against the research brief.
3. **Demonstration:** Show a real setup or clearly labelled illustrative scene.
4. **Takeaway:** Give the viewer one small action they can consider, without pressure to buy anything.

## Closing
Summarize the main lesson and invite viewers to share their own practical tips. Do not imply the video is veterinary advice.

## Production notes
- Keep narration warm and natural; edit for clarity, not hype.
- Use only original, licensed, or otherwise cleared visuals and audio.
- Replace all unsupported statements before recording.
""", encoding="utf-8")

    (folder / "storyboard.md").write_text(f"""# Storyboard: {title}

| Beat | Approx. time | Visual direction | Narration purpose |
|---|---:|---|---|
| 1. Hook | 0:00–0:20 | Everyday home scene; use cleared footage | Establish the problem: {problem} |
| 2. Context | 0:20–0:50 | Show the current setup without staging a fake testimonial | Explain why the topic matters |
| 3. Practical points | 0:50–2:00 | 2–3 clear demonstrations or labelled diagrams | Explain: {angle} |
| 4. Recap | 2:00–2:20 | Simple before/after only if authentic and fairly represented | Reinforce the useful takeaway |
| 5. Close | 2:20–2:35 | Calm closing shot and end card | Invite thoughtful discussion |

Times are placeholders; adjust to the final reviewed script.
""", encoding="utf-8")

    (folder / "metadata.md").write_text(f"""# YouTube metadata draft: {title}

**Status:** DRAFT — human review required

## Title options
1. {title}: Simple Ideas for Everyday Pet-Friendly Living
2. A Practical Guide to {title}
3. Small Changes for a More Organized Pet-Friendly Home

## Description
A calm, practical look at {problem.lower()}. This draft focuses on helpful ideas rather than product pressure. Verify all claims and links before publishing.

## Suggested keywords
pet-friendly home, pet care organization, everyday pet care, responsible pet ownership

## Thumbnail direction
Use an authentic, rights-cleared home scene with a clear focal point. Avoid misleading before/after imagery or exaggerated claims.
""", encoding="utf-8")

    (folder / "approval.md").write_text(f"""# Human review and approval: {title}

Draft status: `{status}`

- [ ] Idea is useful and original.
- [ ] Sources were opened and support the claims.
- [ ] Pet-care and safety claims are appropriately qualified.
- [ ] Product details and links are current, if included.
- [ ] Visuals, music, fonts and other assets have documented rights.
- [ ] Script and metadata were read aloud and edited by a human.
- [ ] Final edit matches the approved script and storyboard.
- [ ] Human explicitly approves production and separately approves any upload.

**No automatic upload or public release is implemented.**
""", encoding="utf-8")
    return folder


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Nexcartia text-only YouTube draft packs.")
    parser.add_argument("--limit", type=int, default=3, help="Maximum number of ideas to process (default: 3).")
    parser.add_argument("--include-unverified", action="store_true", help="Create blocked exploratory drafts for unverified ideas.")
    parser.add_argument("--ideas", type=Path, default=IDEAS_FILE, help="Optional ideas CSV path.")
    parser.add_argument("--output", type=Path, default=OUTPUT_DIR, help="Output directory.")
    args = parser.parse_args()
    if args.limit < 1:
        parser.error("--limit must be at least 1")
    ideas = load_ideas(args.ideas)
    eligible = [idea for idea in ideas if args.include_unverified or passes_evidence_gate(idea)]
    selected = eligible[:args.limit]
    if not selected:
        print("No ideas passed the source/evidence/rights gate. Add verified sources and set statuses, or use --include-unverified for blocked drafts.")
        return 0
    for index, idea in enumerate(selected, start=1):
        print(f"Created: {make_pack(idea, index, args.output)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
