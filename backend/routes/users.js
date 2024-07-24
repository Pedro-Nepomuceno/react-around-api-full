const router = require("express").Router();

const {
  getUsers,
  getCurrentUser,
  getUserbyId,
  updateUserProfile,
  updateAvatar,
} = require("../controllers/users");

const {
  validateRequestAuth,
  validateUserId,
} = require("../middleware/validation");

router.get("/", validateRequestAuth, getUsers);
// router.get("/me", validateRequestAuth, getCurrentUser);
router.get("/me", validateRequestAuth, (req, res, next) => {
  console.log("GET /users/me route hit");
  getCurrentUser(req, res, next);
});
router.get("/:id", validateRequestAuth, validateUserId, getUserbyId);
router.patch("/me", validateRequestAuth, updateUserProfile);
router.patch("/me/avatar", validateRequestAuth, updateAvatar);

module.exports = router;
