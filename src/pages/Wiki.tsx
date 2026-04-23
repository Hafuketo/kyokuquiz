import { useTranslation } from 'react-i18next'
import { PageLayout, Scroll } from '../components/Scroll'

export default function Wiki() {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Scroll>
        <p className="text-center fw-bold mb-0 text-kq-ink fs-4">{t('wiki.soon')}</p>
      </Scroll>
    </PageLayout>
  )
}
