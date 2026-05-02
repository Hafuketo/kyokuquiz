import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'
import { GRADES } from '../data/filterConfig'

export default function Techniques() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <PageLayout align="start">
      <Scroll>
        <Stack gap={3}>
          <h2 className="fw-bold text-kq-ink ls-wide mb-2">{t('techniques.title')}</h2>
          {GRADES.map(g => (
            <Button key={g.value} size="lg"
              className={`${g.beltClass} belt-active d-flex align-items-center justify-content-start gap-3`}
              onClick={() => navigate(`/techniques/${g.value}`)}
            >
              {g.label}
            </Button>
          ))}
        </Stack>
      </Scroll>
    </PageLayout>
  )
}
