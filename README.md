# Mainframe Banking System

A simple mainframe-style banking management system using Node.js, Express, IBM DB2, and Tailwind CSS.

## Prerequisites

- Node.js (v14 or higher)
- IBM DB2 Database (local installation)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure DB2:
   - Ensure DB2 is installed and running locally
   - Create a database named 'banking'
   - Update the `.env` file with your DB2 credentials

4. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Features

- Account creation with initial deposit
- Deposit and withdraw functionality
- Balance inquiry
- Transaction history
- Simple and clean UI using Tailwind CSS

## API Endpoints

- POST `/api/createAccount` - Create a new account
- POST `/api/deposit` - Deposit money
- POST `/api/withdraw` - Withdraw money
- GET `/api/balance/:accountId` - Get account balance
- GET `/api/transactions/:accountId` - Get transaction history

## Project Structure

```
mainframe/
├── public/
│   ├── index.html
│   └── js/
│       └── app.js
├── src/
│   ├── db/
│   │   └── db2.js
│   ├── routes/
│   │   └── accountRoutes.js
│   ├── .env
│   └── server.js
└── package.json
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  account_no VARCHAR(10) NOT NULL UNIQUE,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00
)
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_no VARCHAR(10) NOT NULL,
  type VARCHAR(10) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  balance_after DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (account_no) REFERENCES users(account_no)
)
```

## Error Handling

The application includes basic error handling for:
- Invalid input parameters
- Insufficient funds
- Account not found
- Database connection issues

## Security Notes

This is a basic implementation and does not include:
- Authentication
- Input sanitization
- SSL/TLS
- Rate limiting

Add these security features before using in a production environment.
