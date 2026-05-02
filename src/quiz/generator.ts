import type { Category, DictionaryCategory, Technique, DictionaryEntry } from '../data/types'
import techniquesRaw from '../data/techniques.json'
import dictionaryRaw from '../data/dictionary.json'

const TECH_CATS = new Set(['kick', 'punch', 'strike', 'block', 'stance', 'kata', 'breathing'])

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
  // Never use entries with a lower grade value (more advanced belt)
  // dan (-1) only pairs with other dan entries
  const eligible = pool.filter(e => {
    if (e.id === correct.id) return false
    if (correct.grade === -1) return e.grade === -1
    return e.grade >= correct.grade
  })

  const sameGrade = eligible.filter(e => e.grade === correct.grade)
  const rest      = eligible.filter(e => e.grade !== correct.grade)

  const shuffledSame = shuffle(sameGrade)
  const shuffledRest = shuffle(rest)

  return [...shuffledSame, ...shuffledRest].slice(0, count)
}

export function buildPool(params: {
  grades: number[]
  categories: string[]
  other: string[]
  extras: string[]
}): AnyEntry[] {
  const { grades, categories, other, extras } = params
  const pool: AnyEntry[] = []

  for (const t of techniquesRaw as Technique[]) {
    if (!grades.includes(t.grade)) continue
    if (categories.includes(t.category) || other.includes(t.category)) {
      pool.push({ ...t, _src: 'tech' as const })
    }
  }

  const dictCats = new Set([
    ...other.filter(c => !TECH_CATS.has(c)),
    ...extras,
  ] as DictionaryCategory[])

  for (const d of dictionaryRaw as DictionaryEntry[]) {
    if (!grades.includes(d.grade)) continue
    if (dictCats.has(d.category)) {
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
