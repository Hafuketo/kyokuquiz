# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

kyokuquiz — a quiz game for learning Kyokushin karate terminology (techniques, dictionary words, dojo kun, sosai mottos), built with React + TypeScript + Vite. Swedish is the primary language (`lng: 'sv'` in `src/i18n.ts`), English is the fallback.

This `frontend/` directory is one half of a two-repo split (`kyokuquiz/frontend` and `kyokuquiz/backend`). The `old/` directory is a legacy React Native/Expo prototype kept for reference — do not build on it.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck (`tsc -b`) then production build
- `npm run lint` — ESLint over the whole project
- `npm run preview` — preview a production build

There is no test runner configured in this project.

## Architecture

**Data-driven content, not hardcoded questions.** All quiz content lives in JSON under `src/data/`:
- `techniques.json` / `dictionary.json` — the two entry types (`Technique`, `DictionaryEntry` in `src/data/types.ts`), each tagged with a `grade` (10–1 = 10kyu–1kyu descending, `-1` = 1dan, `0` = non-curriculum/universal like dojo kun) and a `category`.
- `questions.json` — pre-generated static questions (`StaticQuestion`), each referencing entry IDs (`correctId`, `answerIds`) rather than embedding content.
- `dojokun.json` / `sosaimottos.json` — precepts (grade `0`).

`src/quiz/loader.ts` is the runtime core: it merges techniques + dictionary into one `ALL_ENTRIES` map (tagging each with `_src: 'tech' | 'dict'` for image path resolution), filters `questions.json` by the grade/category selection passed in from the Filter page, shuffles, and slices answer options down to the chosen difficulty. `entryImagePath()` derives image URLs from `_src` (`/images/techniques/...` vs `/images/dictionary/...`).

**Grade × category grid drives filtering.** `src/data/filterConfig.ts` defines `GRADES` (belt levels) and `GRID_ROWS` (category groupings — e.g. `words` bundles `level/action/direction/modifier`, `positions` bundles `hand_position/foot_position/body_part`). `VALID_CELLS` is precomputed by scanning the JSON data so the UI only offers grade/category combinations that actually have content. `Filter.tsx` builds a `cells` selection from this grid and encodes it into the `Quiz` route as a `cells`/`extras`/`difficulty` query string, which `Quiz.tsx` parses back into the shape `loadQuestions()` expects.

**Routing** (`src/App.tsx`): `/` (Home) → `/quiz/filter` (grade/category picker) → `/quiz/game` (the quiz itself, reads query params) → results. Separately, `/wiki`, `/wiki/:grade`, `/dictionary`, `/about` are reference/browsing pages, not part of the quiz flow.

**i18n**: `src/locales/{sv,en}.ts` are plain TS objects consumed via `react-i18next`. UI copy goes through `t(...)`; the technique/dictionary/question JSON itself carries its own per-language name fields (`nameSwedish`, `nameEnglish`, `nameJapanese`, etc.) rather than going through i18next.

**Styling**: react-bootstrap + a custom theme layer (`kq-*` utility classes, `belt-*` classes for grade coloring) defined in `src/index.css`.
