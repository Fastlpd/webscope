# NexCart Prompt Vault

A ready-to-use library of prompt templates for building e‑commerce shopping websites, marketing, content, and technical scaffolds. Tailored for NexCart (pet supplies + smart‑home essentials) and extended to these niches:
- Pet supplies (primary)
- Smart home essentials (primary)
- Baby & kids
- Travel accessories
- Eco / sustainable products
- Fashion / Apparel

Use: copy a prompt, replace placeholders in {curly_braces}, and send to your LLM of choice.

Common placeholders
- {brand_name} — NexCart
- {niche} — e.g., "organic pet toys" or "smart home sensors"
- {audience} — target buyer persona
- {tone} — friendly / professional / luxury / playful / eco‑conscious
- {platform} — Shopify / WooCommerce / Next.js / headless
- {product_name}, {price}, {currency}, {country}
- {top_products}, {collections}, {USP}, {shipping_policy_brief}

--- 
CONTENTS
1) Strategy & planning
2) Branding & tone
3) Design & UX
4) Content: product pages, categories, blog
5) SEO & structured data
6) Marketing, acquisition & ads
7) Retention, lifecycle & CX
8) Checkout & payments
9) Integrations & tech stack
10) Development & scaffolding
11) Performance & security
12) Analytics & testing
13) Operations & fulfillment
14) Launch & go‑to‑market
15) Support & bots
16) Localization & accessibility
17) QA & testing
18) Niche-specific starters (Pet, Smart Home, Baby & Kids, Travel, Eco, Fashion)
19) Worked NexCart example
20) Usage tips

---

1) Strategy & planning
- "Write a one‑page e‑commerce strategy for {brand_name} selling {niche} to {audience}. Include target customer segments, 3 business goals (6–12 months), KPIs, pricing strategy, fulfillment options, 3 launch channels, and a 90‑day roadmap."
- "Create a product mix recommendation for {niche}: core product, 3 accessories, 2 subscription options, and 3 premium bundles. Include suggested retail price ranges in {currency}."

2) Branding & tone
- "Create a brand voice guide for {brand_name}: 6 adjectives, dos/don’ts, 8 microcopy examples for product pages, and 5 email subject line examples in a {tone} voice."
- "Generate 6 tagline variations and a 1‑sentence mission statement for {brand_name} focused on {USP}."

3) Design & UX
- "Generate a homepage wireframe outline for an e-commerce store selling {niche}. Include hero copy, primary CTA, featured collections, trust elements, and a mobile-first content order."
- "List 12 accessibility checklist items for an e-commerce site with short remediation notes."

4) Content: product pages, categories, blog
- Product page:
"Write a product page for {product_name} for {brand_name} ({niche}). Include:
- Short tagline (10–12 words)
- 3 bullet benefits targeted to {audience}
- Detailed description (120–180 words)
- 5 SEO keywords naturally included
- 3 social captions (1 long, 2 short)"
- Category page:
"Write a category page for {collection_name} (for {niche}): intro paragraph (100 words), three subcategories, buyer guide (4 tips), and internal links to 4 product pages."
- Blog:
"Create an SEO blog outline + intro (200 words) titled '{topic}' relevant to {niche}. Provide 8 subheadings, suggested CTAs, and 5 long‑tail keywords."

5) SEO & structured data
- "Produce SEO meta title, meta description, H1, and 5 long‑tail keywords for the product {product_name} in {country}."
- "Generate JSON‑LD product structured data for {product_name} with placeholders for price, currency, availability, and aggregateRating."

6) Marketing, acquisition & ads
- Ads:
"Write 10 Google responsive ad headlines and 4 descriptions for {brand_name} selling {niche} emphasizing {USP}."
"Create 6 Facebook/Instagram ad captions and 3 visual direction notes for {product_name}. Provide 3 A/B variants."
- Email flows:
"Design a 5‑email welcome flow for new subscribers: goal, subject line, short body copy, timing, and CTA."

7) Retention, lifecycle & CX
- "Write 3 cross‑sell snippets and 3 up‑sell lines for product pages with placement suggestions and a one‑line cart popup message."
- "Draft a customer support reply for an order delay with empathetic tone, compensation options, and next steps."

8) Checkout & payments
- "List best checkout UX patterns to reduce friction for {audience} and provide microcopy for coupon field, shipping estimator, and CTA text."
- "Create copy for a minimal guest checkout flow emphasizing speed and security."

9) Integrations & tech stack
- "Recommend a tech stack for {brand_name} with expected monthly visitors {visitors}: CMS, front end, payments, analytics, search, and estimated costs."
- "Outline steps to connect {platform} to a fulfillment API and SMS provider, including webhook test cases."

10) Development & scaffolding
- "Generate a Next.js + Tailwind starter scaffold for {niche} with routes: index, product/[slug], category/[slug], cart, checkout; include mock product JSON schema."
- "Write a minimal Shopify Liquid product template with image gallery, price, badges, and related products."

11) Performance & security
- "Produce a prioritized Lighthouse-focused performance audit with fixes (image formats, CDN, caching, critical CSS)."
- "List security hardening steps for e‑commerce: CSP, rate limiting, dependency scanning, PCI notes."

12) Analytics & testing
- "Create a tracking plan: events for view_item, add_to_cart, begin_checkout, purchase with recommended GTM triggers and dashboard metrics."
- "Provide a Postgres SQL query to compute repeat purchase rate by cohort over 6 months (schema: orders(id,user_id,total,created_at))."

13) Operations & fulfillment
- "Draft a fulfillment SOP for {brand_name}: receiving, packing, shipping, returns, RMA process, and 6 SLAs."
- "Create a concise return/refund policy (80–120 words) for {country}."

14) Launch & go‑to‑market
- "Make a 30‑day launch checklist with QA, assets list, influencer outreach template, and 5 launch KPIs."
- "Draft a 300‑word press release for launch of {brand_name} in {niche}."

15) Support & bots
- "Write 20 FAQ Q&A pairs for a support bot covering shipping, returns, sizing, payments, and delays for {niche}."
- "Design a conversation tree for a recommendation bot that asks 3 qualifying questions and recommends 3 SKUs."

16) Localization & accessibility
- "Translate and adapt product page copy into {language}, maintaining {tone} and local idioms, currency, and shipping notes."
- "Produce an accessibility audit prompt to check forms, keyboard nav, alt text, color contrast, and ARIA roles with remediation code snippets."

17) QA & testing
- "Generate a QA checklist for release: smoke tests for product pages, cart, checkout, payment provider, order emails, and analytics events."
- "Create 10 Cypress end‑to‑end tests for checkout flow from product selection to order confirmation."

18) Niche‑specific starter prompts
For each below, use: "Create a complete e‑commerce site plan for {brand_name} selling [niche] to {audience} including: homepage hero, 3 product page examples, 3 blog topics + intros, 5 SEO keywords, 3 ad captions, and suggested pricing tiers."

Niches included:
- Pet supplies (e.g., organic toys, dental chews, smart feeders)
- Smart home essentials (sensors, smart plugs, cameras — complements pet care)
- Baby & kids
- Travel accessories
- Eco / sustainable products
- Fashion / Apparel

19) Worked NexCart example (short)
Prompt sent:
"Create a complete e‑commerce site plan for 'NexCart' selling pet supplies and smart home essentials to busy pet owners who value convenience and safety. Include homepage hero copy, 3 product page examples (title + 100–150 word descriptions), 3 blog topics + intros, 5 SEO keywords, 3 Facebook ad captions, and suggested pricing tiers (starter, core, premium). Tone: helpful, trustworthy, modern."

Expected top-level output (sample excerpt):
- Hero headline: "Smart solutions for happier pets — shop NexCart for easy care and home peace of mind."
- Product example 1: "AutoFeed Pro — smart feeder that schedules meals and tracks portions..." (100–140 words)
- Blog topics: "How smart feeders reduce pet anxiety" — intro paragraph (approx. 75–120 words)
- SEO keywords: "smart pet feeder", "automatic dog feeder UK", "pet camera with treat dispenser", etc.
- Ads: 3 variants focusing on convenience, safety, and bundle savings.
- Pricing tiers: Starter (basic feeder), Core (feeder + camera), Premium (feeder + camera + subscription for consumables)

20) Usage tips
- Provide platform context (Shopify/Next.js/headless) and traffic estimates for best tech recommendations.
- For marketing prompts, include target age, geos, and budget to refine ad copy.
- For dev prompts, ask for the preferred language/framework and authentication pattern.
- Iterate: ask for "shorter", "add urgency", "localize", or "make more premium".
