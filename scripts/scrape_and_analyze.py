from __future__ import annotations

import csv
import hashlib
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

import requests
from bs4 import BeautifulSoup
import pandas as pd

# Optional: LLM rating
try:
import openai
except Exception:
openai = None

ROOT = Path(__file__).resolve().parents[1]
PROMPTS_DIR = ROOT / "prompts"
PROMPT_BANK = PROMPTS_DIR / "prompt_bank.csv"

DEFAULT_HEADERS = ["id", "niche", "prompt", "source", "rating", "unique_score", "first_seen"]

# Heuristic config (override with env vars)
MIN_WORDS = int(os.getenv("MIN_PROMPT_WORDS", "8"))
MAX_PROMPTS_PER_SOURCE = int(os.getenv("MAX_PROMPTS_PER_SOURCE", "20"))
PROMPT_DOMAINS_BLOCK = [d.strip().lower() for d in os.getenv("PROMPT_DOMAINS_BLOCK", "").split(",") if d.strip()]
PROMPT_DOMAINS_ALLOW = [d.strip().lower() for d in os.getenv("PROMPT_DOMAINS_ALLOW", "").split(",") if d.strip()]

PROMPT_MARKERS = [
r"\bprompt\b", r"\binstruction\b", r"\btask\b", r"\binput\b", r"\boutput\b", r"^#{1,3}\s*prompt\b",
]
PLACEHOLDER_PATTERN = re.compile(r"(\{[^}]+\}|\[NAME\]|\[ITEM\])", re.I)
URL_RE = re.compile(r"https?://|www\.", re.I)
EMAIL_RE = re.compile(r"\S+@\S+\.\S+")

def ensure_prompt_bank():
PROMPTS_DIR.mkdir(exist_ok=True)
if not PROMPT_BANK.exists():
    with PROMPT_BANK.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(DEFAULT_HEADERS)

def normalize_text(t: str) -> str:
t = re.sub(r"\s+", " ", t).strip()
t = t.lower()
t = re.sub(r"[\"'`]", "", t)
return t

def hash_text(text: str) -> str:
return hashlib.sha1(text.encode("utf-8")).hexdigest()

def load_existing_hashes() -> Dict[str, Dict]:
if not PROMPT_BANK.exists():
    return {}
df = pd.read_csv(PROMPT_BANK)
out = {}
for _, row in df.iterrows():
    h = hash_text(normalize_text(str(row.get("prompt", ""))))
    out[h] = row.to_dict()
return out

def looks_like_prompt(text: str) -> bool:
if URL_RE.search(text) or EMAIL_RE.search(text):
    return False
words = text.split()
if len(words) < MIN_WORDS:
    return False
marker_found = any(re.search(m, text, re.I | re.M) for m in PROMPT_MARKERS)
placeholder_found = bool(PLACEHOLDER_PATTERN.search(text))
template_phrases = bool(re.search(r"\b(create|generate|write|produce|draft|compose)\b", text, re.I))
return marker_found or placeholder_found or (template_phrases and len(words) >= (MIN_WORDS + 4))

def extract_prompts_from_html(html: str) -> List[str]:
soup = BeautifulSoup(html, "html.parser")
candidates: List[str] = []

# prefer code/pre/blockquote blocks
for tag in soup.find_all(["pre", "code", "blockquote"]):
    t = tag.get_text(separator=" ").strip()
    if not t:
        continue
    t_norm = re.sub(r"\s+", " ", t)
    if looks_like_prompt(t_norm):
        candidates.append(t_norm)

# Also scan for headings or paragraphs that explicitly start with "Prompt:" or contain markers
for el in soup.find_all(["p", "div", "li", "h1", "h2", "h3"]):
    txt = el.get_text(separator=" ").strip()
    if not txt:
        continue
    if re.search(r"^\s*(prompt|instruction|task)\s*[:\-]\s*", txt, re.I):
        txt_norm = re.sub(r"\s+", " ", txt)
        if looks_like_prompt(txt_norm):
            candidates.append(txt_norm)

# de-dup normalized
seen = set()
out = []
for t in candidates:
    n = normalize_text(t)
    if n in seen:
        continue
    seen.add(n)
    out.append(t)
return out

def fetch_url(url: str) -> Optional[str]:
try:
    r = requests.get(url, timeout=15, headers={"User-Agent": "nexcart-prompt-scraper/1.0"})
    r.raise_for_status()
    return r.text
except Exception as e:
    print(f"Failed to fetch {url}: {e}")
    return None

def simple_score(prompt: str, niche_keywords: List[str]) -> float:
score = 0.0
length = len(prompt.split())
if length > 20:
    score += 1.0
# bonus for niche keywords
for kw in niche_keywords:
    if kw.lower() in prompt.lower():
        score += 0.5
# penalize extremely generic prompts
generic_phrases = ["give me", "tell me", "how to", "what is"]
if any(p in prompt.lower() for p in generic_phrases):
    score -= 0.3
return round(max(0.0, score), 2)

def llm_rate(prompt: str) -> Optional[float]:
if not openai:
    return None
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    return None
try:
    openai.api_key = api_key
    resp = openai.ChatCompletion.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": "You are a helpful assistant that rates prompt quality and uniqueness from 1 (poor) to 5 (excellent)."},
            {"role": "user", "content": f"Rate the following prompt for uniqueness and usefulness to build e-commerce content. Return only a single number 1-5.\n\nPrompt:\n{prompt}"},
        ],
        temperature=0.0,
        max_tokens=10,
    )
    text = resp.choices[0].message.content.strip()
    m = re.search(r"([1-5])", text)
    if m:
        return float(m.group(1))
except Exception as e:
    print(f"LLM rating failed: {e}")
return None

def append_prompts(new_prompts: List[Dict]):
ensure_prompt_bank()
df_new = pd.DataFrame(new_prompts)
if df_new.empty:
    print("No new prompts to add.")
    return
df_new = df_new[DEFAULT_HEADERS]
if PROMPT_BANK.exists():
    df_existing = pd.read_csv(PROMPT_BANK)
else:
    df_existing = pd.DataFrame(columns=DEFAULT_HEADERS)
df_combined = pd.concat([df_existing, df_new], ignore_index=True)
df_combined.to_csv(PROMPT_BANK, index=False)
print(f"Appended {len(df_new)} prompts to {PROMPT_BANK}")

def domain_blocked(url: str) -> bool:
domain = url.lower()
if PROMPT_DOMAINS_BLOCK and any(block in domain for block in PROMPT_DOMAINS_BLOCK):
    return True
if PROMPT_DOMAINS_ALLOW and not any(allow in domain for allow in PROMPT_DOMAINS_ALLOW):
    return True
return False

def main():
ensure_prompt_bank()
sources_env = os.getenv("PROMPT_SOURCES", "")
sources = [s.strip() for s in sources_env.split(",") if s.strip()] if sources_env else []
if not sources:
    print("PROMPT_SOURCES not set; exiting. Set PROMPT_SOURCES environment variable to a comma-separated list of URLs or feeds.")
    sys.exit(0)

existing = load_existing_hashes()
new_records = []
id_counter = 1
for src in sources:
    if domain_blocked(src):
        print(f"Skipping blocked or not-allowed source: {src}")
        continue
    print(f"Fetching {src} ...")
    html = fetch_url(src)
    if not html:
        continue
    prompts = extract_prompts_from_html(html)
    added_for_source = 0
    for p in prompts:
        if added_for_source >= MAX_PROMPTS_PER_SOURCE:
            break
        n = normalize_text(p)
        h = hash_text(n)
        if h in existing:
            continue

        lower_src_and_p = (src + " " + p).lower()
        niche = "uncategorized"
        if "pet" in lower_src_and_p:
            niche = "pet supplies"
        elif "baby" in lower_src_and_p:
            niche = "baby & kids"
        elif "travel" in lower_src_and_p:
            niche = "travel accessories"
        elif any(k in lower_src_and_p for k in ["eco", "sustain"]):
            niche = "eco / sustainable"
        elif any(k in lower_src_and_p for k in ["fashion", "apparel"]):
            niche = "fashion / apparel"

        simple = simple_score(p, [niche.split()[0]])
        rating = None
        if os.getenv("ENABLE_LLM_RATING", "false").lower() == "true":
            rating = llm_rate(p)

        record = {
            "id": id_counter,
            "niche": niche,
            "prompt": p,
            "source": src,
            "rating": rating if rating is not None else "",
            "unique_score": simple,
            "first_seen": datetime.utcnow().isoformat(),
        }
        id_counter += 1
        new_records.append(record)
        added_for_source += 1

if new_records:
    append_prompts(new_records)
else:
    print("No new prompts found.")

if __name__ == "__main__":
main()
