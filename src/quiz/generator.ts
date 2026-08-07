// Automatic question generation for techniques and dictionary words. buildPool() filters
// techniques.json/dictionary.json down to the grade/category cells the player selected.
// generateQuestions() then picks random entries from that pool, builds distractors from
// same-grade entries first and higher-grade entries as fallback (pickDistractors), and
// assembles each into an EntryQuestion: entries with an image get 'image_to_name' or
// 'name_to_image' (coin flip), entries without one get 'term_to_meaning'. Distractor count
// (and therefore option count) follows the requested difficulty.
import type { DictionaryCategory, Technique, DictionaryEntry } from '../data/types'
import type { AnyEntry, EntryQuestion } from './types'
import { shuffle } from './types'
import techniquesRaw from '../data/techniques.json'
import dictionaryRaw from '../data/dictionary.json'

const TECH_CATS = new Set(['kick', 'punch', 'block', 'stance', 'kata', 'breathing'])

function pickDistractors(correct: AnyEntry, pool: AnyEntry[], count: number): AnyEntry[] {
  const eligible = pool.filter(e => {
    if (e.id === correct.id) return false
    if (correct.grade === -1) return e.grade === -1
    return e.grade >= correct.grade
  })

  const sameGrade = eligible.filter(e => e.grade === correct.grade)
  const rest      = eligible.filter(e => e.grade !== correct.grade)

  return [...shuffle(sameGrade), ...shuffle(rest)].slice(0, count)
}

export function buildPool(params: {
  cells: { grade: number; categories: string[] }[]
  extras: string[]
}): AnyEntry[] {
  const { cells, extras } = params
  const pool: AnyEntry[] = []

  for (const t of techniquesRaw as Technique[]) {
    const cell = cells.find(c => c.grade === t.grade)
    if (cell?.categories.includes(t.category)) {
      pool.push({ ...t, _src: 'tech' as const })
    }
  }

  const selectedGrades = new Set(cells.map(c => c.grade))
  const extraCats = new Set(extras as DictionaryCategory[])

  for (const d of dictionaryRaw as DictionaryEntry[]) {
    const cell = cells.find(c => c.grade === d.grade)
    const inCells  = cell != null && !TECH_CATS.has(d.category) && cell.categories.includes(d.category)
    const inExtras = extraCats.size > 0 && selectedGrades.has(d.grade) && extraCats.has(d.category)

    if (inCells || inExtras) {
      pool.push({ ...d, _src: 'dict' as const })
    }
  }

  return pool
}

export function generateQuestions(pool: AnyEntry[], count: number, difficulty: number): EntryQuestion[] {
  const distractorCount = difficulty - 1
  const questions: EntryQuestion[] = []

  for (const correct of shuffle(pool).slice(0, count)) {
    const distractors = pickDistractors(correct, pool, distractorCount)
    if (distractors.length < distractorCount) continue

    const options = shuffle([correct, ...distractors])
    const type = !correct.image ? 'term_to_meaning' : Math.random() < 0.5 ? 'image_to_name' : 'name_to_image'

    questions.push({
      id:      `gen-${correct.id}`,
      kind:    'entry',
      type,
      correct,
      options,
    })
  }

  return questions
}
