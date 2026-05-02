import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import type { DictionaryCategory } from '../data/types'
import { GRADES, GRID_ROWS, cellKey } from '../data/filterConfig'
import './Filter.css'

const EXTRA_CATEGORIES: { key: string; value: DictionaryCategory }[] = [
  { key: 'cat_number',      value: 'number'      },
  { key: 'cat_tournament',  value: 'tournament'  },
  { key: 'cat_terminology', value: 'terminology' },
]

function defaultCells(): Set<string> {
  const s = new Set<string>()
  GRID_ROWS.forEach(r => s.add(cellKey(10, r.key)))
  return s
}

export default function Filter() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [selectedCells, setSelectedCells]   = useState<Set<string>>(defaultCells)
  const [selectedExtras, setSelectedExtras] = useState<DictionaryCategory[]>([])
  const [includeDojokun, setIncludeDojokun] = useState(false)
  const [includeMottoes, setIncludeMottoes] = useState(false)

  function toggleCell(grade: number, rowKey: string) {
    const key = cellKey(grade, rowKey)
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  function toggleColumn(grade: number) {
    const keys = GRID_ROWS.map(r => cellKey(grade, r.key))
    const allOn = keys.every(k => selectedCells.has(k))
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (allOn) keys.forEach(k => next.delete(k))
      else       keys.forEach(k => next.add(k))
      return next
    })
  }

  function toggleRow(rowKey: string) {
    const keys = GRADES.map(g => cellKey(g.value, rowKey))
    const allOn = keys.every(k => selectedCells.has(k))
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (allOn) keys.forEach(k => next.delete(k))
      else       keys.forEach(k => next.add(k))
      return next
    })
  }

  function toggleExtra(value: DictionaryCategory) {
    setSelectedExtras(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    )
  }

  const canStart = selectedCells.size > 0 || selectedExtras.length > 0 || includeDojokun || includeMottoes

  function handleStart() {
    const params = new URLSearchParams({
      cells:   [...selectedCells].join(','),
      extras:  selectedExtras.join(','),
      dojokun: includeDojokun ? '1' : '0',
      mottoes: includeMottoes ? '1' : '0',
    })
    navigate(`/quiz/game?${params}`)
  }

  const techRows  = GRID_ROWS.filter(r => r.section === 'tech')
  const otherRows = GRID_ROWS.filter(r => r.section === 'other')

  return (
    <PageLayout colProps={{ xs: 12, sm: 11, md: 9, lg: 8, xl: 7 }} align="start">
      <Scroll scrollable>
        <Stack gap={4}>

          <div style={{ overflowX: 'auto' }}>
            <table className="filter-grid">
              <thead>
                <tr>
                  <td />
                  {GRADES.map(g => {
                    const allOn = GRID_ROWS.every(r => selectedCells.has(cellKey(g.value, r.key)))
                    return (
                      <th key={g.value}>
                        <button
                          className={`grade-col-btn ${g.beltClass}${allOn ? ' belt-active' : ' belt-unselected'}`}
                          onClick={() => toggleColumn(g.value)}
                          title={g.label}
                        >
                          {g.shortLabel}
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {techRows.map(row => (
                  <tr key={row.key}>
                    <td className="grid-row-label" onClick={() => toggleRow(row.key)}>
                      {t(`filter.cat_${row.key}`)}
                    </td>
                    {GRADES.map(g => {
                      const active = selectedCells.has(cellKey(g.value, row.key))
                      return (
                        <td key={g.value}>
                          <div
                            className={`grid-cell${active ? ' grid-cell--active' : ''}`}
                            onClick={() => toggleCell(g.value, row.key)}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {otherRows.map(row => (
                  <tr key={row.key}>
                    <td className="grid-row-label" onClick={() => toggleRow(row.key)}>
                      {t(`filter.cat_${row.key}`)}
                    </td>
                    {GRADES.map(g => {
                      const active = selectedCells.has(cellKey(g.value, row.key))
                      return (
                        <td key={g.value}>
                          <div
                            className={`grid-cell${active ? ' grid-cell--active' : ''}`}
                            onClick={() => toggleCell(g.value, row.key)}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Section title={t('filter.includeSection')}>
            <div className="d-flex flex-wrap gap-2">
              {EXTRA_CATEGORIES.map(c => (
                <Button key={c.value} size="sm"
                  variant={selectedExtras.includes(c.value) ? 'dark' : 'outline-dark'}
                  onClick={() => toggleExtra(c.value)}
                >
                  {t(`filter.${c.key}`)}
                </Button>
              ))}
              <Button size="sm"
                variant={includeDojokun ? 'dark' : 'outline-dark'}
                onClick={() => setIncludeDojokun(v => !v)}
              >
                {t('filter.dojokun')}
              </Button>
              <Button size="sm"
                variant={includeMottoes ? 'dark' : 'outline-dark'}
                onClick={() => setIncludeMottoes(v => !v)}
              >
                {t('filter.mottos')}
              </Button>
            </div>
          </Section>

        </Stack>
        <Button variant="dark" size="lg" className="w-100 mt-4" disabled={!canStart} onClick={handleStart}>
          {t('filter.start')}
        </Button>
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
