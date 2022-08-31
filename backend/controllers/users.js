const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ConflictError = require("../error/conflict-error");

const notFoundError = require("../error/not-found-error");

const badRequestError = require("../error/bad-request-error");

const unAuthorizedError = require("../error/unauthorized-error");

const SALT_ROUNDS = 10;

const {
  HTTP_SUCCESS_OK,
  HTTP_CLIENT_ERROR_BAD_REQUEST,
  HTTP_CLIENT_ERROR_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require("../utils/status");

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new unAuthorizedError("Incorrect email or password"));
    });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(HTTP_SUCCESS_OK).send(users))
    .catch(() =>
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );
};

const getUserbyId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((users) => users.find((user) => user._id === req.params.id))
    .then((user) => {
      if (!user) {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: "User ID not found" });
        return;
      }
      res.status(HTTP_SUCCESS_OK).send(user);
    })
    .catch(() =>
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(418).send({ message: "OpS SomEtHiNg wENt WRoNg" });
  }

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.findOne({ email }).then((admin) => {
      if (admin) {
        throw new ConflictError(
          "The user with the provided email already exists"
        );
      }
      return User.create({ ...req.body, password: hash })
        .then((admin) => {
          return res.status(200).send({ admin });
        })
        .catch(() => {
          res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: "Error" });
        });
    });
  });
};

const updateUserProfile = (req, res) => {
  const currentUser = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(HTTP_SUCCESS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: " User not found" });
      } else if (err.name === "ValidationError") {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else if (err.name === "CastError") {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: "Invalid User ID passed for updation",
        });
      } else {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const currentUser = req.user._id;
  const { avatar } = req.body;

  User.findOneAndUpdate(
    currentUser,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(HTTP_SUCCESS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: "User not found" });
      } else if (err.name === "ValidationError") {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else if (err.name === "CastError") {
        res.status(HTTP_CLIENT_ERROR_BAD_REQUEST).send({
          message: "Invalid avatar link passed for updation",
        });
      } else {
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

module.exports = {
  login,
  getUsers,
  getUserbyId,
  createUser,
  updateUserProfile,
  updateAvatar,
};
