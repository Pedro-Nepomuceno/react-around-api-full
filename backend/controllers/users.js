const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const ConflictError = require("../error/conflict-error");

const NotFoundError = require("../error/not-found-error");

const UnauthorizedError = require("../error/unauthorized-error");

const { HTTP_SUCCESS_OK } = require("../utils/status");

const { JWT_SECRET } = process.env;

const logger = require("../utils/logger");

const login = (req, res, next) => {
  const { email, password } = req.body;
  logger.debug(`Getting data after LOGIN: ${JSON.stringify(req.body)}`);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({
        _id: user._id,
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

// const getCurrentUser = (req, res, next) => {
//   if (!req.user._id) {
//     next(new NotFoundError("User ID not found in request"));
//   }
//   User.findById(req.user._id)
//     .orFail(new NotFoundError("User ID not found"))
//     .then((user) => res.status(HTTP_SUCCESS_OK).send(user))
//     .catch(next);
// };

const getCurrentUser = (req, res, next) => {
  logger.debug(
    `Getting current user. User in request: ${JSON.stringify(req.user)}`
  );
  logger.debug(
    `This is REQ.USER with  res.json(req.user);${res.json(req.user)}`
  );
  if (!req.user || !req.user._id) {
    return next(new UnauthorizedError("User not found in request"));
  }
  return User.findById(req.user._id)
    .orFail(new NotFoundError("User ID not found"))
    .then((user) => {
      logger.debug(`trying to find user by id:${JSON.stringify(user)}`);
      res.status(HTTP_SUCCESS_OK).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      logger.info(err);
      next(err);
    });
};

const getUserbyId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError("user not found"))
    .then((user) =>
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  logger.info(req.body);
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
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((data) => {
      logger.debug(
        `Getting data after using registration: ${JSON.stringify(req.user)}`
      );
      // Log response headers
      console.error(res.getHeaders());
      // Send response
      res.status(201).send({
        _id: data._id,
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
