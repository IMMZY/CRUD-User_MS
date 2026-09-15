// server.js
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "../client/build")));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crud_db",
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database.");
  }
});

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

/************************************************************** */
// Sign Up
app.post("/signup", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: "All fields are required" });

  const sql =
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Sign up successful", userId: result.insertId });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });
    res.json({ message: "Login successful", user: result[0] });
  });
});
/************************************************************** */

// Add new user
app.post("/users", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, name, email, phone, password });
  });
});

// Get user
app.get("/users", (req, res) => {
  db.query("SELECT id, name, email, phone FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Update user by id
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  const sql =
    "UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?";
  db.query(sql, [name, email, phone, password, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User updated successfully" });
  });
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User deleted successfully" });
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening.... port:${PORT}`);
});
