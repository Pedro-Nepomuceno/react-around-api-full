const router = require("express").Router();

const registerAdmin = require("../controllers/admin");

router.post("/register", registerAdmin);

module.exports = router;
