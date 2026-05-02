import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { FaHashtag, FaTrophy, FaBookOpen, FaScroll, FaMountainSun,
         FaShield, FaPerson, FaDragon, FaWind, FaHand, FaShoePrints,
         FaCircleDot, FaArrowsUpDown, FaCompass, FaSliders, FaBolt } from 'react-icons/fa6'
import { GiHighKick, GiHighPunch } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import type { DictionaryCategory } from '../data/types'
import { GRADES, GRID_ROWS, cellKey, VALID_CELLS } from '../data/filterConfig'
import './Filter.css'

const EXTRA_CATEGORIES: { key: string; value: DictionaryCategory; icon: React.ReactNode }[] = [
  { key: 'cat_number',      value: 'number',      icon: <FaHashtag /> },
  { key: 'cat_tournament',  value: 'tournament',  icon: <FaTrophy />  },
  { key: 'cat_terminology', value: 'terminology', icon: <FaBookOpen /> },
]

const ROW_ICONS: Partial<Record<string, React.ReactNode>> = {
  kick:          <GiHighKick    size={14} />,
  punch:         <GiHighPunch  size={14} />,
  block:         <FaShield      size={12} />,
  stance:        <FaPerson      size={12} />,
  kata:          <FaDragon      size={12} />,
  breathing:     <FaWind        size={12} />,
  hand_position: <FaHand        size={12} />,
  foot_position: <FaShoePrints  size={12} />,
  body_part:     <FaCircleDot   size={12} />,
  level:         <FaArrowsUpDown size={12} />,
  direction:     <FaCompass     size={12} />,
  modifier:      <FaSliders     size={12} />,
  action:        <FaBolt        size={12} />,
}

function defaultCells(): Set<string> {
  const s = new Set<string>()
  GRID_ROWS.forEach(r => {
    const key = cellKey(10, r.key)
    if (VALID_CELLS.has(key)) s.add(key)
  })
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
    if (!VALID_CELLS.has(key)) return
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  function toggleColumn(grade: number) {
    const keys = GRID_ROWS.map(r => cellKey(grade, r.key)).filter(k => VALID_CELLS.has(k))
    const allOn = keys.every(k => selectedCells.has(k))
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (allOn) keys.forEach(k => next.delete(k))
      else       keys.forEach(k => next.add(k))
      return next
    })
  }

  function toggleRow(rowKey: string) {
    const keys = GRADES.map(g => cellKey(g.value, rowKey)).filter(k => VALID_CELLS.has(k))
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

  const sections: { key: string; labelKey: string; rows: typeof GRID_ROWS }[] = [
    { key: 'tech',      labelKey: 'filter.techSection',      rows: GRID_ROWS.filter(r => r.section === 'tech')      },
    { key: 'words',     labelKey: 'filter.wordsSection',     rows: GRID_ROWS.filter(r => r.section === 'words')     },
    { key: 'positions', labelKey: 'filter.positionsSection', rows: GRID_ROWS.filter(r => r.section === 'positions') },
    { key: 'body',      labelKey: 'filter.bodySection',      rows: GRID_ROWS.filter(r => r.section === 'body')      },
  ]

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
                      <th key={g.value} className="grade-col-header">
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
                {sections.map(section => (
                  <React.Fragment key={section.key}>
                    <tr>
                      <td colSpan={GRADES.length + 1} className="grid-section-label">
                        {t(section.labelKey)}
                      </td>
                    </tr>
                    {section.rows.map(row => (
                      <tr key={row.key}>
                        <td className="grid-row-label" onClick={() => toggleRow(row.key)}
                          title={ROW_ICONS[row.key] ? t(`filter.cat_${row.key}`) : undefined}>
                          {ROW_ICONS[row.key] ?? t(`filter.cat_${row.key}`)}
                        </td>
                        {GRADES.map(g => {
                          const key    = cellKey(g.value, row.key)
                          const valid  = VALID_CELLS.has(key)
                          const active = valid && selectedCells.has(key)
                          return (
                            <td key={g.value}>
                              <div
                                className={`grid-cell${active ? ' grid-cell--active' : ''}${!valid ? ' grid-cell--disabled' : ''}`}
                                onClick={() => toggleCell(g.value, row.key)}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {EXTRA_CATEGORIES.map(c => (
              <Button key={c.value} size="sm" className="d-flex align-items-center gap-2"
                variant={selectedExtras.includes(c.value) ? 'dark' : 'outline-dark'}
                onClick={() => toggleExtra(c.value)}
              >
                {c.icon}
                {t(`filter.${c.key}`)}
              </Button>
            ))}
            <Button size="sm" className="d-flex align-items-center gap-2"
              variant={includeDojokun ? 'dark' : 'outline-dark'}
              onClick={() => setIncludeDojokun(v => !v)}
            >
              <FaScroll />
              {t('filter.dojokun')}
            </Button>
            <Button size="sm" className="d-flex align-items-center gap-2"
              variant={includeMottoes ? 'dark' : 'outline-dark'}
              onClick={() => setIncludeMottoes(v => !v)}
            >
              <FaMountainSun />
              {t('filter.mottos')}
            </Button>
          </div>

        </Stack>
        <Button variant="dark" size="lg" className="w-100 mt-4" disabled={!canStart} onClick={handleStart}>
          {t('filter.start')}
        </Button>
      </Scroll>
    </PageLayout>
  )
}