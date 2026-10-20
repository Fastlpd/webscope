from __future__ import annotations

"""Collect reusable prompt templates from configured public web pages.

This script deliberately uses the repository's existing prompt bank. It does not
write video scripts; that separate responsibility lives in nexcartia_video/.
"""

import csv
import hashlib
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PROMPTS_DIR = ROOT / "prompts"
PROMPT_BANK = PROMPTS_DIR / "prompt_bank.csv"
BASE_HEADERS = ["id", "category", "niche", "prompt", "placeholders", "source", "rating", "unique_score", "first_seen"]
MIN_WORDS = int(os.getenv("MIN_PROMPT_WORDS", "8"))
MAX_PROMPTS_PER_SOURCE = int(os.getenv("MAX_PROMPTS_PER_SOURCE", "20"))
BLOCKED = [x.strip().lower() for x in os.getenv("PROMPT_DOMAINS_BLOCK", "").split(",") if x.strip()]
ALLOWED = [x.strip().lower() for x in os.getenv("PROMPT_DOMAINS_ALLOW", "").split(",") if x.strip()]
MARKERS = re.compile(r"\b(prompt|instruction|task|input|output)\b", re.I)
PLACEHOLDER = re.compile(r"\{([^}]+)\}|\[(NAME|ITEM)\]", re.I)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip().lower().replace('"', "").replace("'", "")


def digest(text: str) -> str:
    return hashlib.sha256(normalize(text).encode("utf-8")).hexdigest()


def ensure_prompt_bank() -> None:
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)
    if not PROMPT_BANK.exists():
        with PROMPT_BANK.open("w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=BASE_HEADERS).writeheader()


def read_rows() -> tuple[list[str], list[dict[str, str]]]:
    ensure_prompt_bank()
    with PROMPT_BANK.open("r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        headers = list(reader.fieldnames or [])
        rows = [{k: (v or "") for k, v in row.items() if k is not None} for row in reader]
    # Preserve the current CSV's columns and add fields used by this scraper.
    for field in BASE_HEADERS:
        if field not in headers:
            headers.append(field)
    return headers, rows


def write_rows(headers: list[str], rows: list[dict[str, str]]) -> None:
    temp = PROMPT_BANK.with_suffix(".csv.tmp")
    with temp.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({h: row.get(h, "") for h in headers})
    temp.replace(PROMPT_BANK)


def looks_like_prompt(text: str) -> bool:
    if len(text.split()) < MIN_WORDS or re.search(r"https?://|\S+@\S+\.\S+", text, re.I):
        return False
    return bool(MARKERS.search(text) or PLACEHOLDER.search(text) or re.search(r"\b(create|generate|write|produce|draft|compose)\b", text, re.I))


def extract_prompts(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    found: list[str] = []
    for tag in soup.find_all(["pre", "code", "blockquote", "p", "li", "h1", "h2", "h3"]):
        text = re.sub(r"\s+", " ", tag.get_text(" ", strip=True)).strip()
        if text and looks_like_prompt(text):
            found.append(text)
    unique: list[str] = []
    seen: set[str] = set()
    for text in found:
        key = normalize(text)
        if key not in seen:
            seen.add(key)
            unique.append(text)
    return unique


def domain_allowed(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    if not host or (BLOCKED and any(x in host for x in BLOCKED)):
        return False
    return not ALLOWED or any(x in host for x in ALLOWED)


def infer_niche(source: str, prompt: str) -> str:
    text = f"{source} {prompt}".lower()
    for terms, niche in [(["pet", "dog", "cat"], "pet supplies"), (["baby", "kids"], "baby & kids"), (["travel"], "travel accessories"), (["eco", "sustain"], "eco / sustainable"), (["fashion", "apparel"], "fashion / apparel"), (["smart home", "sensor"], "smart home")]:
        if any(term in text for term in terms):
            return niche
    return "uncategorized"


def main() -> int:
    headers, rows = read_rows()
    existing = {digest(row.get("prompt", "")) for row in rows if row.get("prompt", "").strip()}
    sources = [s.strip() for s in os.getenv("PROMPT_SOURCES", "").split(",") if s.strip()]
    if not sources:
        print("PROMPT_SOURCES is not set; prompt bank left unchanged.")
        return 0
    new_rows: list[dict[str, str]] = []
    next_id = max([int(r.get("id", "0")) for r in rows if (r.get("id", "").isdigit())] or [0]) + 1
    for source in sources:
        if not domain_allowed(source):
            print(f"Skipping source not allowed by domain rules: {source}")
            continue
        try:
            response = requests.get(source, timeout=20, headers={"User-Agent": "webscope-prompt-collector/1.0"})
            response.raise_for_status()
        except requests.RequestException as exc:
            print(f"Could not fetch {source}: {exc}", file=sys.stderr)
            continue
        added = 0
        for prompt in extract_prompts(response.text):
            key = digest(prompt)
            if key in existing:
                continue
            placeholders = ",".join(sorted({match.group(0) for match in PLACEHOLDER.finditer(prompt)}))
            # The current prompt bank uses category/niche/prompt/placeholders. Extra
            # provenance fields are appended without discarding existing columns.
            row = {h: "" for h in headers}
            row.update({
                "id": str(next_id), "category": "Scraped", "niche": infer_niche(source, prompt),
                "prompt": prompt, "placeholders": placeholders, "source": source,
                "rating": "", "unique_score": str(round(min(len(prompt.split()) / 30, 5), 2)),
                "first_seen": datetime.now(timezone.utc).isoformat(),
            })
            new_rows.append(row)
            existing.add(key)
            next_id += 1
            added += 1
            if added >= MAX_PROMPTS_PER_SOURCE:
                break
    if new_rows:
        write_rows(headers, rows + new_rows)
        print(f"Added {len(new_rows)} prompts to {PROMPT_BANK}")
    else:
        print("No new prompts found; prompt bank left unchanged.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
