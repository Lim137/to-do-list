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
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)";
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
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const storedHashedPassword = result.rows[0].password;
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
app.post("/tasks/create", async (req, res) => {
  const { user_id, task_name, task_description } = req.body;

  try {
    const query =
      "INSERT INTO tasks (user_id, task_name, task_description) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(query, [
      user_id,
      task_name,
      task_description,
    ]);

    res
      .status(201)
      .json({ message: "Task created successfully", task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/tasks/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const query = "SELECT * FROM tasks WHERE user_id = $1";
    const result = await pool.query(query, [user_id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/getUserByEmail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const userId = user.rows[0].id;
    res.json({ userId });
  } catch (error) {
    console.error("Ошибка при поиске пользователя по email:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
