import { Container, Row, Col } from 'react-bootstrap'

interface ScrollProps {
  children: React.ReactNode
  footer?: React.ReactNode
  scrollable?: boolean
}

export function Scroll({ children, footer, scrollable }: ScrollProps) {
  return (
    <div className={`d-flex flex-column scroll-shadow ${scrollable ? 'scroll-scrollable' : ''}`}>
      <div className="scroll-mount scroll-mount-top bg-kq-mount" />
      <div className={`scroll-body flex-grow-1 p-4 ${scrollable ? 'overflow-auto' : ''}`}>
        {children}
      </div>
      {footer && (
        <div className="scroll-body px-4 pb-4">
          {footer}
        </div>
      )}
      <div className="scroll-mount scroll-mount-bottom bg-kq-mount" />
    </div>
  )
}

interface PageLayoutProps {
  children: React.ReactNode
  colProps?: object
  align?: 'center' | 'start'
}

export function PageLayout({ children, colProps = { xs: 12, sm: 9, md: 6, lg: 5, xl: 4 }, align = 'center' }: PageLayoutProps) {
  return (
    <div className={`h-100 d-flex py-4 bg-kq-wall justify-content-center ${align === 'center' ? 'align-items-center' : 'align-items-start'}`}>
      <Container>
        <Row className="justify-content-center">
          <Col {...colProps}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
