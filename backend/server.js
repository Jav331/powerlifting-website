const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

console.log('TEST_VAR:', process.env.TEST_VAR);

const app = express();

app.use(express.json());
app.use(cors());

app.use(cors({
  origin: ['https://main.dhneriygykmo0.amplifyapp.com', 'http://localhost:3001'], // frontend URLs
  methods: ['GET', 'POST', 'DELETE', 'OPTION'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// connection to the SQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the DB', err);
    return;
  }
  console.log('Connected to the DB');
});

// route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Powerlifting App API');
});

// route for Registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  try {
    // Check if username already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking existing user:', checkErr);
        return res.status(500).json({ error: 'Error checking existing user' });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // If username doesn't exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [firstName, lastName, username, hashedPassword], (insertErr, result) => {
        if (insertErr) {
          console.error('Error inserting new user:', insertErr);
          return res.status(500).json({ error: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    res.status(500).json({ error: 'Error hashing password' });
  }
});

// route for Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error logging in' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
    } else {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).json({ message: 'Login successful', userId: user.id });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  });
});

// route for tracking workouts
app.post('/track', (req, res) => {
  const { userId, date, description } = req.body;
  
  
  const query = 'INSERT INTO workouts (userId, date, description) VALUES (?, ?, ?)';
  
  db.query(query, [userId, date, description], (err, result) => {
    if (err) {
      console.error('Error inserting workout:', err);
      res.status(500).json({ error: 'Error tracking workout' });
    } else {
      res.status(201).json({ message: 'Workout tracked successfully', workoutId: result.insertId });
    }
  });
});

// route for fetching user's workouts
app.get('/workouts/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const query = 'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") AS formattedDate FROM workouts WHERE userId = ? ORDER BY date DESC';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching workouts:', err);
      res.status(500).json({ error: 'Error fetching workouts' });
    } else {
      const formattedResults = results.map(workout => ({
        ...workout,
        date: workout.formattedDate
      }));
      res.status(200).json(formattedResults);
    }
  });
});

// route for deleting a workout
app.delete('/workouts/:id', (req, res) => {
  const workoutId = req.params.id;
  
  const query = 'DELETE FROM workouts WHERE id = ?';
  
  db.query(query, [workoutId], (err, result) => {
    if (err) {
      console.error('Error deleting workout:', err);
      res.status(500).json({ error: 'Error deleting workout' });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Workout deleted successfully' });
      } else {
        res.status(404).json({ error: 'Workout not found' });
      }
    }
  });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));