import { useState, useMemo } from 'react'
import { ListGroup, Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import type { DictionaryCategory, DictionaryEntry } from '../data/types'
import data from '../data/dictionary.json'

const CATEGORY_ORDER: DictionaryCategory[] = [
  'hand_position', 'foot_position', 'body_part',
  'level', 'direction', 'modifier',
  'action', 'terminology', 'tournament', 'number',
]

export default function Dictionary() {
  const [selected, setSelected] = useState<DictionaryEntry | null>(null)
  const { t, i18n } = useTranslation()

  const grouped = useMemo(() => {
    const result: Partial<Record<DictionaryCategory, DictionaryEntry[]>> = {}
    for (const entry of data as DictionaryEntry[]) {
      if (!result[entry.category]) result[entry.category] = []
      result[entry.category]!.push(entry)
    }
    return result
  }, [])

  const translation = (entry: DictionaryEntry) =>
    i18n.language === 'sv' ? entry.nameSwedish : entry.nameEnglish

  return (
    <PageLayout align="start" colProps={{ xs: 12, sm: 10, md: 8, lg: 7, xl: 6 }}>
      <Scroll scrollable>
        <h2 className="fw-bold text-kq-ink ls-wide mb-4">{t('dictionary.title')}</h2>

        {CATEGORY_ORDER.map(cat => {
          const items = grouped[cat]
          if (!items?.length) return null
          return (
            <div key={cat} className="mb-4">
              <p className="mb-2 text-uppercase fw-semibold text-kq-mid fs-xs ls-label">
                {t(`dictionary.cat_${cat}`)}
              </p>
              <ListGroup variant="flush">
                {items.map(entry => (
                  <ListGroup.Item key={entry.id} action
                    className="d-flex justify-content-between align-items-center px-0"
                    onClick={() => setSelected(entry)}
                  >
                    <span className="fw-semibold text-kq-ink">{entry.nameJapanese}</span>
                    <span className="text-kq-mid text-end ms-3" style={{ fontSize: '0.9rem' }}>
                      {translation(entry)}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )
        })}
      </Scroll>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        {selected && (
          <EntryDetail key={selected.id} entry={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
    </PageLayout>
  )
}

function EntryDetail({ entry, onClose }: { entry: DictionaryEntry; onClose: () => void }) {
  const [imgFailed, setImgFailed] = useState(false)
  const { t, i18n } = useTranslation()

  return (
    <>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-kq-ink">
          {entry.nameJapanese}
          {entry.nameKanji && (
            <span className="text-kq-gold ms-2 fs-5 fw-normal">{entry.nameKanji}</span>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {entry.image && !imgFailed && (
          <img
            src={`/images/dictionary/${entry.image}.png`}
            alt={entry.nameEnglish}
            className="img-fluid mb-3 rounded"
            style={{ maxHeight: 220 }}
            onError={() => setImgFailed(true)}
          />
        )}
        <p className="text-kq-mid mb-1" style={{ fontSize: '0.9rem' }}>{entry.nameHiragana}</p>
        <p className="fw-semibold text-kq-ink fs-5 mb-1">
          {i18n.language === 'sv' ? entry.nameSwedish : entry.nameEnglish}
        </p>
        <p className="text-kq-mid mb-0" style={{ fontSize: '0.9rem' }}>
          {i18n.language === 'sv' ? entry.nameEnglish : entry.nameSwedish}
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pt-0">
        <Button variant="outline-dark" onClick={onClose}>{t('dictionary.close')}</Button>
      </Modal.Footer>
    </>
  )
}
