const jwt = require("jsonwebtoken");

const JWT_SECRET = "";

const getJwtToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET);
};
