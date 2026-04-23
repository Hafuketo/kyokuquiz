import { useNavigate, useSearchParams } from 'react-router-dom'
import { Stack, Button } from 'react-bootstrap'
import { PageLayout, Scroll } from '../components/Scroll'

export default function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  return (
    <PageLayout>
      <Scroll>
        <Stack gap={4} className="text-center">
          <p className="fw-bold mb-0 text-kq-ink fs-4">Quiz coming soon</p>
          <p className="mb-0 text-kq-mid lh-lg">
            Grades: {searchParams.get('grades')}<br />
            Categories: {searchParams.get('categories')}<br />
            Dojo kun: {searchParams.get('dojokun') === '1' ? 'yes' : 'no'}<br />
            Mottos: {searchParams.get('mottoes') === '1' ? 'yes' : 'no'}
          </p>
          <Button variant="outline-dark" onClick={() => navigate(-1)}>Back</Button>
        </Stack>
      </Scroll>
    </PageLayout>
  )
}
