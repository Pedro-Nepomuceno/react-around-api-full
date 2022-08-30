const router = require("express").Router();
const { registerAdmin, authAdmin } = require("../controllers/admin");

router.post("/", registerAdmin);
router.post("/auth", authAdmin);

module.exports = router;
