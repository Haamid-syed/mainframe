const ibmdb = require('ibm_db');
require('dotenv').config();

const connStr = process.env.DB2_CONN_STRING;

// Database connection pool
const pool = new ibmdb.Pool();

// Initialize database tables
async function initDb() {
  try {
    const conn = await pool.open(connStr);
    
    // Create users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        account_no VARCHAR(10) NOT NULL UNIQUE,
        balance DECIMAL(15,2) NOT NULL DEFAULT 0.00
      )
    `);

    // Create transactions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        account_no VARCHAR(10) NOT NULL,
        type VARCHAR(10) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        balance_after DECIMAL(15,2) NOT NULL,
        FOREIGN KEY (account_no) REFERENCES users(account_no)
      )
    `);

    await conn.close();
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

// Execute database query
async function executeQuery(query, params = []) {
  let conn;
  try {
    conn = await pool.open(connStr);
    const result = await conn.query(query, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

module.exports = {
  initDb,
  executeQuery
};
