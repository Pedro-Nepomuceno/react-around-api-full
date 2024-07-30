const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

console.log("JWT_SECRET:", JWT_SECRET);

const UnauthorizedError = require("../error/unauthorized-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Decoded payload:", payload);
  } catch (err) {
    console.error("JWT verification error:", err);
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload; // assigning the payload to the request object

  console.log("User set in request:", req.user);

  return next(); // sending the request to the next middleware
};

module.exports = auth;
