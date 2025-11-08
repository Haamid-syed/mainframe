const express = require('express');
const cors = require('cors');
const db = require('./db/db2');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', accountRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
