const router = require("express").Router();
const auth = require("../middleware/auth");
const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");
const cardRouter = require("./cards");
// const adminRouter = require("./admin");

router.post("/signup", createUser);
router.post("/signin", login);
router.use(auth);
router.use("/users", userRouter);
router.use("/cards", cardRouter);
// router.use("/register", adminRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resources not found" });
});

module.exports = router;
