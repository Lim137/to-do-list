const express = require("express");
const router = express.Router();
const pool = require("../db");

// Маршрут для поиска пользователя по почте и получения его ID
router.get("/getUserByEmail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Ищем пользователя по email в базе данных
    const user = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (user[0][0].id === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const userId = user[0][0].id;
    res.json({ userId });
  } catch (error) {
    console.error("Ошибка при поиске пользователя по email:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
