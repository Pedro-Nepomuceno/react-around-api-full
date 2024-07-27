const router = require("express").Router();
const auth = require("../middleware/auth");

const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");
const cardRouter = require("./cards");

const { validateLogin, validateUser } = require("../middleware/validation");

router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogin, login);

router.use("/users", auth, userRouter);
router.use("/cards", auth, cardRouter);

module.exports = router;
