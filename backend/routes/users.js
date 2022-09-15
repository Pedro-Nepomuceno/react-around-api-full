const router = require("express").Router();

const {
  getUsers,
  getUserbyId,
  updateUserProfile,
  updateAvatar,
} = require("../controllers/users");

const {
  validateRequestAuth,
  validateUserId,
} = require("../middleware/validation");

router.get("/", validateRequestAuth, getUsers);
router.get("/:userId", validateRequestAuth, validateUserId, getUserbyId);
router.patch("/me", validateRequestAuth, updateUserProfile);
router.patch("/me/avatar", validateRequestAuth, updateAvatar);

module.exports = router;
