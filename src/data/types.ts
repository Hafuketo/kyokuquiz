export type Category = 'kick' | 'punch' | 'strike' | 'block' | 'stance' | 'kata' | 'breathing';

// grade: 10–1 = 10kyu–1kyu, -1 = 1dan, 0 = non-curriculum (dojo kun, sosai mottos)
export interface Technique {
  id: string;
  grade: number;
  category: Category;
  nameJapanese: string;
  nameKanji: string;
  nameHiragana: string;
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
