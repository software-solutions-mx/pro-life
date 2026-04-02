# Voices Bringing Hope to Life - Sitemap and Content Blueprint

This document maps all current pages, route aliases, section-level intent, and footer links.
Use it as the source of truth for generating page copy in all supported locales.

## 1) URL and Localization Rules

- Base routing pattern:
  - Default locale: `/...` (Spanish default locale configured as `es`)
  - Localized variant: `/:locale/...` (supported locales: `en`, `es`, `fr`, `pt`)
- Example:
  - Home default: `/`
  - Home English: `/en`
  - Resources French: `/fr/resources`

## 2) Global Elements Present Across the Site

### Header (global)

- Brand lockup (logo + brand name + tagline)
- Main nav links:
  - Home (`/`)
  - About (`/about`)
  - Options (`/options`)
  - Resources (`/resources`)
  - Stories (`/testimonials` alias of stories page)
  - FAQ (`/faq`)
  - Contact (`/contact`)
- Global language selector (flag + language code)
- Global country selector (flag + country)
  - Country preference is stored in local storage and reused across pages
  - Data shown in Options/Resources/Stories/FAQ/Contact depends on this selected country

### Footer (global)

- Mission block
- Quick links block
- Help block (phone if configured)
- Legal links block
- Footer meta links (short legal set)
- Footer disclaimer line

## 3) Page-by-Page Sitemap and Section Intent

## Home Page

- Routes:
  - `/`
  - `/:locale`
- Purpose:
  - Welcome users, reduce panic, and route them to immediate support or exploration paths.
- Sections:
  - Hero:
    - Main reassurance message, trust line, and 2 primary actions.
  - Mission:
    - Short statement of what the organization stands for.
  - Support Paths:
    - 3 cards: parenting, adoption, understanding options.
  - Resource Spotlight:
    - 3 cards: local help, hotlines, emotional support.
  - FAQ Preview:
    - Fast clarity section with top questions + CTA to full FAQ.
  - Final CTA:
    - Closing reassurance with urgent support action.

## About Page

- Route:
  - `/about`
- Purpose:
  - Build trust and explain identity, values, and service posture.
- Sections:
  - About Hero:
    - Positioning statement and 2 action buttons.
  - Mission and Vision Cards:
    - Two concise cards defining organization direction.
  - Values Grid:
    - Multi-card values explanation.
  - Story Panel:
    - Why this work exists and who it serves.
  - Trust Panel:
    - Practical trust framework (confidentiality, practicality, transparency).
  - Closing CTA:
    - Encourage help-seeking next step.

## Options Page

- Route:
  - `/options`
- Purpose:
  - Explain pregnancy-path options clearly without pressure.
- Country behavior:
  - Reads global country selection and shows a loading legend for that country context.
- Sections:
  - Options Hero:
    - Intro + current-country legend + 2 CTAs.
  - Orientation:
    - Framing guidance for how to evaluate options safely.
  - Pathways Grid:
    - Cards for continuing pregnancy, parenting, adoption, understanding abortion.
  - Framework Grid:
    - Educational lens cards (biology, ethics, faith perspective).
  - Commitments Panel:
    - Non-judgment, confidentiality, medical notice commitments.
  - Closing CTA:
    - Move user to hotline support or FAQ.

## Resources Page

- Route:
  - `/resources`
- Purpose:
  - Show country-filtered support resources in a visual list layout.
- Country behavior:
  - Reads global country selection and loads resources for that country.
- Sections:
  - Resources Hero:
    - Intro + current-country legend + 2 CTAs.
  - Resources Gallery Table/List:
    - One row per resource with image, title, description, type, and action link.
    - Resource types: phone, url, address.
  - Closing CTA:
    - Push to immediate support path.

## Stories Listing Page

- Routes:
  - `/stories`
  - `/testimonials` (alias route)
- Purpose:
  - Show hope-centered story cards by country and collect new story submissions.
- Country behavior:
  - Reads global country selection and filters story cards.
- Sections:
  - Stories Hero:
    - Emotional framing, country note, 2 CTAs.
  - Stories Gallery:
    - Card grid (image, title, author, read full story action).
  - Story Submission Experience:
    - Form card (title, author, email, publication preference, story body, consent).
    - Live preview card reflecting typed form values.

## Story Detail Page

- Routes:
  - `/stories/:storyId`
  - `/testimonials/:storyId` (alias route)
- Purpose:
  - Present one full story with context and support next actions.
- Sections:
  - Story Hero:
    - Back to stories, story title, summary, metadata (author/country/date/read time), main image.
  - Story Body:
    - Full narrative paragraphs.
  - Related Actions Aside:
    - Links to resources, contact, and all stories.
- Fallback behavior:
  - Unknown story id renders not-found state.

## FAQ Page

- Route:
  - `/faq`
- Purpose:
  - Provide fast, searchable, category-filtered answers in a dynamic layout.
- Country behavior:
  - Uses global country for context metric display.
- Sections:
  - FAQ Hero:
    - Search input, surprise-question button, category chips, live metrics.
  - Question Rail:
    - Clickable list of filtered questions.
  - Answer Stage:
    - Focused answer panel with context note and action buttons.
  - Empty State:
    - Shown when filters return no results.

## Contact Page

- Route:
  - `/contact`
- Purpose:
  - Allow users to submit contact requests and surface direct support channels.
- Country behavior:
  - Uses global country for submission context.
- Sections:
  - Contact Hero:
    - Intro, country legend, 2 CTAs.
  - Contact Form:
    - Name, email, phone (optional), reason, message.
    - Validation and success/error states.
  - Support Aside:
    - Direct support contact info, response window, and supporting CTAs.

## Utility and Error Pages

- UX State Showcase:
  - Route: `/ux-states`
  - Purpose: internal QA/demo for loading, empty, error, not-found, server-error states.
- Server Error:
  - Route: `/500`
  - Purpose: fail-safe page with retry action.
- Not Found:
  - Route: `*` (catch-all)
  - Purpose: unknown route handling.

## 4) Footer Link Map (Include These in Content Planning)

## Quick Links

- Home -> `/`
- About -> `/about`
- Resources -> `/resources`
- Stories -> `/testimonials`
- FAQ -> `/faq`
- Contact -> `/contact`

## Legal Links

- Privacy Policy -> `/legal/privacy-policy`
- Terms of Use -> `/legal/terms-of-use`
- General Disclaimer -> `/legal/disclaimer`
- Medical Disclaimer -> `/legal/medical-disclaimer`
- Mental Health Crisis Disclaimer -> `/legal/mental-health-crisis-disclaimer`
- Cookie Policy -> `/legal/cookie-policy`

## Footer Meta Links (short legal set)

- Privacy Policy -> `/legal/privacy-policy`
- Terms of Use -> `/legal/terms-of-use`
- General Disclaimer -> `/legal/disclaimer`
- Medical Disclaimer -> `/legal/medical-disclaimer`

## 5) Data-Driven Content Sources (for AI generation scope)

- UI translation source files:
  - `public/locales/en/common.json`
  - `public/locales/es/common.json`
  - `public/locales/fr/common.json`
  - `public/locales/pt/common.json`
- Country list:
  - `src/data/countries.js`
- Resources sample dataset:
  - `src/data/resources/resources.sample.json`
- Stories sample dataset:
  - `src/data/stories/stories.sample.json`
  - Story detail enrichment: `src/data/stories/storyCatalog.js`
- FAQ IDs/categories:
  - `src/data/faq/faqItems.js`

## 6) i18n Key Families to Fill (No hardcoded copy)

Generate/maintain content under these key groups:

- `brand.*`
- `navigation.*`
- `home.*`
- `about.*`
- `optionsPage.*`
- `resourcesPage.*`
- `storiesPage.*`
- `faqPage.*`
- `contactPage.*`
- `footer.*`
- `legal.*`
- `seo.*`
- `errors.*`
- `countries.*`

## 7) Important Route Notes for Content and UX Planning

- `/testimonials` and `/stories` render the same listing page.
- `/testimonials/:storyId` and `/stories/:storyId` render the same detail page.
- Several CTA links reference deeper paths that are not yet explicit router entries:
  - `/resources/hotlines`
  - `/resources/find-local-help`
  - `/resources/emotional-support`
  - `/options/parenting`
  - `/options/adoption`
- Keep content ready for these sub-pages/modules because UI already references them.

