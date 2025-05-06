// migration.js
const fs = require('fs');
const path = require('path');
const db = require('../models/db');  // Import db.js for querying

async function runMigration() {
  try {
    // read from a file or define your SQL directly
    const schemaPath = path.join(__dirname, 'schema.sql'); // Assuming the schema is in schema.sql
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8'); // Read the schema file

    // Split SQL queries if there are multiple (by semicolon)
    const queries = schemaSQL.split(';');

    // Run each query
    for (let query of queries) {
      if (query.trim()) {
        await db.query(query);  // Use db.query from db.js to run the migration
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

// Execute migration
runMigration();
