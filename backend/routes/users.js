const router = require("express").Router();

const {
  getUsers,
  getCurrentUser,
  getUserbyId,
  updateUserProfile,
  updateAvatar,
} = require("../controllers/users");

const { validateUserId } = require("../middleware/validation");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
// router.get("/me", validateRequestAuth, (req, res, next) => {
//   console.log("GET /users/me route hit");
//   getCurrentUser(req, res, next);
// });
router.get("/:id", validateUserId, getUserbyId);
router.patch("/me", updateUserProfile);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
