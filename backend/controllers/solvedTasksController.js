const pool = require("../db");

// Добавить новую решенную задачу
const addCompletedTask = async (req, res) => {
  try {
    const { list_id, title } = req.body;
    const query = "INSERT INTO completed_tasks (list_id, title) VALUES (?, ?)";
    const values = [list_id, title];
    await pool.query(query, values);
    res.status(201).json({ message: "Completed task created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to create completed task" });
  }
};

const getAllCompletedTasksByListId = async (req, res) => {
  try {
    const { list_id } = req.params;
    const query = "SELECT * FROM completed_tasks WHERE list_id = ? ORDER BY id";
    const result = await pool.query(query, [list_id]);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const deleteAllCompletedTasksFromDB = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM completed_tasks WHERE list_id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ message: "Completed tasks deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred when try to delete completed tasks" });
  }
};
const getCountOfCompletedTasks = async (req, res) => {
  try {
    const { list_id } = req.params;
    const query =
      "SELECT COUNT(*) AS count FROM completed_tasks WHERE list_id = ?";
    const [rows] = await pool.query(query, [list_id]);
    const count = rows[0].count;
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const deleteOldestCompletedTaskByListId = async (req, res) => {
  try {
    const { list_id } = req.params;

    // Находим ID самой ранней задачи для заданного списка
    const selectQuery = `
      SELECT MIN(id) AS oldest_task_id
      FROM completed_tasks
      WHERE list_id = ?
    `;
    const [selectResult] = await pool.query(selectQuery, [list_id]);

    if (selectResult.length === 0 || !selectResult[0].oldest_task_id) {
      return res
        .status(404)
        .json({ error: "No tasks found in the specified list" });
    }

    const oldestTaskId = selectResult[0].oldest_task_id;

    // Удаляем найденную задачу
    const deleteQuery = `
      DELETE FROM completed_tasks
      WHERE id = ?
    `;
    await pool.query(deleteQuery, [oldestTaskId]);

    res.status(200).json({
      message:
        "Oldest completed task in the specified list deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  addCompletedTask,
  getAllCompletedTasksByListId,
  deleteAllCompletedTasksFromDB,
  getCountOfCompletedTasks,
  deleteOldestCompletedTaskByListId,
};
