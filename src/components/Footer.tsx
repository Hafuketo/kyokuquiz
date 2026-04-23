import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'

const NAV = [
  { label: 'Journey',    path: '/game/filter' },
  { label: 'Quick',      path: '/quick'        },
  { label: 'Home',       path: '/'             },
  { label: 'Dictionary', path: '/dictionary'   },
  { label: 'Theory',     path: '/theory'       },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="page-footer">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={6}>
            <div className="d-flex gap-2 py-3">
              {NAV.map(({ label, path }) => (
                <Button key={label} size="sm" variant="outline-light" className="flex-grow-1 footer-btn"
                  onClick={() => navigate(path)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
