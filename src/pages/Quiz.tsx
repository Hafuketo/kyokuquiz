import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import QuestionCard from '../quiz/QuestionCard'
import { buildPool, generateQuestions } from '../quiz/generator'
import { GRID_ROWS } from '../data/filterConfig'

export default function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const questions = useMemo(() => {
    const cellsParam = searchParams.get('cells')?.split(',').filter(Boolean) ?? []
    const extras     = searchParams.get('extras')?.split(',').filter(Boolean) ?? []

    const gradeMap = new Map<number, string[]>()
    for (const key of cellsParam) {
      const [gradeStr, rowKey] = key.split('|')
      const grade = Number(gradeStr)
      const row = GRID_ROWS.find(r => r.key === rowKey)
      if (!row || isNaN(grade)) continue
      if (!gradeMap.has(grade)) gradeMap.set(grade, [])
      gradeMap.get(grade)!.push(...row.categories)
    }
    const cells = [...gradeMap.entries()].map(([grade, categories]) => ({ grade, categories }))

    const pool = buildPool({ cells, extras })
    return generateQuestions(pool, 10)
  }, [searchParams])

  const [index, setIndex]   = useState(0)
  const [score, setScore]   = useState(0)
  const [done, setDone]     = useState(false)

  function handleNext(correct: boolean) {
    const nextScore = correct ? score + 1 : score
    if (index + 1 >= questions.length) {
      setScore(nextScore)
      setDone(true)
    } else {
      setScore(nextScore)
      setIndex(i => i + 1)
    }
  }

  if (questions.length === 0) {
    return (
      <PageLayout>
        <Scroll>
          <Stack gap={4} className="text-center">
            <p className="fw-bold mb-0 text-kq-ink fs-5">Inga frågor tillgängliga</p>
            <p className="text-kq-mid mb-0" style={{ fontSize: '0.9rem' }}>
              Det finns inga bilder för den valda kombinationen av grad och kategorier.
            </p>
            <Button variant="outline-dark" onClick={() => navigate(-1)}>{t('quiz.back')}</Button>
          </Stack>
        </Scroll>
      </PageLayout>
    )
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <PageLayout>
        <Scroll>
          <Stack gap={4} className="text-center">
            <div>
              <p className="text-kq-gold fs-3 mb-1">押忍</p>
              <h2 className="fw-bold text-kq-ink ls-wide">Resultat</h2>
            </div>
            <p className="text-kq-ink mb-0" style={{ fontSize: '3rem', fontWeight: 700 }}>
              {score}/{questions.length}
            </p>
            <p className="text-kq-mid mb-0">{pct}% rätt</p>
            <Stack gap={2}>
              <Button variant="dark" onClick={() => { setIndex(0); setScore(0); setDone(false) }}>
                Spela igen
              </Button>
              <Button variant="outline-dark" onClick={() => navigate(-1)}>
                {t('quiz.back')}
              </Button>
            </Stack>
          </Stack>
        </Scroll>
      </PageLayout>
    )
  }

  return (
    <PageLayout colProps={{ xs: 12, sm: 10, md: 7, lg: 6, xl: 5 }} align="start">
      <Scroll>
        <QuestionCard
          key={index}
          question={questions[index]}
          index={index}
          total={questions.length}
          onNext={handleNext}
        />
      </Scroll>
    </PageLayout>
  )
}
