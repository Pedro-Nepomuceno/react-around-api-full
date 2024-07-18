const jwt = require("jsonwebtoken");

const { JWT_SECRET = "JWT_SECRET" } = process.env;
const { NODE_ENV = "NODE_ENV" } = process.env;
const UnauthorizedError = require("../error/unauthorized-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.userId = payload._id;
  // req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};

module.exports = auth;
