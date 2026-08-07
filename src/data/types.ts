export type Category = 'kick' | 'punch' | 'block' | 'stance' | 'kata' | 'breathing' | 'kumite';

// grade: 10–1 = 10kyu–1kyu, -1 = 1dan, 0 = non-curriculum (dojo kun, sosai mottos)
export interface Technique {
  id: string;
  grade: number;
  category: Category;
  nameJapanese: string;
  nameKanji: string;
  nameHiragana: string;
  nameSwedish: string;
  nameEnglish: string;
  image: string | null;
}

export type DictionaryCategory = 'hand_position' | 'foot_position' | 'body_part' | 'level' | 'direction' | 'modifier' | 'action' | 'terminology' | 'tournament' | 'number';

export interface DictionaryEntry {
  id: string;
  grade: number;
  category: DictionaryCategory;
  nameJapanese: string;
  nameKanji: string;
  nameHiragana: string;
  nameSwedish: string;
  nameEnglish: string;
  image: string | null;
}

export interface Precept {
  id: string;
  grade: 0;
  number: number;
  emoji: string;
  textSwedish: string;
  textEnglish: string;
}

// Hand-authored fill-in-the-blank question, e.g. for dojo kun / sosai mottoes.
// `template` is textSwedish with one word replaced by "{{blank}}" (the graded blank,
// answered from `correctWord` vs `distractors`) and zero or more other occurrences of
// the same word/inflections replaced by "{{hide}}" (statically redacted, not answerable —
// present only so the answer isn't given away by seeing the word elsewhere in the text).
export interface ClozeSource {
  id: string;
  source: 'dojokun' | 'sosaimottos';
  sourceId: string;
  template: string;
  correctWord: string;
  distractors: string[];
}
