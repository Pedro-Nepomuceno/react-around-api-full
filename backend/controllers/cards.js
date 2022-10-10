const NotFoundError = require("../error/not-found-error");
const UnauthorizedError = require("../error/unauthorized-error");
const BadRequestError = require("../error/bad-request-error");

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
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(req.params.id)
    .orFail(() => {
      new NotFoundError("Card ID not found");
    })
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        throw new UnauthorizedError("Dont have permission to delete");
      }
      Card.findByIdAndDelete(req.params.id)
        .orFail(() => {
          new NotFoundError("Card ID not found");
        })
        .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
        .catch(next);
    })

    .catch(next);
};

const likeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const id = req.params.id;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: currentUser } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Card ID not found"))
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const cardId = req.params.id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: currentUser } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Card ID not found"))
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
