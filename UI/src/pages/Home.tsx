import { useState, useEffect } from 'react'
import { encodeUrl, decodeUrl } from '../api/urlService'
import {
  Container, Form, Button, Alert, Row, Col,
  InputGroup, Spinner, Card, Tab, Nav
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

let debounceTimer: any

const Home = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidHttpUrl = (input: string) => {
    try {
      const url = new URL(input)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  const handleRequest = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    setResult('')

    try {
      if (mode === 'encode') {
        if (!isValidHttpUrl(url)) throw new Error('Invalid URL: must start with http:// or https://')
        const data = await encodeUrl(url)
        setResult(data.shortUrl)
      } else {
        const data = await decodeUrl(url)
        setResult(data.longUrl)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process URL')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!url) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      handleRequest()
    }, 2500)

    return () => clearTimeout(debounceTimer)
  }, [url, mode])

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearTimeout(debounceTimer)
    await handleRequest()
  }

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode)
    setUrl('')
    setResult('')
    setError('')
    clearTimeout(debounceTimer)
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
              <h2 className="mb-2 text-primary">
                Shortlink<span style={{ fontSize: '0.7em' }}>✂</span>
              </h2>
              <h6 className="text-muted mb-4">URL SHORTENER</h6>

              <Tab.Container activeKey={mode} onSelect={(k) => handleModeChange(k as 'encode' | 'decode')}>
                <Nav variant="tabs" className="justify-content-center mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="encode">Shorten</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="decode">Decode</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Form onSubmit={handleManualSubmit}>
                  <InputGroup>
                    <Form.Control
                      type="url"
                      placeholder={mode === 'encode' ? 'http:// www...' : 'https://short.af4u/abc123'}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : <span style={{ fontSize: '1.2rem' }}>↻</span>}
                    </Button>
                  </InputGroup>
                </Form>
              </Tab.Container>

              {result && (
                <Alert variant="success" className="mt-3">
                  {mode === 'encode' ? (
                    <>Short URL: <a href={result} target="_blank" rel="noreferrer">{result}</a></>
                  ) : (
                    <>Original URL: <a href={result} target="_blank" rel="noreferrer">{result}</a></>
                  )}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

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
