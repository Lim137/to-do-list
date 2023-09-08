const express = require("express");
const router = express.Router();
const taskListController = require("../controllers/taskListController");

// Маршруты для списков задач
router.post("/", taskListController.createTaskList);
router.get("/:id", taskListController.getAllTaskListsByUserId);
router.put("/:id", taskListController.updateTaskList);
router.delete("/:id", taskListController.deleteTaskList);

module.exports = router;
