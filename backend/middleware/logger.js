const winston = require("winston");
const expressWinston = require("express-winston");

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: "request.log" }),

    new winston.transports.Console(),
  ],
  format: winston.format.json(),
});

// error logger
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: "error.log" }),
    new winston.transports.Console(),
  ],
  format: winston.format.json(),
});
module.exports = {
  requestLogger,
  errorLogger,
};
