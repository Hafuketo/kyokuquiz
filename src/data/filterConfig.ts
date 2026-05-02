export type GridRow = {
  key: string
  categories: string[]
  section: 'tech' | 'other'
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
  { key: 'kick',          categories: ['kick'],            section: 'tech'  },
  { key: 'punch',         categories: ['punch', 'strike'], section: 'tech'  },
  { key: 'block',         categories: ['block'],           section: 'tech'  },
  { key: 'stance',        categories: ['stance'],          section: 'tech'  },
  { key: 'kata',          categories: ['kata'],            section: 'tech'  },
  { key: 'breathing',     categories: ['breathing'],       section: 'other' },
  { key: 'hand_position', categories: ['hand_position'],   section: 'other' },
  { key: 'foot_position', categories: ['foot_position'],   section: 'other' },
  { key: 'body_part',     categories: ['body_part'],       section: 'other' },
  { key: 'level',         categories: ['level'],           section: 'other' },
  { key: 'direction',     categories: ['direction'],       section: 'other' },
  { key: 'modifier',      categories: ['modifier'],        section: 'other' },
  { key: 'action',        categories: ['action'],          section: 'other' },
]

export function cellKey(grade: number, rowKey: string): string {
  return `${grade}|${rowKey}`
}
