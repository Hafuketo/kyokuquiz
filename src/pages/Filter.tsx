import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { PageLayout, Scroll } from '../components/Scroll'
import type { Category } from '../data/types'

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

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Kick',      value: 'kick'      },
  { label: 'Punch',     value: 'punch'     },
  { label: 'Strike',    value: 'strike'    },
  { label: 'Block',     value: 'block'     },
  { label: 'Stance',    value: 'stance'    },
  { label: 'Kata',      value: 'kata'      },
  { label: 'Breathing', value: 'breathing' },
]

export default function Filter() {
  const navigate = useNavigate()

  const [selectedGrades, setSelectedGrades] = useState<number[]>(GRADES.map(g => g.value))
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(CATEGORIES.map(c => c.value))
  const [includeDojokun, setIncludeDojokun] = useState(false)
  const [includeMottoes, setIncludeMottoes] = useState(false)

  function selectUpTo(maxGrade: number) {
    setSelectedGrades(GRADES.map(g => g.value).filter(v => v === -1 ? maxGrade === -1 : v >= maxGrade))
  }

  function toggleCategory(value: Category) {
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    )
  }

  const canStart = selectedGrades.length > 0 &&
    (selectedCategories.length > 0 || includeDojokun || includeMottoes)

  function handleStart() {
    const params = new URLSearchParams({
      grades: selectedGrades.join(','),
      categories: selectedCategories.join(','),
      dojokun: includeDojokun ? '1' : '0',
      mottoes: includeMottoes ? '1' : '0',
    })
    navigate(`/game/quiz?${params}`)
  }

  return (
    <PageLayout colProps={{ xs: 12, sm: 10, md: 7, lg: 6, xl: 5 }} align="start">
      <Scroll scrollable footer={
        <Button variant="dark" size="lg" className="w-100" disabled={!canStart} onClick={handleStart}>
          Start
        </Button>
      }>
        <Stack gap={4}>

          <Section title="My grade — select up to">
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

          <Section title="Technique types">
            <div className="d-flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <Button key={c.value} size="sm"
                  variant={selectedCategories.includes(c.value) ? 'warning' : 'outline-secondary'}
                  onClick={() => toggleCategory(c.value)}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </Section>

          <Section title="Also include">
            <Stack gap={2}>
              <ToggleRow emoji="🥋" label="Dojo kun"       active={includeDojokun}  onToggle={() => setIncludeDojokun(v => !v)} />
              <ToggleRow emoji="📜" label="Sosai's mottos"  active={includeMottoes}   onToggle={() => setIncludeMottoes(v => !v)} />
            </Stack>
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

function ToggleRow({ emoji, label, active, onToggle }: { emoji: string; label: string; active: boolean; onToggle: () => void }) {
  return (
    <Button
      variant={active ? 'outline-dark' : 'outline-secondary'}
      className="d-flex align-items-center gap-3 text-start w-100"
      onClick={onToggle}
    >
      <span className="fs-5">{emoji}</span>
      <span className="flex-grow-1">{label}</span>
      <span className="rounded-circle flex-shrink-0" style={{
        width: 18, height: 18, border: '2px solid',
        borderColor: active ? 'var(--kq-ink)' : 'var(--kq-border)',
        backgroundColor: active ? 'var(--kq-ink)' : 'transparent',
      }} />
    </Button>
  )
}
