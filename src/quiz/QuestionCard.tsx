import { useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import type { Question, AnyEntry } from './generator'
import { entryImagePath } from './generator'

interface Props {
  question: Question
  index: number
  total: number
  onNext: (correct: boolean) => void
}

export default function QuestionCard({ question, index, total, onNext }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { i18n } = useTranslation()

  const answered  = selectedId !== null
  const correctId = question.correctId

  function handleSelect(id: string) {
    if (answered) return
    setSelectedId(id)
  }

  function optionState(entry: AnyEntry): 'correct' | 'wrong' | 'dim' | 'idle' {
    if (!answered) return 'idle'
    if (entry.id === correctId) return 'correct'
    if (entry.id === selectedId) return 'wrong'
    return 'dim'
  }

  const translation = (entry: AnyEntry) =>
    i18n.language === 'sv'
      ? ((entry as { nameSwedish?: string }).nameSwedish ?? entry.nameEnglish)
      : entry.nameEnglish

  return (
    <div className="d-flex flex-column gap-4">
      <p className="text-kq-mid fs-xs ls-label text-uppercase mb-0">
        {index + 1} / {total}
      </p>

      {question.type === 'image_to_name' ? (
        <>
          <div className="text-center">
            <img
              src={question.imagePath}
              alt=""
              className="img-fluid rounded"
              style={{ maxHeight: 220, objectFit: 'contain' }}
            />
          </div>
          <Row className="g-2">
            {question.options.map(entry => (
              <Col xs={6} key={entry.id}>
                <Button
                  className={`w-100 answer-btn answer-btn--${optionState(entry)}`}
                  onClick={() => handleSelect(entry.id)}
                >
                  <span className="fw-semibold d-block">{entry.nameJapanese}</span>
                  {answered && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{translation(entry)}</span>}
                </Button>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>
          <div className="text-center">
            <p className="fw-bold text-kq-ink mb-1" style={{ fontSize: '1.6rem' }}>
              {question.nameJapanese}
            </p>
            {answered && (
              <p className="text-kq-mid mb-0" style={{ fontSize: '0.9rem' }}>
                {i18n.language === 'sv' ? question.nameSwedish || question.nameEnglish : question.nameEnglish}
              </p>
            )}
          </div>
          <Row className="g-2">
            {question.options.map(entry => (
              <Col xs={6} key={entry.id}>
                <button
                  className={`answer-img-btn answer-img-btn--${optionState(entry)} w-100 p-1 rounded`}
                  onClick={() => handleSelect(entry.id)}
                >
                  <img
                    src={entryImagePath(entry)}
                    alt={entry.nameJapanese}
                    className="img-fluid rounded"
                    style={{ maxHeight: 130, objectFit: 'contain' }}
                  />
                </button>
              </Col>
            ))}
          </Row>
        </>
      )}

      {answered && (
        <Button variant="dark" onClick={() => onNext(selectedId === correctId)}>
          {index + 1 < total ? 'Nästa →' : 'Resultat'}
        </Button>
      )}
    </div>
  )
}
