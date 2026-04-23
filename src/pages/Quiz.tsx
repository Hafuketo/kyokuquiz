import { useNavigate, useSearchParams } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'

export default function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Scroll>
        <Stack gap={4} className="text-center">
          <p className="fw-bold mb-0 text-kq-ink fs-4">{t('quiz.soon')}</p>
          <p className="mb-0 text-kq-mid lh-lg">
            {t('quiz.grades')}: {searchParams.get('grades')}<br />
            {t('quiz.categories')}: {searchParams.get('categories')}<br />
            {t('quiz.dojokun')}: {searchParams.get('dojokun') === '1' ? t('quiz.yes') : t('quiz.no')}<br />
            {t('quiz.mottos')}: {searchParams.get('mottoes') === '1' ? t('quiz.yes') : t('quiz.no')}
          </p>
          <Button variant="outline-dark" onClick={() => navigate(-1)}>{t('quiz.back')}</Button>
        </Stack>
      </Scroll>
    </PageLayout>
  )
}
