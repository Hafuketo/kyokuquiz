import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Button, Modal, ListGroup } from 'react-bootstrap'
import { FaScroll, FaMountainSun, FaUser, FaBook,
         FaDumbbell, FaHandFist, FaOm, FaHandsPraying, FaSeedling, FaScaleBalanced, FaRoute,
         FaHandshake, FaMountain, FaBullseye, FaCoins, FaPerson, FaHourglassHalf, FaEye,
         FaFire, FaCircle, FaBookOpen, FaHeart } from 'react-icons/fa6'
import { MdHistoryEdu } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import type { Precept } from '../data/types'
import dojokun from '../data/dojokun.json'
import mottos from '../data/sosaimottos.json'
import { GRADES } from '../data/filterConfig'

type TopicKey = 'dojokun' | 'mottos' | 'oyama' | 'history'

const PRECEPT_ICONS: Record<string, React.ReactNode> = {
  'dojokun-1': <FaDumbbell />,
  'dojokun-2': <FaHandFist />,
  'dojokun-3': <FaOm />,
  'dojokun-4': <FaHandsPraying />,
  'dojokun-5': <FaSeedling />,
  'dojokun-6': <FaScaleBalanced />,
  'dojokun-7': <FaRoute />,
  'sosai-1':   <FaHandshake />,
  'sosai-2':   <FaMountain />,
  'sosai-3':   <FaBullseye />,
  'sosai-4':   <FaCoins />,
  'sosai-5':   <FaPerson />,
  'sosai-6':   <FaHourglassHalf />,
  'sosai-7':   <FaEye />,
  'sosai-8':   <FaFire />,
  'sosai-9':   <FaCircle />,
  'sosai-10':  <FaBookOpen />,
  'sosai-11':  <FaHeart />,
}

const TOPICS: { key: TopicKey; btnKey: string; icon: React.ReactNode }[] = [
  { key: 'dojokun', btnKey: 'wiki.dojokun_btn', icon: <FaScroll /> },
  { key: 'mottos',  btnKey: 'wiki.mottos_btn',  icon: <FaMountainSun /> },
  { key: 'oyama',   btnKey: 'wiki.oyama_btn',   icon: <FaUser /> },
  { key: 'history', btnKey: 'wiki.history_btn', icon: <MdHistoryEdu /> },
]

export default function Wiki() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState<TopicKey | null>(null)

  return (
    <PageLayout align="start">
      <Scroll>
        <Stack gap={3}>
          <h2 className="fw-bold text-kq-ink ls-wide mb-2">{t('wiki.title')}</h2>

          <p className="mb-0 text-uppercase fw-semibold text-kq-mid fs-xs ls-label">{t('wiki.techniques_btn')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {GRADES.map(g => (
              <Button key={g.value}
                className={`${g.beltClass} belt-active text-uppercase`}
                onClick={() => navigate(`/wiki/${g.value}`)}
              >
                {g.label}
              </Button>
            ))}
          </div>

          {TOPICS.map(({ key, btnKey, icon }) => (
            <Button key={key} variant="outline-dark" size="lg"
              className="d-flex align-items-center justify-content-start gap-3"
              onClick={() => setOpen(key)}
            >
              {icon}
              {t(btnKey)}
            </Button>
          ))}
          <Button variant="outline-dark" size="lg"
            className="d-flex align-items-center justify-content-start gap-3"
            onClick={() => navigate('/dictionary')}
          >
            <FaBook />
            {t('home.dictionary')}
          </Button>
        </Stack>
      </Scroll>

      <Modal show={open === 'dojokun'} onHide={() => setOpen(null)} centered scrollable>
        <PreceptModal
          title={t('wiki.dojokun_btn')}
          items={dojokun as Precept[]}
          lang={i18n.language}
          onClose={() => setOpen(null)}
        />
      </Modal>

      <Modal show={open === 'mottos'} onHide={() => setOpen(null)} centered scrollable>
        <PreceptModal
          title={t('wiki.mottos_btn')}
          items={mottos as Precept[]}
          lang={i18n.language}
          onClose={() => setOpen(null)}
        />
      </Modal>

      <Modal show={open === 'oyama'} onHide={() => setOpen(null)} centered scrollable>
        <TextModal title={t('wiki.oyama_title')} body={t('wiki.oyama_body')} onClose={() => setOpen(null)} />
      </Modal>

      <Modal show={open === 'history'} onHide={() => setOpen(null)} centered scrollable>
        <TextModal title={t('wiki.history_title')} body={t('wiki.history_body')} onClose={() => setOpen(null)} />
      </Modal>
    </PageLayout>
  )
}

function PreceptModal({ title, items, lang, onClose }: {
  title: string
  items: Precept[]
  lang: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-kq-ink">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 pt-2">
        <ListGroup variant="flush">
          {items.map(item => (
            <ListGroup.Item key={item.id} className="px-0 py-3">
              <div className="d-flex gap-3 align-items-start">
                <span className="fs-4 flex-shrink-0 text-kq-gold">{PRECEPT_ICONS[item.id]}</span>
                <div>
                  <p className="mb-1 fw-semibold text-kq-ink lh-sm" style={{ fontSize: '0.95rem' }}>
                    {lang === 'sv' ? item.textSwedish : item.textEnglish}
                  </p>
                  <p className="mb-0 text-kq-mid" style={{ fontSize: '0.8rem' }}>
                    {lang === 'sv' ? item.textEnglish : item.textSwedish}
                  </p>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center pt-0">
        <Button variant="outline-dark" onClick={onClose}>{t('dictionary.close')}</Button>
      </Modal.Footer>
    </>
  )
}

function TextModal({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  const { t } = useTranslation()
  return (
    <>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-kq-ink">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body.split('\n\n').map((para, i) => (
          <p key={i} className="text-kq-ink lh-base" style={{ fontSize: '0.95rem' }}>{para}</p>
        ))}
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center pt-0">
        <Button variant="outline-dark" onClick={onClose}>{t('dictionary.close')}</Button>
      </Modal.Footer>
    </>
  )
}
