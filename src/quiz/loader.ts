// Orchestrates the two question pipelines: entry questions generated on the fly by
// generator.ts (techniques + dictionary words, filtered to the selected grade/category
// cells) and cloze questions hand-authored in ../data/clozeQuestions.json (dojo kun /
// sosai mottoes, gated behind the dojokun/mottoes toggles). Results are merged, shuffled,
// and capped at `count`.
import type { ClozeSource } from '../data/types'
import type { RenderedQuestion, ClozeQuestion } from './types'
import { shuffle } from './types'
import { buildPool, generateQuestions } from './generator'
import clozeRaw from '../data/clozeQuestions.json'

export type { AnyEntry, RenderedQuestion } from './types'
export { entryImagePath } from './types'

function buildClozeQuestions(sources: ClozeSource[], difficulty: number): ClozeQuestion[] {
  const distractorCount = difficulty - 1
  return sources.flatMap(c => {
    const distractors = shuffle(c.distractors).slice(0, distractorCount)
    if (distractors.length < distractorCount) return []

    return [{
      id:       c.id,
      kind:     'cloze' as const,
      sourceId: c.sourceId,
      template: c.template,
      correct:  c.correctWord,
      options:  shuffle([c.correctWord, ...distractors]),
    }]
  })
}

export function loadQuestions(params: {
  cells:      { grade: number; categories: string[] }[]
  extras:     string[]
  difficulty: number
  dojokun?:   boolean
  mottoes?:   boolean
  count?:     number
}): RenderedQuestion[] {
  const { cells, extras, difficulty, dojokun = false, mottoes = false, count = 10 } = params

  const pool = buildPool({ cells, extras })
  const entryQuestions = generateQuestions(pool, count, difficulty)

  const activeClozeSources = (clozeRaw as ClozeSource[]).filter(c =>
    (dojokun && c.source === 'dojokun') || (mottoes && c.source === 'sosaimottos')
  )
  const clozeQuestions = buildClozeQuestions(activeClozeSources, difficulty)

  return shuffle([...entryQuestions, ...clozeQuestions]).slice(0, count)
}
