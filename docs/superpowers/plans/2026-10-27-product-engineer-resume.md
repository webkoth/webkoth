# Senior Product Engineer Resume Implementation Plan

> **For agentic workers:** Execute these content changes inline in the current session. The user approved the resume rewrite and requested matching website changes.

**Goal:** Align the Russian and English CV pages and a compact Russian resume with Senior Product Engineer positioning using documented achievements.

**Architecture:** Keep `app/data/cv.ts` as the source of truth and preserve the current page components. Retain historical job titles and dates, feature three documented projects, and avoid presenting completed employment as current employment. Generate the compact DOCX and PDF from the Russian data.

**Tech Stack:** Next.js 16.3, React 19, TypeScript, python-docx, bundled LibreOffice and Poppler.

## Tasks

- [x] Update RU and EN summary, categorized competencies, experience and three selected projects in `app/data/cv.ts`. Use HubMarket's three-day delivery, Finstock's 17-report reconciliation and the data platform's seven verified indicators. Keep project dates unspecified where unconfirmed.
- [x] Align `app/[lang]/minasarkisyan/layout.tsx`, page section labels, LLM export labels and `components/json-ld-person.tsx` with the new positioning. Remove the unsupported current-employer inference. Preserve canonical conventions. Restore `/en/minasarkisyan` as a narrow redirect exception, explicitly approved by the user; protect other English redirects with seven routing tests.
- [x] Generate a two-page Russian DOCX and PDF under `public/resume/`, with Russian-page download links. Render using the documents skill and inspect every page. Include no example metrics or placeholders.
- [x] Run typecheck, lint, all 351 tests and a production build via `npm run build -- --webpack`. Inspect the Russian page in desktop Chrome and both locales' rendered HTML, metadata and HTTP downloads. Review the final diff without changing unrelated user edits.

## Verification results

- Both CV routes return HTTP 200; the Person schema identifies Senior Product Engineer and does not infer a current employer from historical employment.
- Both downloads return HTTP 200 with correct MIME types and SHA-256 matching the inspected local files. PDF has two pages and selectable text.
- Typecheck, 351 tests, production Webpack build and diff whitespace check pass. Lint has zero errors and one pre-existing unused-variable warning in `marketing/vacancies/analyze-foreign.mjs`.
- Default Turbopack build was blocked by this environment's prohibition on binding its internal port. The default project build configuration is unchanged.
- Mobile visual inspection was not completed: browser automation was unavailable, and the native Chrome window was in use by the user. Existing responsive layout is retained; download links use wrapping flex layout.
- Read-only review found no material issues, including the narrow English-route exception.
- The user approved publishing these changes on 27.10.2026. Publish through the existing main-branch deployment workflow, then verify the public RU/EN routes and both downloads.

## Verification

Content edits do not require implementation-mirroring tests. Existing checks and browser inspection cover rendering; factual review compares numeric claims to the source CV and project documentation. Do not infer broad financial correctness from the selected reconciliation samples.

## Delivery

Report the files, checks and publication state. Do not include unrelated pre-existing changes in a commit or deployment.
