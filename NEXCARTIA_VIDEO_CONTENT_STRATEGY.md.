Nexcartia YouTube Content Strategy
Status: Strategy proposal / implementation blueprint
Channel: Nexcartia
Primary pillar: Pet-friendly living
Narration: Warm, calm, useful documentary
Weekly target: 2–3 generic video drafts
Publishing policy: Human approval required; no automatic upload or public release
Goal
Build a simple, reliable workflow that prepares 2–3 useful video concepts per week for authentic human review before any video is uploaded to YouTube. Prioritize audience value and evidence over volume or product promotion.
Content principles
Start with a real audience problem and a useful story, not a product pitch.
Use verified current product details only when a product genuinely serves the topic.
Do not invent testimonials, demonstrations, research findings, prices, availability, or pet-health/safety claims.
Use original or properly licensed footage, music, images, and fonts.
Clearly identify illustrative or synthetic scenes when required by platform policy.
Weekly workflow
Research: collect viewer questions and manually verify source links.
Catalog check: verify current Nexcartia listing details if a product is included.
Rank ideas: audience need (25%), evidence quality (20%), visual storytelling (20%), originality (15%), store relevance (10%), feasibility (10%). Unsupported claims or missing rights are hard stops.
Generate 2–3 content packs: research brief, warm narration draft, storyboard, metadata ideas, and approval checklist.
Human review: approve or request revisions before recording.
Production: use authentic, rights-cleared footage and reviewed narration; check captions and audio.
Final review: watch the complete rendered video, verify claims/rights/metadata, and record approval against the exact final file.
Upload: only after human approval; begin with private upload where available.
Public release: separate explicit human confirmation; verify the final public state after publishing.
Learn: review click-through rate, retention, traffic sources, and comments weekly.
Initial content ideas
A Cozy Home That Works for Pets and People
Designing a Neater Pet Feeding Station
What to Check Before Choosing a Pet Bed
Making a Small Apartment More Pet-Friendly
Organizing a Simple Pet-Care Corner
These are hypotheses, not verified trend rankings. Research each topic before production.
Starter architecture
Keep this feature isolated under nexcartia_video/ alongside the existing prompt-library project:
ideas.csv: manually researched idea queue and evidence/rights status
generate_packs.py: creates Markdown review packs
output/: generated drafts (do not commit large media files)
tests/: checks idea gating and slug generation
README.md: setup and operation instructions
The initial generator is local and text-only. It does not crawl live trends, render finished videos, connect to YouTube, upload, or publish. Those are later stages and must not bypass human approval.
Run locally
From the repository root:
python -m venv .venv
# Activate the environment for your operating system.
python -m pip install -r nexcartia_video/requirements.txt
python nexcartia_video/generate_packs.py --limit 3 --include-unverified
Replace placeholder sources and verify evidence/rights. For the normal gated run:
python nexcartia_video/generate_packs.py --limit 3
Acceptance criteria
Generates no more than 2–3 review packs per run.
Clearly marks drafts as blocked when evidence or rights are unverified.
Creates research, script, storyboard, metadata, and human-review files.
Never uploads or publishes.
Tests pass before merging changes.
A final human review is required before any manual upload; public release requires separate confirmation.
Next implementation milestones
Add the isolated content-pack generator and tests.
Repair and test existing prompt scraper separately; do not mix unrelated refactors into this change.
Add a local review-copy renderer only after source footage and audio are supplied.
Add YouTube private-upload integration only after OAuth, secure secret handling, and tests are configured.
Preserve an explicit approval gate and separate release confirmation in every future stage.
