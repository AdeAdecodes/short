-- Table to store shortened URLs
CREATE TABLE urls (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,            -- The shortened code (slug)
  long_url    TEXT NOT NULL,                   -- Original long URL
  visits      INT DEFAULT 0,                   -- Number of visits to this URL
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Timestamp of URL creation
);

-- Table to store visit logs
CREATE TABLE visits (
  id            BIGSERIAL PRIMARY KEY,             -- Unique visit ID
  short_url_id  BIGINT NOT NULL REFERENCES urls(id) ON DELETE CASCADE, -- Foreign key to the urls table
  visited_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the visit
  ip            inet NOT NULL,                     -- IP address of the visitor (INET type)
  user_agent    TEXT,                             -- User-Agent string of the visitor
  referrer      TEXT,                             -- Referrer URL
  location      TEXT,                             -- Location derived from the IP (optional, can be fetched via an API)
  device_type   TEXT,                             -- Device type, e.g., mobile, desktop (optional, can be derived from user agent)
  browser       TEXT,                             -- Browser name (optional, can be derived from user agent)
  operating_system TEXT,                         -- Operating system (optional, can be derived from user agent)
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP  -- Timestamp of visit entry
);

-- Index to optimize query performance on visits
CREATE INDEX visits_short_url_id_idx ON visits(short_url_id);

-- Index to improve performance for queries by IP, user-agent, and timestamp
CREATE INDEX visits_ip_user_agent_idx ON visits(ip, user_agent, visited_at);
