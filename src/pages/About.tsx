import { Stack } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'

export default function About() {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Scroll>
        <Stack gap={3}>
          <div className="text-center">
            <h2 className="fw-bold text-kq-ink ls-wide">{t('about.title')}</h2>
            <p className="text-kq-gold fs-4 mb-0">押忍</p>
          </div>
          <p className="text-kq-ink mb-0">{t('about.desc1')}</p>
          <p className="text-kq-ink mb-0">{t('about.desc2')}</p>
          <hr className="border-kq-border" />
          <p className="text-kq-mid fs-xs mb-0">{t('about.footer')}</p>
        </Stack>
      </Scroll>
    </PageLayout>
  )
}
