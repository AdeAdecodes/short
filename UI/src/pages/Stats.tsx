import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUrlStats } from '../api/urlService'
import { Container, Card, Spinner, Alert, ListGroup } from 'react-bootstrap'

type Stat = {
  longUrl: string
  shortUrl: string
  createdAt: string
  clicks: number
  lastAccessed: string
  referrers: string[]
  locations: { location: string; count: number }[]
  operatingSystems: { operating_system: string; count: number }[]
  deviceTypes: { device_type: string; count: number }[]
}


const Stats = () => {
  const { urlPath } = useParams()
  const [stat, setStat] = useState<Stat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUrlStats(urlPath!)
        setStat(data)
      } catch (err) {
        setError('Unable to load stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [urlPath])

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
      <h2 className="text-primary mb-4">URL Stats</h2>
      <Card>
        <Card.Body>
          <Card.Title>
            <a href={`/${stat?.shortUrl}`} target="_blank" rel="noreferrer">
              {stat?.shortUrl}
            </a>
          </Card.Title>
          <Card.Text><strong>Original:</strong> {stat?.longUrl}</Card.Text>
          <ListGroup.Item>
  <strong>Visited Locations:</strong>{' '}
  {stat?.locations.length
    ? stat.locations.map(loc => `${loc.location} (${loc.count})`).join(', ')
    : 'None'}
</ListGroup.Item>

<ListGroup.Item>
  <strong>Operating Systems:</strong>{' '}
  {stat?.operatingSystems.length
    ? stat.operatingSystems.map(os => `${os.operating_system} (${os.count})`).join(', ')
    : 'None'}
</ListGroup.Item>

<ListGroup.Item>
  <strong>Device Types:</strong>{' '}
  {stat?.deviceTypes.length
    ? stat.deviceTypes.map(dev => `${dev.device_type} (${dev.count})`).join(', ')
    : 'None'}
</ListGroup.Item>

        </Card.Body>
      </Card>
    </Container>
  )
}

export default Stats
