const router = require('express').Router();

const {
  getUsers,
  getUserbyId,
  createUser,
  updateUserProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserbyId);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
