import { useState, useEffect } from 'react'
import { encodeUrl } from '../api/urlService'
import {
  Container, Form, Button, Alert, Row, Col,
  InputGroup, Spinner, Card
} from 'react-bootstrap'
import { Link } from 'react-router-dom' // ← for linking to list page

let debounceTimer: any

const Home = () => {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEncode = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    setShortUrl('')
    try {
      const data = await encodeUrl(url)
      setShortUrl(`${data.shortUrl}`)
    } catch (err) {
      setError('Failed to shorten URL')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!url) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      handleEncode()
    }, 2500) // ← Increased debounce to 2.5 seconds

    return () => clearTimeout(debounceTimer)
  }, [url])

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearTimeout(debounceTimer)
    await handleEncode()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url('/image-39.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4 text-center shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '20px' }}>
              {/* Logo text */}
              <h2 className="mb-2 text-primary">
                Shortlink<span style={{ fontSize: '0.7em' }}>✂</span>
              </h2>
              <h6 className="text-muted mb-4">URL SHORTENER</h6>

              {/* Prompt text */}
              <p className="mb-4">Which URL should we shorten?</p>

              {/* Form */}
              <Form onSubmit={handleManualSubmit}>
                <InputGroup>
                  <Form.Control
                    type="url"
                    placeholder="http:// www"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <span style={{ fontSize: '1.2rem' }}>↻</span>
                    )}
                  </Button>
                </InputGroup>
              </Form>

              {/* Results */}
              {shortUrl && (
                <Alert variant="success" className="mt-3">
                  Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {/* Pretty List Page Access */}
              <div className="mt-4">
                <p className="text-muted mb-2">Want to see all your shortened URLs?</p>
                <Link to="/list" className="btn btn-outline-primary btn-sm px-4 rounded-pill shadow-sm">
                  View URL List
                </Link>
              </div>

              <div className="mt-3">
  <p className="text-muted mb-2">Want to integrate programmatically?</p>
  <a href="/api-docs.html" className="btn btn-outline-dark btn-sm px-4 rounded-pill shadow-sm" target="_blank" rel="noopener noreferrer">
    View API Docs
  </a>
</div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Home
