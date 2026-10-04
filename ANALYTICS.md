# Prompt Vault Analytics & Metrics

This document tracks coverage, usage, and metrics for the **NexCart Prompt Vault** dataset (`prompts/prompt_bank.csv`).

---

## 📊 Overview Metrics

| Metric | Count / Value |
| :--- | :--- |
| **Total Core Prompts** | 50 |
| **Primary Niches Covered** | 6 (Pet supplies, Smart home, Baby & kids, Travel, Eco/sustainable, Fashion) |
| **Functional Categories** | 18 categories |
| **Automated Scraper Status** | Daily execution (`.github/workflows/scrape_prompts.yml`) |

---

## 🎯 Coverage Breakdown by Category

- **Strategy & Strategy Planning:** 2 prompts
- **Branding & Voice:** 1 prompt
- **Design & Homepage Wireframing:** 1 prompt
- **UX & Accessibility:** 2 prompts
- **Content Creation (Product, Category, Blog):** 3 prompts
- **SEO & Structured Data:** 3 prompts
- **Paid Acquisition & Ads:** 3 prompts
- **Email & Retention:** 3 prompts
- **Checkout & Payments:** 2 prompts
- **Integrations & Tech Stack:** 2 prompts
- **Development & Technical Scaffolds:** 2 prompts
- **Quality Assurance & Testing:** 3 prompts
- **Performance & Security:** 2 prompts
- **Analytics, SQL & CRO:** 3 prompts
- **Operations & Launch:** 2 prompts
- **Customer Support & Chatbots:** 2 prompts
- **Localization & Adaptations:** 1 prompt
- **Niche Starter Frameworks:** 6 prompts

---

## 📈 Quality & Uniqueness Scoring Pipeline

Prompts collected via the automated scraper (`scripts/scrape_and_analyze.py`) are evaluated on two metrics before merging:

1. **Uniqueness Score:** Calculated via SHA-1 hashing of normalized text and placeholder counts to eliminate duplicate templates.
2. **Quality Rating (LLM Optional):** Evaluated on a scale of 1–5 using GPT-4o-mini for structure, parameterization, and clarity.

---

## 🤝 Community Submissions

New prompt submissions sent via [GitHub Issues](https://github.com/Fastlpd/webscope/issues/new/choose) are reviewed against our CSV schema (`id`, `category`, `niche`, `prompt`, `placeholders`) before being appended to the primary vault.
