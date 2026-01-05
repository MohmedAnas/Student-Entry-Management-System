const router = require("express").Router();
const { login } = require("../controllers/authController");

// No need for manual OPTIONS here if app.options("*", ...) is above.
router.post("/login", login);

module.exports = router;
