import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { FaMountainSun, FaScroll, FaBookOpen, FaCircleInfo } from 'react-icons/fa6'
import { GiHighKick } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Scroll>
        <Stack className="text-center mb-4" gap={1}>
          <h1 className="fw-bold text-kq-ink ls-wide" style={{ fontSize: '2.75rem' }}>KyokuQuiz</h1>
          <p className="text-kq-gold fs-3 mb-0">押忍</p>
        </Stack>
        <Stack gap={3}>
          <Button variant="dark" size="lg" className="d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/journey')}>
            <FaMountainSun /> {t('home.journey')}
          </Button>
          <Button variant="dark" size="lg" className="d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/quiz/filter')}>
            <GiHighKick /> {t('home.quick')}
          </Button>
          <Button variant="outline-dark" size="lg" className="d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/dictionary')}>
            <FaScroll /> {t('home.dictionary')}
          </Button>
          <Button variant="outline-dark" size="lg" className="d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/wiki')}>
            <FaBookOpen /> {t('home.theory')}
          </Button>
          <Button variant="outline-dark" size="lg" className="d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/about')}>
            <FaCircleInfo /> {t('home.about')}
          </Button>
        </Stack>
      </Scroll>
    </PageLayout>
  )
}
