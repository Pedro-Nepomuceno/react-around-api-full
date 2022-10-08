const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const {
  validateRequestAuth,
  validateCard,
  validateCardId,
} = require("../middleware/validation");

router.get("/", validateRequestAuth, getCards);
router.post("/cards", validateRequestAuth, validateCard, createCard);
router.delete(
  "/cards/:cardId",
  validateRequestAuth,
  validateCardId,
  deleteCard
);
router.put(
  "/cards/:cardId/likes",
  validateRequestAuth,
  validateCardId,
  likeCard
);
router.delete(
  "/:cardId/likes",
  validateRequestAuth,
  validateCardId,
  dislikeCard
);

module.exports = router;
