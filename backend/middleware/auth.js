const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const UnauthorizedError = require("../error/unauthorized-error");

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;
  return next();
};

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return next(new UnauthorizedError("Authorization Required"));
//   }

//   const token = authorization.replace("Bearer ", "");
//   let payload;

//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//     console.log("Decoded payload:", payload);
//   } catch (err) {
//     console.error("JWT verification error:", err);
//     return next(new UnauthorizedError("Authorization Required"));
//   }

//   req.user = payload;

//   console.log("User set in request:", req.user);

//   return next();
// };

module.exports = auth;
