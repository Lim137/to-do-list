const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const port = process.env.PORT || 3000;
const taskListRoutes = require("./routes/taskListRoutes");
const userRoutes = require("./routes/user");
const unsolvedTaskRoutes = require("./routes/unsolvedTasksRoutes");
const solvedTaskRoutes = require("./routes/solvedTasksRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/task-lists", taskListRoutes);
app.use("/", userRoutes);
app.use("/unsolved", unsolvedTaskRoutes);
app.use("/solved", solvedTaskRoutes);

const pool = require("./db");

// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is the backend for My Todo List app!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query =
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
    await pool.query(query, [firstName, lastName, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" + error.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await pool.query(query, [email]);
    if (result.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const storedHashedPassword = result[0][0].password;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (passwordMatch) {
      res.status(200).json({ message: "Logged in successfully" });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});