const express = require('express');
const router = express.Router();
const db = require('../db/db2');

// Create new account
router.post('/createAccount', async (req, res) => {
  try {
    const { name, accountNo, initialDeposit } = req.body;
    
    if (!name || !accountNo || initialDeposit < 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    await db.executeQuery(
      'INSERT INTO users (name, account_no, balance) VALUES (?, ?, ?)',
      [name, accountNo, initialDeposit]
    );

    if (initialDeposit > 0) {
      await db.executeQuery(
        'INSERT INTO transactions (account_no, type, amount, balance_after) VALUES (?, ?, ?, ?)',
        [accountNo, 'deposit', initialDeposit, initialDeposit]
      );
    }

    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deposit money
router.post('/deposit', async (req, res) => {
  try {
    const { accountNo, amount } = req.body;
    
    if (!accountNo || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const user = await db.executeQuery(
      'SELECT balance FROM users WHERE account_no = ?',
      [accountNo]
    );

    if (!user.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const newBalance = parseFloat(user[0].BALANCE) + parseFloat(amount);

    await db.executeQuery(
      'UPDATE users SET balance = ? WHERE account_no = ?',
      [newBalance, accountNo]
    );

    await db.executeQuery(
      'INSERT INTO transactions (account_no, type, amount, balance_after) VALUES (?, ?, ?, ?)',
      [accountNo, 'deposit', amount, newBalance]
    );

    res.json({ message: 'Deposit successful', newBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Withdraw money
router.post('/withdraw', async (req, res) => {
  try {
    const { accountNo, amount } = req.body;
    
    if (!accountNo || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const user = await db.executeQuery(
      'SELECT balance FROM users WHERE account_no = ?',
      [accountNo]
    );

    if (!user.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (parseFloat(user[0].BALANCE) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const newBalance = parseFloat(user[0].BALANCE) - parseFloat(amount);

    await db.executeQuery(
      'UPDATE users SET balance = ? WHERE account_no = ?',
      [newBalance, accountNo]
    );

    await db.executeQuery(
      'INSERT INTO transactions (account_no, type, amount, balance_after) VALUES (?, ?, ?, ?)',
      [accountNo, 'withdraw', amount, newBalance]
    );

    res.json({ message: 'Withdrawal successful', newBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get balance
router.get('/balance/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await db.executeQuery(
      'SELECT balance FROM users WHERE account_no = ?',
      [accountId]
    );

    if (!user.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ balance: user[0].BALANCE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions
router.get('/transactions/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const transactions = await db.executeQuery(
      'SELECT * FROM transactions WHERE account_no = ? ORDER BY date DESC',
      [accountId]
    );

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
