import { useEffect, useState } from 'react'
import { getAllUrls } from '../api/urlService'
import { Container, Card, Row, Col, Spinner, Alert, Form, InputGroup, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

type UrlItem = {
  code: string
  longUrl: string
  shortUrl: string
  createdAt: string
  visits: number
}

const List = () => {
  const [urls, setUrls] = useState<UrlItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getAllUrls()
        setUrls(data)
      } catch (err) {
        setError('Failed to fetch URL list')
      } finally {
        setLoading(false)
      }
    }

    fetchUrls()
  }, [])

  const filteredUrls =
    search.length >= 3
      ? urls.filter(url => url.longUrl.toLowerCase().includes(search.toLowerCase()))
      : urls

      if (loading) {
        return (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 9999,
            }}
          >
            <Spinner animation="border" variant="primary" />
            <div style={{ marginTop: '10px', fontSize: '1.2rem', color: '#0065F2' }}>
              Loading<span className="dots">...</span>
            </div>
      
            {/* Animated dots style */}
            <style>{`
              .dots::after {
                content: '';
                display: inline-block;
                animation: dots 1.5s steps(3, end) infinite;
              }
      
              @keyframes dots {
                0% { content: ''; }
                33% { content: '.'; }
                66% { content: '..'; }
                100% { content: '...'; }
              }
            `}</style>
          </div>
        )
      }
      
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <Container className="py-5">
      <h2 className="text-primary mb-3">All Shortened URLs</h2>

      {/* Search */}
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Search by original URL (min 3 characters)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {/* URL Cards */}
      <Row xs={1} md={2} lg={2} className="g-4">
        {filteredUrls.map((url, idx) => (
          <Col key={idx}>
        <Card className="h-100">
          <Card.Body>
            {/* Short URL */}
            <Card.Title className="mb-2">
            <strong className="text-muted small">Short Url:</strong><br />
              <a
                href={`${url.shortUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-primary"
              >
               {url.shortUrl}
              </a>
            </Card.Title>

            {/* Original URL */}
            <Card.Text className="text-break mb-3">
              <strong className="text-muted small">Original:</strong><br />
              <a
                href={url.longUrl}
                target="_blank"
                rel="noreferrer"
                className="small text-muted text-break"
              >
                {url.longUrl}
              </a>
            </Card.Text>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-auto">
              <Link to={`/stats/${url.code}`} className="btn btn-outline-primary btn-sm">
                View Stats
              </Link>
              <div>
                <Badge bg="secondary" className="me-2">
                  {url.visits} visits
                </Badge>
                <span className="text-muted small">
                  {new Date(url.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default List
