const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// create connection pool to MySQL database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// get all users
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

// get a single user by id
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  pool.query('SELECT * FROM users WHERE id = ?', [userId], (error, results, fields) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

// create a new user
app.post('/users', (req, res) => {
  const { fname, lname, username, avatar } = req.body;
  pool.query('INSERT INTO users (fname, lname, username, avatar) VALUES (?, ?, ?, ?)', [fname, lname, username, avatar], (error, results, fields) => {
    if (error) throw error;
    res.send({ id: results.insertId, fname, lname, username, avatar });
  });
});

// update an existing user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { fname, lname, username, avatar } = req.body;
  pool.query('UPDATE users SET fname = ?, lname = ?, username = ?, avatar = ? WHERE id = ?', [fname, lname, username, avatar, userId], (error, results, fields) => {
    if (error) throw error;
    res.send({ id: userId, fname, lname, username, avatar });
  });
});

// delete a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  pool.query('DELETE FROM users WHERE id = ?', [userId], (error, results, fields) => {
    if (error) throw error;
    res.send(`User with id ${userId} has been deleted.`);
  });
});

// start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});