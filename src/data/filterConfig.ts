export type GridRow = {
  key: string
  categories: string[]
  section: 'tech' | 'words' | 'positions' | 'body'
}

export const GRADES: { label: string; shortLabel: string; value: number; beltClass: string }[] = [
  { label: '10 kyu', shortLabel: '10k', value: 10, beltClass: 'belt-10'   },
  { label: '9 kyu',  shortLabel: '9k',  value: 9,  beltClass: 'belt-9'    },
  { label: '8 kyu',  shortLabel: '8k',  value: 8,  beltClass: 'belt-8'    },
  { label: '7 kyu',  shortLabel: '7k',  value: 7,  beltClass: 'belt-7'    },
  { label: '6 kyu',  shortLabel: '6k',  value: 6,  beltClass: 'belt-6'    },
  { label: '5 kyu',  shortLabel: '5k',  value: 5,  beltClass: 'belt-5'    },
  { label: '4 kyu',  shortLabel: '4k',  value: 4,  beltClass: 'belt-4'    },
  { label: '3 kyu',  shortLabel: '3k',  value: 3,  beltClass: 'belt-3'    },
  { label: '2 kyu',  shortLabel: '2k',  value: 2,  beltClass: 'belt-2'    },
  { label: '1 kyu',  shortLabel: '1k',  value: 1,  beltClass: 'belt-1'    },
  { label: '1 dan',  shortLabel: '1d',  value: -1, beltClass: 'belt-dan1' },
]

export const GRID_ROWS: GridRow[] = [
  { key: 'stance',        categories: ['stance'],          section: 'tech'      },
  { key: 'punch',         categories: ['punch'], section: 'tech'      },
  { key: 'block',         categories: ['block'],           section: 'tech'      },
  { key: 'kick',          categories: ['kick'],            section: 'tech'      },
  { key: 'kata',          categories: ['kata'],            section: 'tech'      },
  { key: 'other',         categories: ['breathing', 'kumite'], section: 'tech'  },
  { key: 'words',     categories: ['level', 'action', 'direction', 'modifier'],   section: 'words'     },
  { key: 'positions', categories: ['hand_position', 'foot_position', 'body_part'], section: 'positions' },
]

export const CATEGORY_TO_ROW_KEY: Record<string, string> = Object.fromEntries(
  GRID_ROWS.flatMap(row => row.categories.map(cat => [cat, row.key]))
)

export function cellKey(grade: number, rowKey: string): string {
  return `${grade}|${rowKey}`
}

import techniquesRaw from './techniques.json'
import dictionaryRaw from './dictionary.json'

const allEntries = [
  ...(techniquesRaw as { grade: number; category: string }[]),
  ...(dictionaryRaw  as { grade: number; category: string }[]),
]

export const VALID_CELLS: Set<string> = new Set(
  GRADES.flatMap(g =>
    GRID_ROWS
      .filter(row => allEntries.some(e => e.grade === g.value && row.categories.includes(e.category)))
      .map(row => cellKey(g.value, row.key))
  )
)
