const pool = require("../db");

// Создать новую нерешенную задачу
const createTask = async (req, res) => {
  try {
    const { list_id, title } = req.body;
    const query =
      "INSERT INTO uncompleted_tasks (list_id, title) VALUES ($1, $2) RETURNING *";
    const values = [list_id, title];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Обновить нерешенную задачу по ID
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const query =
      "UPDATE uncompleted_tasks SET title = $1 WHERE id = $2 RETURNING *";
    const values = [title, id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unresolved task not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Удалить нерешенную задачу по ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM uncompleted_tasks WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unresolved task not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getAllUncompletedTasksByListId = async (req, res) => {
  try {
    const { list_id } = req.params;
    const query =
      "SELECT * FROM uncompleted_tasks WHERE list_id = $1 ORDER BY id";
    const result = await pool.query(query, [list_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const deleteAllUncompletedTasksFromDB = async (req, res) => {
  try {
    const { id } = req.params;
    const query =
      "DELETE FROM uncompleted_tasks WHERE list_id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unresolved task not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllUncompletedTasksByListId,
  deleteAllUncompletedTasksFromDB,
};
