import type { Technique, DictionaryEntry } from '../data/types'

export type AnyEntry = (Technique | DictionaryEntry) & { _src: 'tech' | 'dict' }

// A question built from a Technique/DictionaryEntry (either generated automatically
// by generator.ts, or hand-picked via a StaticQuestion in questions.json).
export type EntryQuestion = {
  id:      string
  kind:    'entry'
  type:    'term_to_meaning' | 'image_to_name' | 'name_to_image'
  correct: AnyEntry
  options: AnyEntry[]
}

// A fill-in-the-blank question built from a ClozeSource in clozeQuestions.json
// (dojo kun, sosai mottoes, and any future hand-authored "pick the missing word" content).
export type ClozeQuestion = {
  id:       string
  kind:     'cloze'
  sourceId: string
  template: string
  options:  string[]
  correct:  string
}

export type RenderedQuestion = EntryQuestion | ClozeQuestion

export function entryImagePath(entry: AnyEntry): string {
  const folder = entry._src === 'tech' ? 'techniques' : 'dictionary'
  return `/images/${folder}/${entry.image}.png`
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
