// Deployed via automated CI/CD pipeline
// server.js
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "../client/build")));

// MySQL connection pool (auto-reconnects, unlike a single connection)
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "crud_db",
});

// Test DB connection
db.query("SELECT 1", (err) => {
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
app.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Sign up successful", userId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  });
});
/************************************************************** */

// Add new user
app.post("/users", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, name, email, phone });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?";
    db.query(sql, [name, email, phone, hashedPassword, id], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
