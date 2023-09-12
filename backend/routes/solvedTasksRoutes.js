const express = require("express");
const router = express.Router();
const taskController = require("../controllers/solvedTasksController");

router.post("/", taskController.addCompletedTask);

router.get("/all/:list_id", taskController.getAllCompletedTasksByListId);

router.delete("/all/:id", taskController.deleteAllCompletedTasksFromDB);

router.get("/quantity/:list_id", taskController.getCountOfCompletedTasks);

router.delete(
  "/oldest/:list_id",
  taskController.deleteOldestCompletedTaskByListId
);

module.exports = router;
