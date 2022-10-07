const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ConflictError = require("../error/conflict-error");

const NotFoundError = require("../error/not-found-error");

const BadRequestError = require("../error/bad-request-error");

const UnAuthorizedError = require("../error/unauthorized-error");

const {
  HTTP_SUCCESS_OK,
  HTTP_CLIENT_ERROR_BAD_REQUEST,
  HTTP_CLIENT_ERROR_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} = require("../utils/status");
const UnauthorizedError = require("../error/unauthorized-error");

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log({ user });
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );
      console.log(
        "firstjwt",
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
      );
      return res.send({ data: user.toJSON(), token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_SUCCESS_OK).send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError("User ID not found"))
    .then((user) => res.status(HTTP_SUCCESS_OK).send(user))
    .catch(next);
};

const getUserbyId = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new NotFoundError("User ID not found"))
    .then((users) => users.find((user) => user._id === req.params.id))
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User ID not found");
      }
      res.status(HTTP_SUCCESS_OK).send(user);
    })
    .catch(next);
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(418).send({ message: "OpS SomEtHiNg wENt WRoNg" });
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          "The user with the provided email already exists"
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash });
    })
    .then((admin) => {
      res.status(201).send({ admin });
    })
    .catch((error) => {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: error.message });
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
  console.log("currentuser", currentUser, { avatar });

  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new BadRequestError())
    .then((user) => res.status(HTTP_SUCCESS_OK).send({ data: user }))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  login,
  getUsers,
  getCurrentUser,
  getUserbyId,
  createUser,
  updateUserProfile,
  updateAvatar,
};
