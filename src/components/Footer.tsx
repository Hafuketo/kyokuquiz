import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FaMountainSun, FaHouse, FaScroll, FaBookOpen } from 'react-icons/fa6'
import { GiHighKick } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

export default function Footer() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const otherLang = i18n.language === 'sv' ? 'en' : 'sv'

  return (
    <footer className="page-footer">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={6}>
            <div className="d-flex gap-1 py-2">

              <Button variant="outline-light" className="flex-grow-1 footer-btn d-flex flex-column align-items-center py-2 gap-1 d-none"
                onClick={() => navigate('/journey')}
              >
                <FaMountainSun size={24} />
                <span className="fs-xs">{t('nav.journey')}</span>
              </Button>

              <Button variant="outline-light" className="flex-grow-1 footer-btn d-flex flex-column align-items-center py-2 gap-1"
                onClick={() => navigate('/quiz/filter')}
              >
                <GiHighKick size={24} />
                <span className="fs-xs">{t('nav.quick')}</span>
              </Button>

              <Button variant="outline-light" className="flex-grow-1 footer-btn d-flex flex-column align-items-center py-2 gap-1"
                onClick={() => navigate('/')}
              >
                <FaHouse size={24} />
                <span className="fs-xs">{t('nav.home')}</span>
              </Button>

              <Button variant="outline-light" className="flex-grow-1 footer-btn d-flex flex-column align-items-center py-2 gap-1"
                onClick={() => navigate('/dictionary')}
              >
                <FaScroll size={24} />
                <span className="fs-xs">{t('nav.dictionary')}</span>
              </Button>

              <Button variant="outline-light" className="flex-grow-1 footer-btn d-flex flex-column align-items-center py-2 gap-1"
                onClick={() => navigate('/wiki')}
              >
                <FaBookOpen size={24} />
                <span className="fs-xs">{t('nav.theory')}</span>
              </Button>

              <Button variant="outline-light" className="footer-btn d-flex flex-column align-items-center py-2 px-2 gap-1"
                onClick={() => i18n.changeLanguage(otherLang)}
                style={{ minWidth: 44 }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{i18n.language === 'en' ? '🇬🇧' : '🇸🇪'}</span>
                <span className="fs-xs">{i18n.language.toUpperCase()}</span>
              </Button>

            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
