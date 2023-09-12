const pool = require("../db");

// Создать новый список задач
const createTaskList = async (req, res) => {
  try {
    const { title, user_id } = req.body;
    const query = "INSERT INTO tasklists (title, user_id) VALUES (?, ?)";
    const values = [title, user_id];
    await pool.query(query, values);
    res.status(201).json({ message: "Tasklist created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to create tasklist" });
  }
};

// Получить все списки задач по userId
const getAllTaskListsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const query =
      "SELECT list_id as id, title FROM tasklists WHERE user_id = ? ORDER BY list_id";
    const result = await pool.query(query, [id]);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Получить список задач по ID
const getTaskListById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM tasklists WHERE id = ?";
    const result = await pool.query(query, [id]);
    if (result[0].length === 0) {
      return res.status(404).json({ error: "Task list not found" });
    }
    res.status(200).json(result[0]);
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
    const query = "UPDATE tasklists SET title = ? WHERE list_id = ?";
    const values = [title, id];
    await pool.query(query, values);
    res.status(200).json({ message: "tasklist updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to update tasklist" });
  }
};

// Удалить список задач по ID
const deleteTaskList = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM tasklists WHERE list_id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ message: "Tasklist deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to delete tasklist" });
  }
};

module.exports = {
  createTaskList,
  getAllTaskListsByUserId,
  getTaskListById,
  updateTaskList,
  deleteTaskList,
};
