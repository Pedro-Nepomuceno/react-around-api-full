const NotFoundError = require("../error/not-found-error");
const UnauthorizedError = require("../error/unauthorized-error");

const Card = require("../models/card");
const {
  HTTP_SUCCESS_OK,
  HTTP_CLIENT_ERROR_BAD_REQUEST,
  HTTP_CLIENT_ERROR_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require("../utils/status");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_SUCCESS_OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new NotFoundError("Invalid login credentials"));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch(next);
};

const likeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;
  console.log("CURRENTUSER", currentUser, { cardId });
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: currentUser } },
    { new: true }
  )
    .orFail(new UnauthorizedError())
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: currentUser } },
    { new: true }
  )
    .orFail(new UnauthorizedError())
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
