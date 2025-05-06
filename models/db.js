const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const useInMemory = !process.env.DATABASE_URL || process.env.USE_IN_MEMORY === 'true';

let memoryStore = [];
let visitsStore = [];
let idCounter = 1;

if (!useInMemory) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  module.exports = {
    query: (text, params) => pool.query(text, params),
    isInMemory: false,
  };
} else {
  console.warn('⚠ Using in-memory data store (non-persistent)');

  module.exports = {
    isInMemory: true,
    query: async (text, params) => {
      const cmd = text.toLowerCase().trim();

      // --- SELECT HANDLING ---
      if (cmd.startsWith('select')) {
        // SELECT code FROM urls WHERE long_url = $1
        if (cmd.includes('from urls where long_url = $1')) {
          const url = params[0];
          const rows = memoryStore.filter(entry => entry.long_url === url);
          return { rows };
        }

        // SELECT long_url FROM urls WHERE code = $1
        if (cmd.includes('from urls where code = $1')) {
          const code = params[0];
          const rows = memoryStore.filter(entry => entry.code === code);
          return { rows };
        }

        // SELECT * FROM urls WHERE code = $1
        if (cmd.includes('select * from urls where code = $1')) {
          const code = params[0];
          const rows = memoryStore.filter(entry => entry.code === code);
          return { rows };
        }

        // SELECT id, long_url FROM urls WHERE code = $1
        if (cmd.includes('select id, long_url from urls where code = $1')) {
          const code = params[0];
          const rows = memoryStore
            .filter(entry => entry.code === code)
            .map(({ id, long_url }) => ({ id, long_url }));
          return { rows };
        }

        // SELECT * FROM urls
        if (cmd.includes('from urls')) {
          const rows = [...memoryStore].sort((a, b) =>
            b.created_at?.localeCompare(a.created_at) || 0
          );
          return { rows };
        }

        // SELECT * FROM visits WHERE short_url_id = $1
        if (cmd.includes('from visits where short_url_id = $1')) {
          const urlId = params[0];

          // Aggregation queries
          if (cmd.includes('count(*)') && cmd.includes('max(visited_at)')) {
            const filtered = visitsStore.filter(v => v.short_url_id === urlId);
            const maxDate = filtered.reduce((acc, v) =>
              acc > v.visited_at ? acc : v.visited_at, '');
            return {
              rows: [{
                clicks: filtered.length,
                last_accessed: maxDate || null
              }]
            };
          }

          if (cmd.includes('group by referrer')) {
            const filtered = visitsStore.filter(v =>
              v.short_url_id === urlId &&
              v.referrer &&
              v.referrer !== ''
            );
            const referrerCount = {};
            filtered.forEach(v => {
              referrerCount[v.referrer] = (referrerCount[v.referrer] || 0) + 1;
            });
            const rows = Object.entries(referrerCount)
              .map(([referrer, count]) => ({ referrer, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);
            return { rows };
          }

          if (cmd.includes('group by location')) {
            const filtered = visitsStore.filter(v =>
              v.short_url_id === urlId && v.location
            );
            const locationCount = {};
            filtered.forEach(v => {
              locationCount[v.location] = (locationCount[v.location] || 0) + 1;
            });
            const rows = Object.entries(locationCount)
              .map(([location, count]) => ({ location, count }))
              .sort((a, b) => b.count - a.count);
            return { rows };
          }

          if (cmd.includes('group by operating_system')) {
            const filtered = visitsStore.filter(v =>
              v.short_url_id === urlId && v.operating_system
            );
            const osCount = {};
            filtered.forEach(v => {
              osCount[v.operating_system] = (osCount[v.operating_system] || 0) + 1;
            });
            const rows = Object.entries(osCount)
              .map(([operating_system, count]) => ({ operating_system, count }))
              .sort((a, b) => b.count - a.count);
            return { rows };
          }

          if (cmd.includes('group by device_type')) {
            const filtered = visitsStore.filter(v =>
              v.short_url_id === urlId && v.device_type
            );
            const deviceCount = {};
            filtered.forEach(v => {
              deviceCount[v.device_type] = (deviceCount[v.device_type] || 0) + 1;
            });
            const rows = Object.entries(deviceCount)
              .map(([device_type, count]) => ({ device_type, count }))
              .sort((a, b) => b.count - a.count);
            return { rows };
          }

          return { rows: visitsStore.filter(v => v.short_url_id === urlId) };
        }

        return { rows: [] };
      }

      // --- INSERT HANDLING ---
      if (cmd.startsWith('insert into urls')) {
        const [code, long_url] = params;
        const newEntry = {
          id: idCounter++,
          long_url,
          code,
          created_at: new Date().toISOString(),
          visits: 0,
        };
        memoryStore.push(newEntry);
        return { rows: [newEntry] };
      }

      if (cmd.startsWith('insert into visits')) {
        const [
          short_url_id, ip, user_agent, referrer,
          location, device_type, browser, operating_system
        ] = params;

        const visit = {
          short_url_id,
          ip,
          user_agent,
          referrer,
          location,
          device_type,
          browser,
          operating_system,
          visited_at: new Date().toISOString(),
        };

        visitsStore.push(visit);
        return { rowCount: 1 };
      }

      // --- UPDATE HANDLING ---
      if (cmd.startsWith('update urls set visits =')) {
        const [visits, code] = params;
        memoryStore = memoryStore.map(entry =>
          entry.code === code ? { ...entry, visits } : entry
        );
        return { rowCount: 1 };
      }

      if (cmd.startsWith('update urls set visits = visits + 1 where id = $1')) {
        const [id] = params;
        memoryStore = memoryStore.map(entry =>
          entry.id === id ? { ...entry, visits: entry.visits + 1 } : entry
        );
        return { rowCount: 1 };
      }

      return { rows: [] };
    }
  };
}
