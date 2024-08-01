const NotFoundError = require("../error/not-found-error");

const BadRequestError = require("../error/bad-request-error");

const ForbiddenError = require("../error/forbiddenError");

const Card = require("../models/card");
const { HTTP_SUCCESS_OK } = require("../utils/status");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) =>
      res.status(HTTP_SUCCESS_OK).send(
        JSON.stringify([
          ...cards,
          {
            name: "Summer",
            _id: "default1",
            link: "https://unsplash.com/photos/a-hammock-hanging-from-a-palm-tree-on-a-beach-QoWDbXGnl3E",
            owner: "",
            likes: ["1"],
          },
          {
            name: "winter",
            _id: "default2",
            link: "https://avatars.mds.yandex.net/i?id=04e4bc09d4337ef9bbcf7aa0a8df37437f018b8e-9727996-images-thumbs&n=13",
            owner: "",
            likes: ["2"],
          },
          {
            name: "Fall",
            _id: "default3",
            link: "https://avatars.mds.yandex.net/i?id=b06ff5dd50cde73ed72b7bffcb3ba3402b1b4836-8378316-images-thumbs&n=13",
            owner: "",
            likes: [],
          },
        ])
      )
    )
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
  Card.findById(req.params.id)
    .orFail(() => {
      new NotFoundError("Card ID not found");
    })
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        next(new ForbiddenError("Dont have permission to delete"));
      }
      Card.findByIdAndDelete(req.params.id)
        .orFail(() => {
          new NotFoundError("Card ID not found");
        })
        .then((data) => res.status(HTTP_SUCCESS_OK).send(data))
        .catch(next);
    })

    .catch(next);
};

const likeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { id } = req.params.id;

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
