const router = require("express").Router();
const auth = require("../middleware/auth");
const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");
const cardRouter = require("./cards");

const { validateLogin, validateUser } = require("../middleware/validation");

router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogin, login);

router.use(auth);

router.use("/users", userRouter);
router.use("/cards", cardRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resources not found" });
});

module.exports = router;
