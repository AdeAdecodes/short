const API_BASE = import.meta.env.VITE_API_BASE

export const encodeUrl = async (longUrl: string) => {
  const res = await fetch(`${API_BASE}/encode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ longUrl }),
  })

  if (!res.ok) {
    throw new Error('Failed to encode URL')
  }

  return await res.json() // Expected: { shortPath: "abc123" }
}

export const decodeUrl = async (shortUrl: string) => {
  const res = await fetch(`${API_BASE}/decode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shortUrl }),
  })

  if (!res.ok) {
    throw new Error('Failed to decode URL')
  }

  return await res.json() // Expected: { longUrl: "https://originalurl.com" }
}

export const getUrlStats = async (urlPath: string) => {
  const res = await fetch(`${API_BASE}/statistic/${urlPath}`)

  if (!res.ok) {
    throw new Error('Failed to fetch statistics')
  }

  return await res.json() // Expected: { clicks: 100, lastAccessed: "2025-05-06", referrers: ["google.com", "yahoo.com"] }
}

export const getAllUrls = async () => {
  const res = await fetch(`${API_BASE}/list`)

  if (!res.ok) {
    throw new Error('Failed to fetch URLs list')
  }

  return await res.json() // Expected: [{ originalUrl: "https://indicina.co", shortPath: "abc123" }]
}

export const resolveShortUrl = async (urlPath: string) => {
  const res = await fetch(`${API_BASE}/decode?path=${urlPath}`)

  if (!res.ok) {
    throw new Error('Failed to resolve short URL')
  }

  return await res.json() // Expected: { longUrl: "https://originalurl.com" }
}
