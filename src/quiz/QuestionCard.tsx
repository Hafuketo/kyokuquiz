import { useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import type { RenderedQuestion, AnyEntry } from './types'
import { entryImagePath } from './types'
import './QuestionCard.css'

interface Props {
  question: RenderedQuestion
  index:    number
  total:    number
  onNext:   (correct: boolean) => void
}

function renderClozeTemplate(template: string): string[] {
  return template.split(/(\{\{blank\}\}|\{\{hide\}\})/)
}

export default function QuestionCard({ question, index, total, onNext }: Props) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const { i18n } = useTranslation()

  const answered  = selectedValue !== null
  const correctValue = question.kind === 'entry' ? question.correct.id : question.correct

  function handleSelect(value: string) {
    if (answered) return
    setSelectedValue(value)
  }

  function optionState(value: string): 'correct' | 'wrong' | 'dim' | 'idle' {
    if (!answered) return 'idle'
    if (value === correctValue) return 'correct'
    if (value === selectedValue) return 'wrong'
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

      {question.kind === 'entry' && question.type === 'image_to_name' && (
        <>
          <div className="text-center">
            <img
              src={entryImagePath(question.correct)}
              alt=""
              className="img-fluid rounded"
              style={{ maxHeight: 220, objectFit: 'contain' }}
            />
          </div>
          <Row className="g-2">
            {question.options.map(entry => (
              <Col xs={6} key={entry.id}>
                <Button
                  className={`w-100 answer-btn answer-btn--${optionState(entry.id)}`}
                  onClick={() => handleSelect(entry.id)}
                >
                  <span className="fw-semibold d-block">{entry.nameJapanese}</span>
                  {answered && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{translation(entry)}</span>}
                </Button>
              </Col>
            ))}
          </Row>
        </>
      )}

      {question.kind === 'entry' && question.type === 'name_to_image' && (
        <>
          <div className="text-center">
            <p className="fw-bold text-kq-ink mb-1" style={{ fontSize: '1.6rem' }}>
              {question.correct.nameJapanese}
            </p>
            {answered && (
              <p className="text-kq-mid mb-0" style={{ fontSize: '0.9rem' }}>
                {translation(question.correct)}
              </p>
            )}
          </div>
          <Row className="g-2">
            {question.options.map(entry => (
              <Col xs={6} key={entry.id}>
                <button
                  className={`answer-img-btn answer-img-btn--${optionState(entry.id)} w-100 p-1 rounded`}
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

      {question.kind === 'entry' && question.type === 'term_to_meaning' && (
        <>
          <div className="text-center">
            <p className="fw-bold text-kq-ink mb-1" style={{ fontSize: '1.6rem' }}>
              {question.correct.nameJapanese}
            </p>
            {question.correct.nameKanji && (
              <p className="text-kq-gold mb-0" style={{ fontSize: '1.1rem' }}>{question.correct.nameKanji}</p>
            )}
            {question.correct.nameHiragana && (
              <p className="text-kq-mid mb-0" style={{ fontSize: '0.85rem' }}>{question.correct.nameHiragana}</p>
            )}
          </div>
          <Row className="g-2">
            {question.options.map(entry => (
              <Col xs={6} key={entry.id}>
                <Button
                  className={`w-100 answer-btn answer-btn--${optionState(entry.id)}`}
                  onClick={() => handleSelect(entry.id)}
                >
                  {translation(entry)}
                </Button>
              </Col>
            ))}
          </Row>
        </>
      )}

      {question.kind === 'cloze' && (
        <>
          <p className="text-kq-ink text-center mb-0" style={{ fontSize: '1.15rem', lineHeight: 1.5 }}>
            {renderClozeTemplate(question.template).map((part, i) => {
              if (part === '{{blank}}') return <span key={i} className="cloze-blank">_____</span>
              if (part === '{{hide}}')  return <span key={i} className="cloze-hidden">▓▓▓▓▓▓</span>
              return part
            })}
          </p>
          <Row className="g-2">
            {question.options.map(word => (
              <Col xs={6} key={word}>
                <Button
                  className={`w-100 answer-btn answer-btn--${optionState(word)}`}
                  onClick={() => handleSelect(word)}
                >
                  {word}
                </Button>
              </Col>
            ))}
          </Row>
        </>
      )}

      {answered && (
        <Button variant="dark" onClick={() => onNext(selectedValue === correctValue)}>
          {index + 1 < total ? 'Nästa →' : 'Resultat'}
        </Button>
      )}
    </div>
  )
}
