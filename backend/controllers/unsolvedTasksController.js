const pool = require("../db");

// Создать новую нерешенную задачу
const createTask = async (req, res) => {
  try {
    const { list_id, title } = req.body;
    const query =
      "INSERT INTO uncompleted_tasks (list_id, title) VALUES (?, ?)";
    const values = [list_id, title];
    await pool.query(query, values);
    res.status(201).json({ message: "Uncompleted task created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to create uncompleted task" });
  }
};

// Обновить нерешенную задачу по ID
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const query = "UPDATE uncompleted_tasks SET title = ? WHERE id = ?";
    const values = [title, id];
    await pool.query(query, values);
    res.status(200).json({ message: "Uncompleted task updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to update uncompleted task" });
  }
};

// Удалить нерешенную задачу по ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM uncompleted_tasks WHERE id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ message: "Uncompleted task deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to delete uncompleted task" });
  }
};

const getAllUncompletedTasksByListId = async (req, res) => {
  try {
    const { list_id } = req.params;
    const query =
      "SELECT * FROM uncompleted_tasks WHERE list_id = ? ORDER BY id";
    const result = await pool.query(query, [list_id]);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const deleteAllUncompletedTasksFromDB = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM uncompleted_tasks WHERE list_id = ?";
    await pool.query(query, [id]);

    res.status(200).json({ message: "Uncompleted tasks deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error when try to delete all uncompleted tasks" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllUncompletedTasksByListId,
  deleteAllUncompletedTasksFromDB,
};
