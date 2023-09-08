const express = require("express");
const router = express.Router();
const taskController = require("../controllers/unsolvedTasksController");

// Создать новую нерешенную задачу
router.post("/", taskController.createTask);

// Обновить нерешенную задачу по ID
router.put("/:id", taskController.updateTask);

// Удалить нерешенную задачу по ID
router.delete("/:id", taskController.deleteTask);

router.get("/all/:list_id", taskController.getAllUncompletedTasksByListId);

router.delete("/all/:id", taskController.deleteAllUncompletedTasksFromDB);

module.exports = router;
