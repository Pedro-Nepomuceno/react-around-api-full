const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const ConflictError = require("../error/conflict-error");

const NotFoundError = require("../error/not-found-error");

const { HTTP_SUCCESS_OK } = require("../utils/status");

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
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        token,
      });
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
  User.findById(req.params.id)
    .orFail(new NotFoundError("user not found"))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

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
      console.log(name, about, avatar, email, hash);
      User.create({ name, about, avatar, email, password: hash });
    })
    .then((data) => {
      console.log({ data });
      res.status(201).send({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
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
    .orFail(() => new NotFoundError("User ID not found"))
    .then((user) => res.status(HTTP_SUCCESS_OK).send(user))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const currentUser = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => new NotFoundError("User ID not found"))
    .then((user) => res.status(HTTP_SUCCESS_OK).send(user))
    .catch(next);
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
