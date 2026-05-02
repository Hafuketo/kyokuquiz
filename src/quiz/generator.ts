import type { DictionaryCategory, Technique, DictionaryEntry } from '../data/types'
import techniquesRaw from '../data/techniques.json'
import dictionaryRaw from '../data/dictionary.json'

const TECH_CATS = new Set(['kick', 'punch', 'block', 'stance', 'kata', 'breathing'])

export type AnyEntry = (Technique | DictionaryEntry) & { _src: 'tech' | 'dict' }

export type Question =
  | { type: 'image_to_name'; imagePath: string; options: AnyEntry[]; correctId: string }
  | { type: 'name_to_image'; nameJapanese: string; nameSwedish: string; nameEnglish: string; options: AnyEntry[]; correctId: string }

export function entryImagePath(entry: AnyEntry): string {
  const folder = entry._src === 'tech' ? 'techniques' : 'dictionary'
  return `/images/${folder}/${entry.image}.png`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct: AnyEntry, pool: AnyEntry[], count = 3): AnyEntry[] {
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

export function generateQuestions(pool: AnyEntry[], count = 10): Question[] {
  const withImages = pool.filter(e => !!e.image)
  if (withImages.length < 4) return []

  const questions: Question[] = []

  for (const correct of shuffle(withImages).slice(0, count)) {
    const distractors = pickDistractors(correct, withImages)
    if (distractors.length < 3) continue

    const options = shuffle([correct, ...distractors])

    if (Math.random() < 0.5) {
      questions.push({
        type: 'image_to_name',
        imagePath: entryImagePath(correct),
        options,
        correctId: correct.id,
      })
    } else {
      questions.push({
        type: 'name_to_image',
        nameJapanese: correct.nameJapanese,
        nameSwedish: (correct as DictionaryEntry).nameSwedish ?? '',
        nameEnglish: correct.nameEnglish,
        options,
        correctId: correct.id,
      })
    }
  }

  return questions
}
