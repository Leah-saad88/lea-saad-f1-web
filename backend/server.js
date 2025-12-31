const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// DB connection (use Railway environment variables)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'f1_merch',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to database');
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Signup failed. Email may already exist.' });
    }
    res.json({ message: 'User registered successfully' });
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT id, name, email FROM user WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Login error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful', user: results[0] });
  });
});


app.post('/order', (req, res) => {
  const { user_id, item_name, item_image, address, quantity } = req.body;

  if (!user_id || !item_name || !item_image || !address || !quantity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO orders (user_id, item_name, item_image, address, quantity)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [user_id, item_name, item_image, address, quantity], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save order' });
    }
    res.json({ message: 'Order placed successfully! Your shipment will arrive in 3 days.' });
  });
});

// ✅ Use Railway's dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});