import { Container, Row, Col } from 'react-bootstrap'
import './Scroll.css'

interface ScrollProps {
  children: React.ReactNode
  footer?: React.ReactNode
  scrollable?: boolean
}

export function Scroll({ children, footer, scrollable }: ScrollProps) {
  return (
    <div className={`d-flex flex-column ${scrollable ? 'scroll-scrollable' : ''}`}>
      <div className="bg-kq-mount scroll-mount" />
      
      <div className='bg-kq-border flex-grow-1 d-flex flex-column scroll-shadow mx-2'>
        <div className={`scroll-body flex-grow-1 p-4 m-4 ${scrollable ? 'overflow-auto' : ''}`}>
          {children}
        </div>
        {footer && (
          <div className="scroll-body px-4 pb-4">
            {footer}
          </div>
        )}
      </div>
      <div className="bg-kq-mount scroll-mount" />
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
    <div className={`h-100 d-flex py-4 justify-content-center ${align === 'center' ? 'align-items-center' : 'align-items-start'}`}>
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
