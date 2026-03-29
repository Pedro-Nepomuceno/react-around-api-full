const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const { validateCard, validateCardId } = require("../middleware/validation");

router.get("/", getCards);
router.post("/", validateCard, createCard);
router.delete("/:id", validateCardId, deleteCard);
router.put("/:id/likes", validateCardId, likeCard);
router.delete("/:id/likes", validateCardId, dislikeCard);

module.exports = router;
