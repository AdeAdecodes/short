import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resolveShortUrl } from '../api/urlService'
import { Spinner, Container, Alert } from 'react-bootstrap'

const RedirectHandler = () => {
  const { urlPath } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const resolve = async () => {
      try {
        const data = await resolveShortUrl(urlPath!)
        window.location.href = data.originalUrl
      } catch (err) {
        console.error('Redirection failed:', err)
        setTimeout(() => navigate('/'), 3000)
      }
    }

    resolve()
  }, [urlPath, navigate])

  return (
    <Container className="text-center py-5">
      <h5 className="text-primary">Redirecting...</h5>
      <Spinner animation="border" className="mt-3" />
      <Alert variant="light" className="mt-3">
        If you are not redirected, <a href="/">click here</a>.
      </Alert>
    </Container>
  )
}

export default RedirectHandler
