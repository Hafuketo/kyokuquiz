import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Stack, Button, ListGroup, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import type { Category, Technique } from '../data/types'
import techniquesRaw from '../data/techniques.json'
import { GRADES, CATEGORY_TO_ROW_KEY } from '../data/filterConfig'

const CATEGORY_ORDER: Category[] = ['stance', 'punch', 'strike', 'block', 'kick', 'kata', 'breathing', 'kumite']

export default function TechniquesGrade() {
  const { grade: gradeParam } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState<Technique | null>(null)

  const grade = Number(gradeParam)
  const gradeInfo = GRADES.find(g => g.value === grade)

  const grouped = useMemo(() => {
    const result: Partial<Record<Category, Technique[]>> = {}
    for (const tech of techniquesRaw as Technique[]) {
      if (tech.grade !== grade) continue
      if (!result[tech.category]) result[tech.category] = []
      result[tech.category]!.push(tech)
    }
    return result
  }, [grade])

  const translation = (t: Technique) =>
    i18n.language === 'sv' ? t.nameSwedish : t.nameEnglish

  return (
    <PageLayout align="start" colProps={{ xs: 12, sm: 10, md: 8, lg: 7, xl: 6 }}>
      <Scroll scrollable>
        <Stack gap={4}>
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-dark" size="sm" onClick={() => navigate('/wiki')}>
              ←
            </Button>
            <h2 className="fw-bold text-kq-ink ls-wide mb-0">
              {gradeInfo?.label ?? grade}
            </h2>
            {gradeInfo && (
              <span className={`${gradeInfo.beltClass} belt-active px-3 py-1 rounded`}
                style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                {gradeInfo.shortLabel}
              </span>
            )}
          </div>

          {CATEGORY_ORDER.map(cat => {
            const items = grouped[cat]
            if (!items?.length) return null
            return (
              <div key={cat}>
                <p className="mb-2 text-uppercase fw-semibold text-kq-mid fs-xs ls-label">
                  {t(`filter.cat_${CATEGORY_TO_ROW_KEY[cat] ?? cat}`)}
                </p>
                <ListGroup variant="flush">
                  {items.map(tech => (
                    <ListGroup.Item key={tech.id} action
                      className="d-flex justify-content-between align-items-center px-0"
                      onClick={() => setSelected(tech)}
                    >
                      <span className="fw-semibold text-kq-ink">{tech.nameJapanese}</span>
                      <span className="text-kq-mid text-end ms-3" style={{ fontSize: '0.9rem' }}>
                        {translation(tech)}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )
          })}
        </Stack>
      </Scroll>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        {selected && (
          <TechDetail tech={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
    </PageLayout>
  )
}

function TechDetail({ tech, onClose }: { tech: Technique; onClose: () => void }) {
  const [imgFailed, setImgFailed] = useState(false)
  const { t, i18n } = useTranslation()

  return (
    <>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-kq-ink">
          {tech.nameJapanese}
          {tech.nameKanji && (
            <span className="text-kq-gold ms-2 fs-5 fw-normal">{tech.nameKanji}</span>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {tech.image && !imgFailed && (
          <img
            src={`/images/techniques/${tech.image}.png`}
            alt={tech.nameEnglish}
            className="img-fluid mb-3 rounded"
            style={{ maxHeight: 220 }}
            onError={() => setImgFailed(true)}
          />
        )}
        <p className="text-kq-mid mb-1" style={{ fontSize: '0.9rem' }}>{tech.nameHiragana}</p>
        <p className="fw-semibold text-kq-ink fs-5 mb-1">
          {i18n.language === 'sv' ? tech.nameSwedish : tech.nameEnglish}
        </p>
        <p className="text-kq-mid mb-0" style={{ fontSize: '0.9rem' }}>
          {i18n.language === 'sv' ? tech.nameEnglish : tech.nameSwedish}
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pt-0">
        <Button variant="outline-dark" onClick={onClose}>{t('dictionary.close')}</Button>
      </Modal.Footer>
    </>
  )
}
