import { useNavigate } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { PageLayout, Scroll } from '../components/Scroll'

export default function Home() {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <Scroll>
        <Stack className="text-center mb-4" gap={1}>
          <h1 className="fw-bold text-kq-ink ls-wide" style={{ fontSize: '2.75rem' }}>KyokuQuiz</h1>
          <p className="text-kq-gold fs-3 mb-0">押忍</p>
        </Stack>
        <Stack gap={3}>
          <Button variant="dark"         size="lg" onClick={() => navigate('/game/filter')}>Journey</Button>
          <Button variant="dark"         size="lg">Quick</Button>
          <Button variant="outline-dark" size="lg">Dictionary</Button>
          <Button variant="outline-dark" size="lg">Theory</Button>
        </Stack>
      </Scroll>
    </PageLayout>
  )
}
