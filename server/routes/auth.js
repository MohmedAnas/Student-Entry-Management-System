const express = require("express");
const { login } = require("../controllers/authController");

const router = express.Router();

// 🔥 Handle preflight for login
router.options("/login", (req, res) => {
  res.sendStatus(200);
});

router.post("/login", login);

module.exports = router;
