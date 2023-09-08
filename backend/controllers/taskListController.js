const pool = require("../db");

// Создать новый список задач
const createTaskList = async (req, res) => {
  try {
    const { title, user_id } = req.body;
    const query =
      "INSERT INTO tasklists (title, user_id) VALUES ($1, $2) RETURNING *";
    const values = [title, user_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Получить все списки задач по userId
const getAllTaskListsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const query =
      "SELECT list_id as id, title FROM tasklists WHERE user_id = $1 ORDER BY list_id";
    const result = await pool.query(query, [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Получить список задач по ID
const getTaskListById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM tasklists WHERE id = $1";
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task list not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Обновить список задач по ID
const updateTaskList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const query =
      "UPDATE tasklists SET title = $1 WHERE list_id = $2 RETURNING *";
    const values = [title, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task list not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Удалить список задач по ID
const deleteTaskList = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM tasklists WHERE list_id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task list not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createTaskList,
  getAllTaskListsByUserId,
  getTaskListById,
  updateTaskList,
  deleteTaskList,
};
