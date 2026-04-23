import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FaMountainSun, FaHouse, FaScroll, FaBookOpen } from 'react-icons/fa6'
import { GiHighKick } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

export default function Footer() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const NAV = [
    { labelKey: 'nav.journey',    path: '/journey',     icon: <FaMountainSun size={24} /> },
    { labelKey: 'nav.quick',      path: '/quiz/filter', icon: <GiHighKick    size={24} /> },
    { labelKey: 'nav.home',       path: '/',            icon: <FaHouse       size={24} /> },
    { labelKey: 'nav.dictionary', path: '/dictionary',  icon: <FaScroll      size={24} /> },
    { labelKey: 'nav.theory',     path: '/wiki',        icon: <FaBookOpen    size={24} /> },
  ]

  const otherLang = i18n.language === 'sv' ? 'en' : 'sv'

  return (
    <footer className="page-footer">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={6}>
            <div className="d-flex gap-1 py-2">
              {NAV.map(({ labelKey, path, icon }) => (
                <Button key={labelKey} variant="outline-light" className="flex-grow-1 footer-btn d-flex flex-column align-items-center py-2 gap-1"
                  onClick={() => navigate(path)}
                >
                  {icon}
                  <span className="fs-xs">{t(labelKey)}</span>
                </Button>
              ))}
              <Button variant="outline-light" className="footer-btn d-flex flex-column align-items-center py-2 px-2 gap-1"
                onClick={() => i18n.changeLanguage(otherLang)}
                style={{ minWidth: 44 }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{otherLang === 'en' ? '🇬🇧' : '🇸🇪'}</span>
                <span className="fs-xs">{otherLang.toUpperCase()}</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
