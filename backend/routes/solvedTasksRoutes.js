const express = require("express");
const router = express.Router();
const taskController = require("../controllers/solvedTasksController");

router.post("/", taskController.addCompletedTask);

router.get("/all/:list_id", taskController.getAllCompletedTasksByListId);

router.delete("/all/:id", taskController.deleteAllCompletedTasksFromDB);

module.exports = router;
