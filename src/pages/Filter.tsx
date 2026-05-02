import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import type { Category, DictionaryCategory } from '../data/types'

const GRADES: { label: string; value: number }[] = [
  { label: '10 kyu', value: 10 },
  { label: '9 kyu',  value: 9  },
  { label: '8 kyu',  value: 8  },
  { label: '7 kyu',  value: 7  },
  { label: '6 kyu',  value: 6  },
  { label: '5 kyu',  value: 5  },
  { label: '4 kyu',  value: 4  },
  { label: '3 kyu',  value: 3  },
  { label: '2 kyu',  value: 2  },
  { label: '1 kyu',  value: 1  },
  { label: '1 dan',  value: -1 },
]

const TECH_CATEGORIES: { key: string; values: Category[] }[] = [
  { key: 'cat_kick',   values: ['kick']             },
  { key: 'cat_punch',  values: ['punch', 'strike']  },
  { key: 'cat_block',  values: ['block']             },
  { key: 'cat_stance', values: ['stance']            },
  { key: 'cat_kata',   values: ['kata']              },
]

const OTHER_CATEGORIES: { key: string; value: Category | DictionaryCategory }[] = [
  { key: 'cat_breathing',     value: 'breathing'     },
  { key: 'cat_hand_position', value: 'hand_position' },
  { key: 'cat_foot_position', value: 'foot_position' },
  { key: 'cat_body_part',     value: 'body_part'     },
  { key: 'cat_level',         value: 'level'         },
  { key: 'cat_direction',     value: 'direction'     },
  { key: 'cat_modifier',      value: 'modifier'      },
  { key: 'cat_action',        value: 'action'        },
]

const EXTRA_CATEGORIES: { key: string; value: DictionaryCategory }[] = [
  { key: 'cat_number',      value: 'number'      },
  { key: 'cat_tournament',  value: 'tournament'  },
  { key: 'cat_terminology', value: 'terminology' },
]

export default function Filter() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [selectedGrades, setSelectedGrades] = useState<number[]>([10])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(TECH_CATEGORIES.flatMap(c => c.values))
  const [selectedOther, setSelectedOther] = useState<(Category | DictionaryCategory)[]>(OTHER_CATEGORIES.map(c => c.value))
  const [selectedExtras, setSelectedExtras] = useState<DictionaryCategory[]>([])
  const [includeDojokun, setIncludeDojokun] = useState(false)
  const [includeMottoes, setIncludeMottoes] = useState(false)

  function selectUpTo(maxGrade: number) {
    setSelectedGrades(GRADES.map(g => g.value).filter(v => v === -1 ? maxGrade === -1 : v >= maxGrade))
  }

  function toggleCategory(values: Category[]) {
    const allSelected = values.every(v => selectedCategories.includes(v))
    setSelectedCategories(prev =>
      allSelected ? prev.filter(c => !values.includes(c)) : [...prev, ...values.filter(v => !prev.includes(v))]
    )
  }

  function toggleOther(value: Category | DictionaryCategory) {
    setSelectedOther(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    )
  }

  function toggleExtra(value: DictionaryCategory) {
    setSelectedExtras(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    )
  }

  const canStart = selectedGrades.length > 0 && (
    selectedCategories.length > 0 || selectedOther.length > 0 ||
    selectedExtras.length > 0 || includeDojokun || includeMottoes
  )

  function handleStart() {
    const params = new URLSearchParams({
      grades:     selectedGrades.join(','),
      categories: selectedCategories.join(','),
      other:      selectedOther.join(','),
      extras:     selectedExtras.join(','),
      dojokun:    includeDojokun ? '1' : '0',
      mottoes:    includeMottoes ? '1' : '0',
    })
    navigate(`/quiz/game?${params}`)
  }

  return (
    <PageLayout colProps={{ xs: 12, sm: 10, md: 7, lg: 6, xl: 5 }} align="start">
      <Scroll scrollable footer={
        <Button variant="dark" size="lg" className="w-100" disabled={!canStart} onClick={handleStart}>
          {t('filter.start')}
        </Button>
      }>
        <Stack gap={4}>

          <Section title={t('filter.gradeSection')}>
            <div className="d-flex flex-wrap gap-2">
              {GRADES.map(g => (
                <Button key={g.value} size="sm"
                  variant={selectedGrades.includes(g.value) ? 'warning' : 'outline-secondary'}
                  onClick={() => selectUpTo(g.value)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
          </Section>

          <Section title={t('filter.techSection')}>
            <div className="d-flex flex-wrap gap-2">
              {TECH_CATEGORIES.map(c => (
                <Button key={c.key} size="sm"
                  variant={c.values.every(v => selectedCategories.includes(v)) ? 'warning' : 'outline-secondary'}
                  onClick={() => toggleCategory(c.values)}
                >
                  {t(`filter.${c.key}`)}
                </Button>
              ))}
            </div>
            <p className="mb-1 mt-3 text-uppercase fw-semibold text-kq-mid fs-xs ls-label">
              {t('filter.otherSection')}
            </p>
            <div className="d-flex flex-wrap gap-2">
              {OTHER_CATEGORIES.map(c => (
                <Button key={c.value} size="sm"
                  variant={selectedOther.includes(c.value) ? 'warning' : 'outline-secondary'}
                  onClick={() => toggleOther(c.value)}
                >
                  {t(`filter.${c.key}`)}
                </Button>
              ))}
            </div>
          </Section>

          <Section title={t('filter.includeSection')}>
            <div className="d-flex flex-wrap gap-2">
              {EXTRA_CATEGORIES.map(c => (
                <Button key={c.value} size="sm"
                  variant={selectedExtras.includes(c.value) ? 'warning' : 'outline-secondary'}
                  onClick={() => toggleExtra(c.value)}
                >
                  {t(`filter.${c.key}`)}
                </Button>
              ))}
              <Button size="sm"
                variant={includeDojokun ? 'warning' : 'outline-secondary'}
                onClick={() => setIncludeDojokun(v => !v)}
              >
                {t('filter.dojokun')}
              </Button>
              <Button size="sm"
                variant={includeMottoes ? 'warning' : 'outline-secondary'}
                onClick={() => setIncludeMottoes(v => !v)}
              >
                {t('filter.mottos')}
              </Button>
            </div>
          </Section>

        </Stack>
      </Scroll>
    </PageLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap={2}>
      <p className="mb-0 text-uppercase fw-semibold text-kq-mid fs-xs ls-label">{title}</p>
      {children}
    </Stack>
  )
}

